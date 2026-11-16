// Makes the pictures that aren't drawn by hand, with the Chrome on this machine: the favicon,
// the home-screen icons and the sharing image. Run it after changing the logo or the sharing
// image, and commit what it writes to public/:  npm run images
import { makeImages, sharingImage } from '@eurth/style/images';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { site } from '../eurth.config.mjs';

// The picture on the sharing image comes from the same code as the site (Vite reads TypeScript).
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { plateSvg, templates } = await vite.ssrLoadModule('/src/tool/model.ts');
  // The tool's own mark is its favicon, its home-screen icon and the mark on its sharing image.
  const mark = readFileSync(new URL('../src/assets/mark.svg', import.meta.url), 'utf8');
  const made = await makeImages({ logo: mark, sharing: [{ file: 'og.png', html: sharingImage({ site, mark, art: plateSvg(templates[0].plate) }) }] });
  console.log(`Made ${made.map((file) => `public/${file}`).join(', ')}`);
} finally {
  await vite.close();
}
