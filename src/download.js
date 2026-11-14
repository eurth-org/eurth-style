/**
 * Taking a result away: as a file, or as a picture made from an SVG. "Save" in the suite always
 * means this, a file the visitor keeps; never browser storage.
 */

/**
 * Downloads text or a blob as a file.
 * @param {string | Blob} content
 * @param {string} filename "orioni-flag.svg"
 * @param {string} [type] the media type, for text: "image/svg+xml", "application/json"
 */
export function download(content, filename, type = 'text/plain') {
  const blob = typeof content === 'string' ? new Blob([content], { type }) : content;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * A file name from what a visitor typed: lower case, plain letters, hyphens.
 * @param {string} text
 * @param {string} [fallback] used when nothing usable is left
 */
export function fileSlug(text, fallback = 'untitled') {
  const slug = text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || fallback;
}

/**
 * Draws an SVG into a PNG or WebP picture of a given size, in the browser. The SVG must carry
 * everything it shows (no outside pictures or fonts), which the suite's rules ask for anyway.
 * @param {string} svg the SVG's text, with a viewBox
 * @param {{ width: number, height: number, type?: 'image/png' | 'image/webp', quality?: number, background?: string, fit?: 'contain' | 'cover' }} options
 *   background: a colour behind the picture (default: see-through); fit: how the SVG sits in the
 *   size asked for when the shapes differ (default: contain, centred)
 * @returns {Promise<Blob>}
 */
export async function svgToPicture(svg, { width, height, type = 'image/png', quality, background, fit = 'contain' }) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    image.decoding = 'async';
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("The picture couldn't be drawn."));
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
    if (background) {
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
    }
    const box = /viewBox="\s*[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/.exec(svg);
    const ratio = box ? Number(box[1]) / Number(box[2]) : image.naturalWidth / image.naturalHeight || width / height;
    const wider = ratio > width / height;
    const w = (fit === 'contain') === wider ? width : height * ratio;
    const h = (fit === 'contain') === wider ? width / ratio : height;
    context.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
    return await new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("The picture couldn't be made."))), type, quality));
  } finally {
    URL.revokeObjectURL(url);
  }
}
