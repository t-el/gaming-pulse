/** Prefix a site path with the GitHub Pages base (`/gaming-pulse/`). */
export function href(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${normalized}`;
}

/** Absolute URL for a site path, including the project base. */
export function absoluteUrl(path: string): string {
  const site = import.meta.env.SITE ?? 'https://t-el.github.io';
  const origin = site.endsWith('/') ? site : `${site}/`;
  return new URL(href(path), origin).href;
}

export function mediaUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return href(src.startsWith('/') ? src : `/${src}`);
}

export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Fragment used by edition jump links. Matches the `id` in frontmatter. */
export function editionAnchor(id: string): string {
  return id.trim().toLowerCase();
}
