/**
 * An icon as it looks once it has finished drawing, with nothing that moves: for reduced motion.
 * @param {LineIcon} icon
 */
export function lineStill(icon: LineIcon): string;
/**
 * An icon's two drawings (moving and still) as SVG text, with ids of its own so the same icon
 * can stand on a page twice. The components call this; a tool that writes SVG by hand may too.
 * @param {LineIcon} icon
 * @param {string} key  Anything unique on the page: the components count.
 */
export function lineSvg(icon: LineIcon, key: string): string;
export * from "./line-md.js";
export type LineIcon = import("./line-md.js").LineIcon;
export type Node = {
    name: string;
    attrs: [string, string][];
    children: Node[];
};
