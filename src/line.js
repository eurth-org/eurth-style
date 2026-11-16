/**
 * line-md: the suite's animated icons (Material Line Icons by Vjacheslav Trushkin, MIT). Each
 * draws itself, stroke by stroke, when it appears; some then keep moving (the ones named
 * "…Loop") or turn from one icon into another ("…Transition").
 *
 *   import { lineHeartFilled } from '@eurth/style/line';
 *   <Line icon={lineHeartFilled} />        components/Line.astro or Line.svelte
 *
 * Font Awesome stays the set for still icons; line-md is for the moments worth a flourish: a
 * confirmation, a state that changes, the first thing the eye should find. Visitors who ask for
 * reduced motion, or switch motion off in the footer, get the finished drawing, still.
 */
export * from './line-md.js';

/** @typedef {import('./line-md.js').LineIcon} LineIcon */
/** @typedef {{ name: string, attrs: [string, string][], children: Node[] }} Node */

/**
 * Reads an icon's body: elements only, as line-md writes them.
 * @param {string} body
 * @returns {Node[]}
 */
function parse(body) {
  /** @type {Node} */
  const root = { name: '', attrs: [], children: [] };
  const stack = [root];
  for (const [, closing, name, rest, selfClosing] of body.matchAll(/<(\/?)([\w:-]+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g)) {
    if (closing) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    /** @type {Node} */
    const node = { name: /** @type {string} */ (name), attrs: [...(rest ?? '').matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [/** @type {string} */ (m[1]), /** @type {string} */ (m[2])]), children: [] };
    /** @type {Node} */ (stack[stack.length - 1]).children.push(node);
    if (!selfClosing) stack.push(node);
  }
  return root.children;
}

/** @param {Node} node @param {string} name */
const get = (node, name) => node.attrs.find(([key]) => key === name)?.[1];

/** @param {Node} node @param {string} name @param {string} value */
function put(node, name, value) {
  const at = node.attrs.findIndex(([key]) => key === name);
  if (at < 0) node.attrs.push([name, value]);
  else node.attrs[at] = [name, value];
}

/** Where an animation ends, if it ends and stays there. @param {Node} animation */
function lastValue(animation) {
  if (get(animation, 'repeatCount') === 'indefinite') return undefined;
  if (animation.name !== 'set' && get(animation, 'fill') !== 'freeze') return undefined;
  const values = get(animation, 'values');
  if (values) return values.split(';').map((value) => value.trim()).filter(Boolean).pop();
  return get(animation, 'to');
}

/**
 * Gives each element the look its animations leave it with, and drops the animations. An icon
 * that erases itself (the ones named "…Out") keeps the look it starts with instead.
 * @param {Node[]} nodes
 * @param {boolean} [fromStart]
 */
function settle(nodes, fromStart = false) {
  for (const node of nodes) {
    for (const child of node.children) {
      if (fromStart || !/^(animate|set|animateTransform|animateMotion)$/.test(child.name)) continue;
      const value = lastValue(child);
      if (value === undefined || child.name === 'animateMotion') continue;
      if (child.name === 'animateTransform') put(node, 'transform', `${get(child, 'type') ?? 'translate'}(${value})`);
      else put(node, get(child, 'attributeName') ?? '', value);
    }
    node.children = node.children.filter((child) => !/^(animate|set|animateTransform|animateMotion)$/.test(child.name));
    settle(node.children, fromStart);
  }
  return nodes;
}

/** @param {Node[]} nodes @returns {string} */
const write = (nodes) =>
  nodes
    .map((node) => {
      const open = `<${node.name}${node.attrs.map(([key, value]) => ` ${key}="${value}"`).join('')}`;
      return node.children.length ? `${open}>${write(node.children)}</${node.name}>` : `${open}/>`;
    })
    .join('');

/** @type {Map<string, string>} */
const settled = new Map();

/**
 * An icon as it looks once it has finished drawing, with nothing that moves: for reduced motion.
 * @param {LineIcon} icon
 */
export function lineStill(icon) {
  let body = settled.get(icon.name);
  if (body === undefined) {
    body = write(settle(parse(icon.body), /-out$/.test(icon.name)));
    settled.set(icon.name, body);
  }
  return body;
}

/**
 * An icon's two drawings (moving and still) as SVG text, with ids of its own so the same icon
 * can stand on a page twice. The components call this; a tool that writes SVG by hand may too.
 * @param {LineIcon} icon
 * @param {string} key  Anything unique on the page: the components count.
 */
export function lineSvg(icon, key) {
  /** @param {string} body @param {string} mark */
  const own = (body, mark) => {
    const ids = [...new Set([...body.matchAll(/\bid="([^"]+)"/g)].map((m) => /** @type {string} */ (m[1])))];
    return ids.reduce((text, id) => text.replaceAll(id, `${id}${mark}${key}`), body);
  };
  const open = (/** @type {string} */ cls) => `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">`;
  return `${open('eu-line-moving')}${own(icon.body, 'm')}</svg>${open('eu-line-still')}${own(lineStill(icon), 's')}</svg>`;
}
