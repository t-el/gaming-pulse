import rss from '@astrojs/rss';
import { getReports, reportPath } from '../lib/reports';
import { absoluteUrl, editionAnchor } from '../lib/paths';

export async function GET() {
  const reports = await getReports();
  const items = reports.flatMap((report) =>
    report.data.editions.map((edition) => ({
      title: `${edition.title}: ${report.data.title}`,
      description: edition.summary ?? report.data.description,
      pubDate: edition.publishedAt,
      link: absoluteUrl(`${reportPath(report)}#${editionAnchor(edition.id)}`),
      categories: report.data.tags,
    })),
  );

  items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Gaming Pulse',
    description: 'Three gaming news editions a day: morning, afternoon, and evening, Eastern time.',
    site: absoluteUrl('/'),
    items,
    customData: '<language>en-us</language>',
    trailingSlash: true,
  });
}
