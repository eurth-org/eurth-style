#!/usr/bin/env node
// eurth-axe: automated accessibility checks on every page of a built site, in both themes.
//
//   npx eurth-axe            checks ./dist
//   npx eurth-axe some/dir
//
// It serves the folder, opens each page in the Chrome on the machine, and runs axe-core with
// the WCAG 2.2 A, AA and AAA rules plus best practices. It also measures what axe doesn't:
// every button, menu, field and navigation link must be at least 44 by 44 pixels (links inside
// a sentence are exempt, as WCAG 2.5.5 allows). Any finding fails the run.
import { AxeBuilder } from '@axe-core/playwright';
import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, relative, sep } from 'node:path';
import { chromium } from 'playwright-core';

const dist = process.argv[2] ?? 'dist';
if (!existsSync(join(dist, 'index.html'))) {
  console.error(`eurth-axe: no built site in ${dist}/. Run "npm run build" first.`);
  process.exit(2);
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };

const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  let file = join(dist, path);
  if (!file.startsWith(join(dist))) file = join(dist, '404.html');
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  const found = existsSync(file);
  if (!found) file = join(dist, '404.html');
  response.writeHead(found ? 200 : 404, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(undefined)));
const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());

const pages = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) pages.push(`/${relative(dist, path).split(sep).join('/').replace(/(^|\/)index\.html$/, '$1')}`);
  }
};
walk(dist);
pages.sort();

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : { channel: 'chrome' });
let findings = 0;
try {
  for (const scheme of /** @type {const} */ (['light', 'dark'])) {
    const context = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
    // A busy machine is slow, not broken.
    context.setDefaultTimeout(120_000);
    context.setDefaultNavigationTimeout(120_000);
    for (const path of pages) {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: 'networkidle' });
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
      for (const violation of violations) {
        for (const node of violation.nodes) {
          findings += 1;
          console.error(`${scheme} ${path}: ${violation.id} (${violation.impact}): ${violation.help}\n    ${node.target.join(' ')}\n    ${node.failureSummary?.split('\n').join('\n    ')}`);
        }
      }
      // Target size, at 44 by 44: everything pressable that isn't a link inside running text.
      const small = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll('button, summary, select, textarea, input:not([type=hidden]), [role=button], a.eu-btn, a.eu-join, a.eu-card, nav a, .eu-menu-list a')) {
          let box = el.getBoundingClientRect();
          // A hidden radio or checkbox takes the size of the option around it.
          const pill = el.closest('.eu-pill');
          if (pill && el.matches('input')) box = pill.getBoundingClientRect();
          const style = getComputedStyle(el);
          if (!box.width || !box.height || style.visibility === 'hidden' || el.closest('[hidden], dialog:not([open]), details:not([open]) > :not(summary)')) continue;
          if (box.width < 43.5 || box.height < 43.5) out.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''} "${(el.textContent ?? '').trim().slice(0, 40)}" is ${Math.round(box.width)} by ${Math.round(box.height)}`);
        }
        return out;
      });
      for (const line of small) {
        findings += 1;
        console.error(`${scheme} ${path}: target smaller than 44 by 44 pixels\n    ${line}`);
      }
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (findings) {
  console.error(`\neurth-axe: ${findings} finding${findings === 1 ? '' : 's'} on ${pages.length} pages.`);
  process.exit(1);
}
console.log(`eurth-axe: ${pages.length} pages, light and dark: no findings.`);
