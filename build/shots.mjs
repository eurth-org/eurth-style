// Screenshots of a built site, for looking at: node build/shots.mjs <dist> <out folder> [path…]
// Each path is photographed whole, in the light theme and at Night, and at phone width.
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';
import { chromium } from 'playwright-core';

const [, , dist = 'site/dist', out = 'shots', ...paths] = process.argv;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const server = createServer((request, response) => {
  let file = join(dist, decodeURIComponent(new URL(request.url ?? '/', 'http://x').pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) file = join(dist, '404.html');
  response.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(undefined)));
const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
mkdirSync(out, { recursive: true });
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : { channel: 'chrome' });
for (const path of paths.length ? paths : ['/']) {
  for (const [name, scheme, width] of /** @type {const} */ ([['light', 'light', 1280], ['night', 'dark', 1280], ['phone', 'dark', 390]])) {
    const context = await browser.newContext({ colorScheme: scheme, viewport: { width, height: 900 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: join(out, `${path.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'home'}-${name}.png`), fullPage: true });
    await context.close();
  }
}
await browser.close();
server.close();
