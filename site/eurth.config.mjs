// The docs site's own facts. It is documentation, not a tool, so it isn't in tools.json.
import { defineSite } from '../src/build.js';
import { lineClipboardList, lineGrid3, linePaintDrop } from '../src/line.js';

export const site = defineSite({
  id: 'style',
  name: 'Style',
  url: 'https://style.eurth.org',
  title: "Style: the shared look and shell of Eurth's worldbuilding tools",
  description: "The tokens, components and rules that every Eurth worldbuilding tool is built from: one look, one shell, two themes, WCAG AAA text and nothing stored.",
  tagline: 'One look for every Eurth tool',
  pages: [
    { href: '/', label: 'Components', icon: lineGrid3 },
    { href: '/tokens/', label: 'Tokens', icon: linePaintDrop },
    { href: '/handbook/', label: 'Handbook', icon: lineClipboardList },
  ],
  repo: 'https://github.com/eurth-org/eurth-style',
  ogAlt: "Style, one look for every Eurth tool, at style.eurth.org: the Eurth yurt beside a row of the suite's buttons.",
  sound: true,
});
