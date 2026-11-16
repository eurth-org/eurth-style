/**
 * A short note that slides up from the bottom of the screen, read out by screen readers.
 * One at a time: a new toast replaces the last. Write it in the tool's own voice.
 * @param {string} text
 */
export function toast(text: string): void;
/** Whether a point is on screen: what happens out of sight should make no sound either. */
export function inView(x: any, y: any): boolean;
/**
 * A paper plane that flies off an element, up and to the right: the answer to "Copy link".
 * @param {Element} from
 */
export function paperPlane(from: Element): void;
/**
 * "Nice." The visitor's number landed on 69 and stayed there. Shown above the element for a
 * moment; screen readers aren't told, since it's only a wink.
 * @param {Element} at
 */
export function nice(at: Element): void;
/**
 * Watches a number and calls `nice` when it settles on 69: not while a slider is still moving
 * through it, and not for the value the page opened with. Returns a function to feed values to:
 *
 *   const watch = niceWatcher();
 *   $effect(() => watch(value, () => slider));
 *
 * @param {number} [wait] how long the value must rest, in milliseconds
 * @returns {(value: number, at: () => Element | null | undefined) => void}
 */
export function niceWatcher(wait?: number): (value: number, at: () => Element | null | undefined) => void;
/**
 * A few soft tones, made in the browser: the stuff of a tool's signature sound (Governmint's
 * coin clink is `playTones([[1319, 0, 0.035], [1976, 0.008, 0.016], [1397, 0.07, 0.02]])`).
 * Silent until the visitor switches sound on. Keep it quiet and under half a second.
 * @param {[frequency: number, delay: number, level: number][]} partials
 * @param {{ length?: number, cutoff?: number }} [options] seconds each tone lasts; the filter that takes the edge off
 */
export function playTones(partials: [frequency: number, delay: number, level: number][], { length, cutoff }?: {
    length?: number;
    cutoff?: number;
}): void;
/**
 * Buttons answer a click with a small movement: they press in (the stylesheet), and their icon
 * does what the button says (data-click names it: pop, spin, tumble, bounce, swing-left,
 * swing-right). Also: Escape hides tooltips until the pointer moves again. The shell installs
 * this once for the whole page.
 */
export function clickDelights(): void;
/**
 * Calls back when the Konami code is typed. Keys typed into a field don't count.
 * @param {() => void} then
 * @returns {() => void} stops listening
 */
export function konami(then: () => void): () => void;
/**
 * Sends an emu across the foot of an element (the footer). Eurth has history with emus.
 * Skipped for reduced motion, where a toast says what was missed.
 * @param {Element} across
 */
export function emu(across: Element): void;
/**
 * Beats the hearts inside an element a few times each time it comes into view.
 * @param {Element} element
 */
export function beatHearts(element: Element): void;
/**
 * Links to other sites open in a new tab, and say so to screen readers through one shared,
 * hidden note. A watcher catches links added later (dialogs, results), so none is missed.
 */
export function externalLinks(): void;
/**
 * line-md icons draw themselves again when their button or link is pointed at or reached with
 * the keyboard, and when they scroll into view: an icon below the fold would otherwise have
 * finished before anyone saw it. The shell installs this once for the whole page.
 */
export function lineIcons(): void;
/** A click outside an open menu, or Escape, closes it (the Tools menu is a <details>). */
export function closingMenus(): void;
