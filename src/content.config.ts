import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { reportSchema } from './content/schema';

const reports = defineCollection({
  loader: glob({
    pattern: '**/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9].md',
    base: './content/reports',
    generateId: ({ entry }) => entry.replace(/\.md$/, '').replace(/^.*\//, ''),
  }),
  schema: reportSchema,
});

export const collections = { reports };
