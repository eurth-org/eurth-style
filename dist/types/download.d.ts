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
 * Names a picture for what the browser really made. A browser asked for a kind of picture it
 * can't make hands back a PNG without saying so (Safari does, for WebP), and a PNG saved as
 * ".webp" opens in some programs and not in others. So take the file's ending from the picture
 * itself, and tell the visitor when it isn't what they asked for:
 *
 *   const picture = await svgToPicture(svg, { width, height, type: 'image/webp' });
 *   const file = pictureFilename('orioni-flag', picture, 'image/webp');
 *   download(picture, file.filename);
 *   if (file.note) toast(file.note);
 *
 * @param {string} name the file's name without its ending: "orioni-flag"
 * @param {{ type: string }} picture the blob svgToPicture() gave
 * @param {'image/png' | 'image/webp'} [asked] the type svgToPicture() was asked for
 * @returns {{ filename: string, type: 'image/png' | 'image/webp', note: string | null }}
 *   filename: the name with the right ending; type: what the picture really is (what was asked
 *   for, if the picture doesn't say); note: a sentence for a toast when that differs from what
 *   was asked for, otherwise null
 */
export function pictureFilename(name: string, picture: {
    type: string;
}, asked?: "image/png" | "image/webp"): {
    filename: string;
    type: "image/png" | "image/webp";
    note: string | null;
};
/**
 * Draws an SVG into a PNG or WebP picture of a given size, in the browser. The SVG must carry
 * everything it shows (no outside pictures or fonts), which the suite's rules ask for anyway.
 * A browser that can't make WebP gives a PNG instead: name the file with pictureFilename().
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
