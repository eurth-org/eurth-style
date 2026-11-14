// What this tool is called and where it lives. Read at build time only: astro.config.mjs, the
// frontmatter of .astro pages, tests and tools/. Never import this from a Svelte component or a
// <script>: it pulls in the list of every Eurth tool, and browser code must not carry that
// (HANDBOOK.md, Launch). Hand the component what it needs as props instead.
import { defineSite } from '@eurth/style/build';

export const site = defineSite({
  // The subdomain, and the tool's id in @eurth/style's tools.json.
  id: 'starter',
  name: 'Starter',
  url: 'https://starter.eurth.org',
  // "<Name>: free online <thing> maker for worldbuilders"
  title: 'Starter: free online motto plate maker for worldbuilders',
  description: 'A free online motto plate maker for worldbuilders: give your nation a name and a motto, and take the plate with you as a link, a picture or a profile file. No account needed.',
  tagline: 'The smallest Eurth tool',
  pages: [
    { href: '/', label: 'Maker' },
    { href: '/templates/', label: 'Templates' },
    { href: '/guide/', label: 'Guide' },
    { href: '/glossary/', label: 'Glossary' },
  ],
  repo: 'https://github.com/eurth-org/eurth-starter',
  ogAlt: 'Starter, the smallest Eurth tool, at starter.eurth.org: the Eurth yurt beside a motto plate.',
});
