// Turns tokens.json into what tools use:
//   dist/eurth.css      custom properties for both themes, then the base styles (src/css)
//   src/generated.js    the head script and the browser theme colours, with the tokens' values
// Both are committed, because tools install @eurth/style straight from GitHub and nothing is
// built on their side. CI fails when a build would change it.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolveColors } from '../src/contrast.js';

const root = new URL('..', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const tokens = JSON.parse(read('tokens.json'));
const version = JSON.parse(read('package.json')).version;

const alias = (value) => value.replace(/^\{([\w.-]+)\}$/, 'var(--$1)');
const first = tokens.color.themes[0].id;
const colorsFor = (theme) =>
  tokens.color.tokens.map((t) => `  --${t.name}: ${alias(typeof t.value === 'string' ? t.value : (t.value[theme] ?? t.value[first]))};`).join('\n');

// Everything that isn't a colour is the same in both themes.
const fixed = [];
for (const [name, stack] of Object.entries(tokens.type.families)) fixed.push(`  --font-${name}: ${stack};`);
for (const group of tokens.type.groups) {
  for (const style of group.styles) {
    fixed.push(`  --type-${style.name}: ${style.fontWeight} ${style.fontSize}/${style.lineHeight} var(--font-${style.family ?? group.family});`);
    if (style.letterSpacing) fixed.push(`  --type-${style.name}-tracking: ${style.letterSpacing};`);
  }
}
for (const family of ['spacing', 'size', 'radius', 'shadow', 'canvas']) {
  for (const t of tokens[family]?.tokens ?? []) fixed.push(`  --${t.name}: ${t.value};`);
}

// Every colour is declared again in each theme, aliases included: a custom property that points
// at another is worked out where it is declared, so a dark frame inside a light page (the docs
// show both side by side) needs its own copy of each.
const css = `/*! @eurth/style ${version} — built from tokens.json by build/build.mjs. Don't edit: change tokens.json or src/css. */

/* Tokens. Light is the default; the head script sets data-theme before the first paint, and
   without script the page follows the device. data-theme also works on any element. */
:root {
${fixed.join('\n')}
}

:root,
[data-theme='light'] {
${colorsFor('light')}
  color-scheme: light;
}

[data-theme='dark'] {
${colorsFor('dark')}
  color-scheme: dark;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
${colorsFor('dark').replace(/^/gm, '  ')}
    color-scheme: dark;
  }
}

${readdirSync(new URL('src/css', root))
  .filter((f) => f.endsWith('.css'))
  .sort()
  .map((f) => read(`src/css/${f}`).trim())
  .join('\n\n')}
`;

// The head script: the theme and the browser's theme colour before the first paint. It reads
// the visit's choices from window.name (src/prefs.js writes them), which lasts until the tab
// closes and is never written to disk. Kept tiny and free of anything a 2015 browser lacks.
const light = resolveColors(tokens, 'light').surface;
const dark = resolveColors(tokens, 'dark').surface;
const head = `(function(){var d=document.documentElement,m=/^eurth:1:([ald]):([01]):([a0])$/.exec(window.name||''),t=m?m[1]:'a',k=t==='d'||(t==='a'&&matchMedia('(prefers-color-scheme: dark)').matches);d.dataset.theme=k?'dark':'light';if(m&&m[3]==='0')d.dataset.motion='still';var c=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<c.length;i++)c[i].setAttribute('content',k?'${dark}':'${light}');})();`;

const generated = `// Built from tokens.json by build/build.mjs. Don't edit.

/** The browser's own colour around the page (the address bar on phones), per theme. */
export const THEME_COLOR = /** @type {const} */ ({ light: '${light}', dark: '${dark}' });

/** The script every page carries in its head. The same text everywhere, so one CSP hash covers it. */
export const HEAD_SCRIPT = ${JSON.stringify(head)};

export const VERSION = '${version}';
`;

mkdirSync(new URL('dist', root), { recursive: true });
writeFileSync(new URL('dist/eurth.css', root), css);
writeFileSync(new URL('src/generated.js', root), generated);
console.log(`build: dist/eurth.css (${(css.length / 1024).toFixed(1)} kB), src/generated.js`);
