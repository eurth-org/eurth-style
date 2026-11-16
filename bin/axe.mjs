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
//
// One pair is let through the contrast rules: white with eurth-blue, the brand's pair (3.2:1),
// in the blue bars, on primary buttons and on chosen options. Every other pair is held to them.
//
// A tool that keeps a design of its own from before the suite (Governmint) may be held to
// WCAG AA with 24px targets instead, on Stijn's word only, in its package.json:
//   "eurth": { "axe": { "level": "aa", "targets": 24 } }
import { AxeBuilder } from '@axe-core/playwright';
import { createReadStream, existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, relative, sep } from 'node:path';
import { chromium } from 'playwright-core';

const dist = process.argv[2] ?? 'dist';
const BRAND = ['#2698d4', '#ffffff'];
/** The brand pair, under either contrast rule. @param {import('axe-core').Result} violation @param {import('axe-core').NodeResult} node */
const brandPair = (violation, node) =>
  (violation.id === 'color-contrast-enhanced' || violation.id === 'color-contrast') &&
  node.any.some(({ data }) => data && [data.fgColor, data.bgColor].sort().join() === BRAND.join());

// The tool's own settings, if it has any.
let own = {};
try {
  own = JSON.parse(readFileSync('package.json', 'utf8')).eurth?.axe ?? {};
} catch {
  // No package.json here: the suite's rules, then.
}
const level = String(own.level ?? 'aaa').toLowerCase() === 'aa' ? 'aa' : 'aaa';
const targets = Number.isFinite(own.targets) && own.targets >= 24 ? Number(own.targets) : 44;
const tags = ['wcag2a', 'wcag2aa', ...(level === 'aaa' ? ['wcag2aaa'] : []), 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
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
      const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
      for (const violation of violations) {
        for (const node of violation.nodes) {
          if (brandPair(violation, node)) continue;
          findings += 1;
          console.error(`${scheme} ${path}: ${violation.id} (${violation.impact}): ${violation.help}\n    ${node.target.join(' ')}\n    ${node.failureSummary?.split('\n').join('\n    ')}`);
        }
      }
      // Target size, at 44 by 44: everything pressable that isn't a link inside running text.
      const small = await page.evaluate((least) => {
        const out = [];
        for (const el of document.querySelectorAll('button, summary, select, textarea, input:not([type=hidden]), [role=button], a.eu-btn, a.eu-join, a.eu-card, nav a, .eu-menu-list a')) {
          let box = el.getBoundingClientRect();
          // A hidden radio or checkbox takes the size of the option around it.
          const pill = el.closest('.eu-pill');
          if (pill && el.matches('input')) box = pill.getBoundingClientRect();
          // An input kept out of sight (a file picker behind a button, a switch drawn by its
          // label) is pressed through its label: that is what must be large enough.
          else if (el.matches('input') && (el.classList.contains('eu-visually-hidden') || box.width <= 2 || box.height <= 2)) {
            // Not drawn at all (display: none): nothing to press, so nothing to measure.
            if (!el.getClientRects().length) continue;
            const label = el.labels?.[0];
            if (label) box = label.getBoundingClientRect();
            // A label that is itself kept out of sight only names the input for screen readers.
            if (label && (box.width <= 2 || box.height <= 2)) continue;
          }
          const style = getComputedStyle(el);
          if (!box.width || !box.height || style.visibility === 'hidden' || el.closest('[hidden], dialog:not([open]), details:not([open]) > :not(summary)')) continue;
          if (box.width < least - 0.5 || box.height < least - 0.5) out.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''} "${(el.textContent ?? '').trim().slice(0, 40)}" is ${Math.round(box.width)} by ${Math.round(box.height)}`);
        }
        return out;
      }, targets);
      for (const line of small) {
        findings += 1;
        console.error(`${scheme} ${path}: target smaller than ${targets} by ${targets} pixels\n    ${line}`);
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
console.log(`eurth-axe: ${pages.length} pages, light and dark${level === 'aa' ? ', held to WCAG AA and ' + targets + 'px targets' : ''}: no findings.`);
