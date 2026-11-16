// The docs site's icons and sharing image: node build/site-images.mjs (needs Chrome).
import { site } from '../site/eurth.config.mjs';
import { makeImages, sharingImage } from '../src/images.js';

const art = `<div style="display:flex;flex-direction:column;gap:20px;font:700 30px system-ui,Arial,sans-serif">
  <span style="padding:14px 28px;border-radius:12px;background:#2698d4;color:#ffffff">Copy link</span>
  <span style="padding:14px 28px;border-radius:12px;border:2px solid #798c88;color:#fcf6e1">Share</span>
  <span style="padding:14px 28px;border-radius:12px;background:#80c8e5;color:#002b36">Advanced</span>
</div>`;
console.log((await makeImages({ out: 'site/public', sharing: [{ file: 'og.png', html: sharingImage({ site, art }) }] })).join(', '));
