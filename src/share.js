/**
 * Sharing: the places people share a result, the Eurth forum first. Each is a plain link to
 * that site's own share page with the link filled in: no scripts from other sites, so nothing
 * tracks anyone, and nothing is posted until the visitor posts it there.
 */

/**
 * @typedef {object} Shared
 * @property {string} url    The link that brings the result back, whole.
 * @property {string} title  Its name: "Orioni: constitutional monarchy".
 * @property {string} text   One or two sentences about it, in the tool's voice.
 * @property {string} [forumBody]  Markdown for the forum topic; without it, the text and the link.
 */

/** @typedef {{ id: string, label: string, href: string }} ShareTarget */

/** Text as Markdown reads it literally: for names typed by visitors that go into a forum post. */
export function markdownText(text) {
  return text.replace(/([\\`*_{}[\]()#+\-.!|<>~])/g, '\\$1');
}

/**
 * The share links, in the suite's order.
 * @param {Shared} shared
 * @returns {ShareTarget[]}
 */
export function shareTargets({ url, title, text, forumBody }) {
  const e = encodeURIComponent;
  return [
    { id: 'eurth', label: 'Eurth forum', href: `https://eurth.org/new-topic?title=${e(title)}&body=${e(forumBody ?? `${text}\n\n${url}`)}` },
    { id: 'reddit', label: 'Reddit', href: `https://www.reddit.com/submit?url=${e(url)}&title=${e(title)}` },
    { id: 'bluesky', label: 'Bluesky', href: `https://bsky.app/intent/compose?text=${e(`${text} ${url}`)}` },
    { id: 'x', label: 'X', href: `https://x.com/intent/post?text=${e(text)}&url=${e(url)}` },
    { id: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}` },
    { id: 'linkedin', label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${e(url)}` },
    { id: 'tumblr', label: 'Tumblr', href: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${e(url)}&title=${e(title)}&caption=${e(text)}` },
    { id: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${e(`${text} ${url}`)}` },
    { id: 'telegram', label: 'Telegram', href: `https://t.me/share/url?url=${e(url)}&text=${e(text)}` },
    { id: 'email', label: 'Email', href: `mailto:?subject=${e(title)}&body=${e(`${text}\n\n${url}`)}` },
  ];
}

/**
 * Copies text. True if it worked; false where the browser refuses (then say so, kindly).
 * @param {string} text
 */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copies a picture (PNG) to the clipboard. Give it the picture or a promise of one: Safari
 * wants the promise handed over within the click.
 * @param {Blob | Promise<Blob>} png
 */
export async function copyPicture(png) {
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
    return true;
  } catch {
    return false;
  }
}

/** Whether this device has its own share sheet. */
export function canShare() {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Opens the device's share sheet. Cancelling is not an error.
 * @param {Shared} shared
 */
export async function shareSheet({ url, title, text }) {
  try {
    await navigator.share({ title, text, url });
  } catch {
    // Cancelled: nothing to do.
  }
}

/**
 * The sizes pictures are offered in, where a tool makes a picture. Offer SVG, PNG and WebP
 * where each fits.
 */
export const PICTURE_SIZES = /** @type {const} */ ([
  { id: 'preview', name: 'Link preview', width: 1200, height: 630 },
  { id: 'square', name: 'Square', width: 1080, height: 1080 },
  { id: 'portrait', name: 'Portrait', width: 1080, height: 1350 },
  { id: 'story', name: 'Story', width: 1080, height: 1920 },
  { id: 'pin', name: 'Pin', width: 1000, height: 1500 },
  { id: 'wide', name: 'Wide', width: 1600, height: 900 },
]);
