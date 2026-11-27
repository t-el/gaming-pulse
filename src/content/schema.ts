import { z } from 'astro/zod';

/**
 * Calendar day for a report.
 * Accepts a YAML date (parsed as a Date at UTC midnight), a `YYYY-MM-DD`
 * string, or a datetime whose America/New_York calendar day is used.
 * A morning-only file and a file with later editions appended both pass.
 */
export const calendarDate = z.preprocess((value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const utcMidnight =
      value.getUTCHours() === 0 &&
      value.getUTCMinutes() === 0 &&
      value.getUTCSeconds() === 0 &&
      value.getUTCMilliseconds() === 0;
    if (utcMidnight) return value.toISOString().slice(0, 10);
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(value);
  }
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }
  return value;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a YYYY-MM-DD calendar date'));

/** One published slice of a day's report. Extra keys are kept. */
export const editionSchema = z.looseObject({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  publishedAt: z.coerce.date(),
  summary: z.string().trim().min(1).optional(),
});

const tagsSchema = z.preprocess((value) => {
  if (typeof value === 'string') return [value];
  if (value == null) return [];
  return value;
}, z.array(z.string().trim().min(1)).default([]));

const optionalCover = z.preprocess((value) => {
  if (value == null || value === '') return undefined;
  return value;
}, z.string().trim().min(1).optional());

/**
 * Frontmatter for `content/reports/YYYY-MM-DD.md`.
 *
 * The object is loose on purpose: an automated writer may add keys while
 * appending an edition, and a file with only the morning edition is valid.
 * `editions` has no maximum, so afternoon and evening entries can be appended
 * without changing this schema.
 */
export const reportSchema = z.looseObject({
  title: z.string().trim().min(1),
  date: calendarDate,
  description: z.string().trim().min(1),
  tags: tagsSchema,
  cover: optionalCover,
  updated: z.coerce.date(),
  sample: z.boolean().default(false),
  editions: z.array(editionSchema).min(1),
});

export type ReportFrontmatter = z.infer<typeof reportSchema>;
export type EditionFrontmatter = z.infer<typeof editionSchema>;
