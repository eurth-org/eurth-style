/**
 * Makes the pictures a tool needs that aren't drawn by hand, with the Chrome on the machine:
 *   public/favicon.svg, favicon.ico (16, 32 and 48 pixels)
 *   public/apple-touch-icon.png, icon-192.png, icon-512.png   the logo on a ground, for home screens
 *   public/og.png (and more, one per page that wants its own)  the sharing image, 1200 by 630
 *
 * A tool's tools/make-images.mjs calls this and commits the results; run it again after
 * changing the logo or the sharing image:
 *
 *   import { makeImages, sharingImage } from '@eurth/style/images';
 *   import { site } from '../eurth.config.mjs';
 *   await makeImages({ logo, sharing: [{ file: 'og.png', html: sharingImage({ site, art }) }] });
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright-core';
import { resolveColors } from './contrast.js';

const tokens = JSON.parse(readFileSync(new URL('../tokens.json', import.meta.url), 'utf8'));
const night = resolveColors(tokens, 'dark');
const yurt = readFileSync(new URL('./assets/eurth-yurt-circle.svg', import.meta.url), 'utf8');

/**
 * The suite's sharing image, as a page to photograph: Night ground, the yurt and the tool's
 * name, its tagline, its address in the pill, and the tool's own picture on the right.
 * @param {{ site: import('./build.js').Site & { host: string }, art?: string, title?: string, line?: string }} options
 *   art: HTML or SVG for the right half; title and line: for a page's own image (defaults: the site's name and tagline)
 */
export function sharingImage({ site, art = '', title = site.name, line = site.tagline }) {
  const esc = (/** @type {string} */ s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;width:1200px;height:630px;overflow:hidden;background:${night.surface};color:${night.ink};font-family:${tokens.type.families.sans};display:flex}
    .words{flex:1;min-width:0;box-sizing:border-box;padding:64px;display:flex;flex-direction:column;justify-content:center;gap:20px}
    .brand{display:flex;align-items:center;gap:20px;font-size:28px;color:${night['ink-muted']}}
    .brand svg{width:72px;height:72px;flex:none}
    h1{margin:0;font-size:${title.length > 16 ? 64 : 84}px;line-height:1.05;font-weight:700}
    p{margin:0;font-size:36px;line-height:1.25}
    .pill{align-self:flex-start;margin-top:12px;padding:10px 24px;border-radius:12px;background:${night['accent-fill']};color:${night['on-accent-small']};font-size:30px;font-weight:700}
    .art{flex:none;width:480px;display:flex;align-items:center;justify-content:center;padding:48px 64px 48px 0;box-sizing:border-box}
    .art>*{max-width:100%;max-height:100%}
  </style><body>
    <div class="words"><div class="brand">${yurt}<span>by Eurth</span></div><h1>${esc(title)}</h1><p>${esc(line)}</p><div class="pill">${esc(site.host)}</div></div>
    ${art ? `<div class="art">${art}</div>` : ''}
  </body>`;
}

/** A square page with the logo in the middle. */
const iconPage = (/** @type {string} */ logo, /** @type {number} */ size, /** @type {number} */ logoSize, /** @type {string} */ ground) =>
  `<!doctype html><style>body{margin:0;background:${ground};display:grid;place-items:center;width:${size}px;height:${size}px}div{width:${logoSize}px;height:${logoSize}px}svg{display:block;width:100%;height:100%}</style><body><div>${logo}</div></body>`;

/** Packs PNG pictures into one .ico (an .ico may hold PNGs as they are). @param {{ size: number, png: Buffer }[]} images */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((image) => image.png)]);
}

/**
 * @param {object} options
 * @param {string} [options.logo]     The tool's mark as SVG text, square. Default: the Eurth yurt.
 * @param {string} [options.ground]   What home-screen icons stand on. Default: white.
 * @param {{ file: string, html: string }[]} [options.sharing]  Sharing images to make: file name and the page to photograph.
 * @param {string} [options.out]      Where to write. Default: public.
 * @param {string} [options.chrome]   Path to Chrome, if it isn't where Playwright looks.
 */
export async function makeImages({ logo = yurt, ground = '#ffffff', sharing = [], out = 'public', chrome = process.env.CHROME } = {}) {
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch(chrome ? { executablePath: chrome } : { channel: 'chrome' });
  try {
    /** @param {string} html @param {number} width @param {number} height @param {boolean} [clear] */
    const shot = async (html, width, height, clear = false) => {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      await page.setContent(html);
      const png = await page.screenshot({ omitBackground: clear });
      await page.close();
      return png;
    };
    writeFileSync(join(out, 'favicon.svg'), logo);
    writeFileSync(join(out, 'apple-touch-icon.png'), await shot(iconPage(logo, 180, 132, ground), 180, 180));
    writeFileSync(join(out, 'icon-192.png'), await shot(iconPage(logo, 192, 132, ground), 192, 192));
    // Kept well inside the middle, so a round or squircle mask never clips it.
    writeFileSync(join(out, 'icon-512.png'), await shot(iconPage(logo, 512, 320, ground), 512, 512));
    const small = [];
    for (const size of [16, 32, 48]) small.push({ size, png: await shot(iconPage(logo, size, size, 'transparent'), size, size, true) });
    writeFileSync(join(out, 'favicon.ico'), ico(small));
    for (const { file, html } of sharing) writeFileSync(join(out, file), await shot(html, 1200, 630));
  } finally {
    await browser.close();
  }
  return ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', ...sharing.map((s) => s.file)];
}
