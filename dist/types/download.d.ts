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
export function download(content: string | Blob, filename: string, type?: string): void;
/**
 * A file name from what a visitor typed: lower case, plain letters, hyphens.
 * @param {string} text
 * @param {string} [fallback] used when nothing usable is left
 */
export function fileSlug(text: string, fallback?: string): string;
/**
 * Draws an SVG into a PNG or WebP picture of a given size, in the browser. The SVG must carry
 * everything it shows (no outside pictures or fonts), which the suite's rules ask for anyway.
 * @param {string} svg the SVG's text, with a viewBox
 * @param {{ width: number, height: number, type?: 'image/png' | 'image/webp', quality?: number, background?: string, fit?: 'contain' | 'cover' }} options
 *   background: a colour behind the picture (default: see-through); fit: how the SVG sits in the
 *   size asked for when the shapes differ (default: contain, centred)
 * @returns {Promise<Blob>}
 */
export function svgToPicture(svg: string, { width, height, type, quality, background, fit }: {
    width: number;
    height: number;
    type?: "image/png" | "image/webp";
    quality?: number;
    background?: string;
    fit?: "contain" | "cover";
}): Promise<Blob>;
