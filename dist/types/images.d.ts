/**
 * The suite's sharing image, as a page to photograph: Night ground, the yurt and the tool's
 * name, its tagline, its address in white on the eurth-blue pill, and the tool's own picture
 * on the right.
 * @param {{ site: import('./build.js').Site & { host: string }, art?: string, title?: string, line?: string, mark?: string }} options
 *   art: HTML or SVG for the right half; title and line: for a page's own image (defaults: the site's name and tagline);
 *   mark: the tool's own mark as SVG text, beside "by Eurth" (default: the yurt)
 */
export function sharingImage({ site, art, title, line, mark }: {
    site: import("./build.js").Site & {
        host: string;
    };
    art?: string;
    title?: string;
    line?: string;
    mark?: string;
}): string;
/**
 * @param {object} options
 * @param {string} [options.logo]     The tool's mark as SVG text, square. Default: the Eurth yurt.
 * @param {string} [options.ground]   What home-screen icons stand on. Default: white.
 * @param {{ file: string, html: string }[]} [options.sharing]  Sharing images to make: file name and the page to photograph.
 * @param {string} [options.out]      Where to write. Default: public.
 * @param {string} [options.chrome]   Path to Chrome, if it isn't where Playwright looks.
 */
export function makeImages({ logo, ground, sharing, out, chrome }?: {
    logo?: string | undefined;
    ground?: string | undefined;
    sharing?: {
        file: string;
        html: string;
    }[] | undefined;
    out?: string | undefined;
    chrome?: string | undefined;
}): Promise<string[]>;
