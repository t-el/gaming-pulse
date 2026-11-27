import { getCollection, type CollectionEntry } from 'astro:content';

export type Report = CollectionEntry<'reports'>;

export async function getReports(): Promise<Report[]> {
  const reports = await getCollection('reports');
  return reports.sort((a, b) => {
    const byDate = b.data.date.localeCompare(a.data.date);
    if (byDate !== 0) return byDate;
    return b.data.updated.getTime() - a.data.updated.getTime();
  });
}

export function reportPath(report: Report): string {
  return `/reports/${report.id}/`;
}

export interface MonthGroup {
  year: string;
  month: string;
  reports: Report[];
}

export function groupByMonth(reports: Report[]): MonthGroup[] {
  const groups = new Map<string, MonthGroup>();
  for (const report of reports) {
    const [year, month] = report.data.date.split('-');
    const key = `${year}-${month}`;
    const existing = groups.get(key);
    if (existing) existing.reports.push(report);
    else groups.set(key, { year, month, reports: [report] });
  }
  return [...groups.values()];
}

export function reportsByTag(reports: Report[]): Map<string, Report[]> {
  const map = new Map<string, Report[]>();
  for (const report of reports) {
    for (const tag of report.data.tags) {
      const list = map.get(tag);
      if (list) list.push(report);
      else map.set(tag, [report]);
    }
  }
  return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}
