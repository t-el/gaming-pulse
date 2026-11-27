import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Project site: https://t-el.github.io/gaming-pulse/
// `site` is the GitHub Pages origin. `base` is the repository path.
export default defineConfig({
  site: 'https://t-el.github.io',
  base: '/gaming-pulse',
  output: 'static',
  trailingSlash: 'always',
  prefetch: false,
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],
});
