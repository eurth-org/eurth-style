// Turns the line-md icon set (Material Line Icons by Vjacheslav Trushkin, MIT) into
// src/line-md.js: one named export per icon, so a tool's bundle carries only the icons it uses.
//   node build/line-md.mjs
// Run it again after updating @iconify-json/line-md; the result is committed.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const set = JSON.parse(readFileSync(require.resolve('@iconify-json/line-md/icons.json'), 'utf8'));
const info = JSON.parse(readFileSync(require.resolve('@iconify-json/line-md/info.json'), 'utf8'));

/** 'heart-filled' becomes 'lineHeartFilled'. @param {string} name */
export const exportName = (name) => `line${name.replace(/(^|-)(\w)/g, (_, __, letter) => letter.toUpperCase())}`;

const names = Object.keys(set.icons).sort();
const lines = names.map((name) => `export const ${exportName(name)} = /** @type {LineIcon} */ ({ name: ${JSON.stringify(name)}, body: ${JSON.stringify(set.icons[name].body)} });`);

writeFileSync(
  new URL('../src/line-md.js', import.meta.url),
  `// Written by build/line-md.mjs from @iconify-json/line-md: don't edit.
// line-md ${info.version}, ${names.length} icons, by ${info.author.name} (${info.license.spdx}). Each draws itself on a 24 by 24 grid.
// Import them by name from '@eurth/style/line', so only the ones a page uses are downloaded.

/** @typedef {{ name: string, body: string }} LineIcon */

${lines.join('\n')}
`,
);
console.log(`line-md: ${names.length} icons in src/line-md.js`);
