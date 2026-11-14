// A smoke test of a served site in real Chrome, under its real headers (wrangler dev):
//   node build/smoke.mjs http://localhost:8791
// Checks what unit tests can't: nothing is blocked by the Content-Security-Policy, the theme
// follows the device and then the visitor's choice from page to page, nothing is stored, the
// service worker installs and the site opens again without signal.
import { chromium } from 'playwright-core';

const base = process.argv[2] ?? 'http://localhost:8791';
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : { channel: 'chrome' });
const problems = [];
const check = (ok, what) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`);
  if (!ok) problems.push(what);
};

try {
  const context = await browser.newContext({ colorScheme: 'light', viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const noise = [];
  page.on('console', (message) => message.type() === 'error' && noise.push(message.text()));
  page.on('pageerror', (error) => noise.push(String(error)));

  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const theme = () => page.evaluate(() => document.documentElement.dataset.theme);
  check((await theme()) === 'light', 'a first visit follows the device (light)');
  check((await page.evaluate(() => window.name)) === '', 'a first visit leaves window.name empty');

  const pages = await page.evaluate(() => [...document.querySelectorAll('.eu-nav a')].map((a) => a.getAttribute('href')));
  const sw = await page.evaluate(() => Promise.race([navigator.serviceWorker.ready.then(() => true), new Promise((r) => setTimeout(() => r(false), 8000))]));
  check(sw, 'the service worker installs');

  // The Deluminator: auto -> dark (the device is light), and the choice travels to the next page.
  const lamp = page.locator('.eu-deluminator-slot button');
  await lamp.waitFor();
  check(/^Theme: Auto/.test((await lamp.getAttribute('aria-label')) ?? ''), 'the Deluminator starts on Auto');
  await lamp.click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  check((await page.evaluate(() => window.name)) === 'eurth:1:d:0:a', "the choice rides in window.name (eurth:1:d:0:a)");
  check((await page.evaluate(() => [...document.querySelectorAll('meta[name="theme-color"]')].every((m) => m.content === '#002b36'))), "the browser's theme colour follows");
  for (const href of pages.filter((h) => h !== '/')) {
    await page.goto(new URL(href, base).href, { waitUntil: 'networkidle' });
    check((await theme()) === 'dark', `${href} opens dark, set before the first paint`);
  }
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await lamp.click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  await lamp.click();
  check((await page.evaluate(() => window.name)) === '', 'back on Auto, window.name is empty again');

  // Nothing stored.
  const stored = await page.evaluate(async () => ({ local: localStorage.length, session: sessionStorage.length, cookie: document.cookie, db: (await indexedDB.databases?.())?.length ?? 0 }));
  check(stored.local === 0 && stored.session === 0 && stored.cookie === '' && stored.db === 0, 'no cookies, localStorage, sessionStorage or IndexedDB');
  const caches = await page.evaluate(() => caches.keys());
  check(caches.length === 1 && /^eurth-[\w-]+-[0-9a-f]{12}$/.test(caches[0]), `the only thing kept is the app's own cache (${caches.join(', ')})`);

  // The Tools menu opens without script too (it is a <details>); here: it opens and Escape closes it.
  await page.locator('.eu-menu summary').click();
  check(await page.locator('.eu-menu-list').isVisible(), 'the Tools menu opens');
  await page.keyboard.press('Escape');
  check(!(await page.locator('.eu-menu-list').isVisible()), 'Escape closes it');

  // Offline: every page opens from the copy on the device, and the note says so.
  await context.setOffline(true);
  for (const href of pages) {
    const response = await page.goto(new URL(href, base).href, { waitUntil: 'load' }).catch(() => null);
    check(!!response && (await page.locator('h1').count()) === 1, `${href} opens without signal`);
  }
  check(await page.locator('.eu-offline').isVisible().catch(() => false), 'the offline note shows');
  await context.setOffline(false);

  check(noise.filter((n) => !/ERR_INTERNET_DISCONNECTED|Failed to load resource/.test(n)).length === 0, `no errors in the console, nothing blocked by the Content-Security-Policy${noise.length ? `: ${noise.join(' | ')}` : ''}`);
  await context.close();

  // A dark device, and a visitor without script: the stylesheet alone follows the device.
  const plain = await browser.newContext({ colorScheme: 'dark', javaScriptEnabled: false });
  const still = await plain.newPage();
  await still.goto(`${base}/`);
  check((await still.locator('body').evaluate((b) => getComputedStyle(b).backgroundColor)) === 'rgb(0, 43, 54)', 'without script, a dark device gets Night');
  check((await still.locator('h1').count()) === 1 && (await still.locator('main input').count()) > 0, 'without script, the page is still real HTML');
  await plain.close();
} finally {
  await browser.close();
}

if (problems.length) {
  console.error(`\nsmoke: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`);
  process.exit(1);
}
console.log('\nsmoke: all good.');
