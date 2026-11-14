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
export function markdownText(text: any): any;
/**
 * The share links, in the suite's order.
 * @param {Shared} shared
 * @returns {ShareTarget[]}
 */
export function shareTargets({ url, title, text, forumBody }: Shared): ShareTarget[];
/**
 * Copies text. True if it worked; false where the browser refuses (then say so, kindly).
 * @param {string} text
 */
export function copyText(text: string): Promise<boolean>;
/**
 * Copies a picture (PNG) to the clipboard. Give it the picture or a promise of one: Safari
 * wants the promise handed over within the click.
 * @param {Blob | Promise<Blob>} png
 */
export function copyPicture(png: Blob | Promise<Blob>): Promise<boolean>;
/** Whether this device has its own share sheet. */
export function canShare(): boolean;
/**
 * Opens the device's share sheet. Cancelling is not an error.
 * @param {Shared} shared
 */
export function shareSheet({ url, title, text }: Shared): Promise<void>;
/**
 * The sizes pictures are offered in, where a tool makes a picture. Offer SVG, PNG and WebP
 * where each fits.
 */
export const PICTURE_SIZES: readonly [{
    readonly id: "preview";
    readonly name: "Link preview";
    readonly width: 1200;
    readonly height: 630;
}, {
    readonly id: "square";
    readonly name: "Square";
    readonly width: 1080;
    readonly height: 1080;
}, {
    readonly id: "portrait";
    readonly name: "Portrait";
    readonly width: 1080;
    readonly height: 1350;
}, {
    readonly id: "story";
    readonly name: "Story";
    readonly width: 1080;
    readonly height: 1920;
}, {
    readonly id: "pin";
    readonly name: "Pin";
    readonly width: 1000;
    readonly height: 1500;
}, {
    readonly id: "wide";
    readonly name: "Wide";
    readonly width: 1600;
    readonly height: 900;
}];
export type Shared = {
    /**
     * The link that brings the result back, whole.
     */
    url: string;
    /**
     * Its name: "Orioni: constitutional monarchy".
     */
    title: string;
    /**
     * One or two sentences about it, in the tool's voice.
     */
    text: string;
    /**
     * Markdown for the forum topic; without it, the text and the link.
     */
    forumBody?: string | undefined;
};
export type ShareTarget = {
    id: string;
    label: string;
    href: string;
};
