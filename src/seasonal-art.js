/**
 * The seasonal yurts, as SVG. The yurt itself is the logo's own geometry, untouched, in white
 * (red for Halloween); only the ground changes, plus one kind of particle or prop.
 *
 * Pride and Earth Day are the design kit's own files, as they are. Valentine's Day, Halloween
 * and December are SVG versions made for the tools from the same yurt, after the Discord icons
 * (which are large animated GIFs and stay as they are, on Discord).
 */

const YURT = (fill = '#ffffff') =>
  `<g transform="translate(0.6,-193.986)" fill="${fill}"><path d="M68.9,319L46,384.1L111,384.1L124.8,332.6L132.1,332.6L145.9,384.1L210.8,384.1L187.9,319L68.9,319Z"></path><path d="M110.4,261.1L106.4,268.1L120.2,276.1L73.5,303.1L183.5,303.1L136.8,276.1L150.6,268.1L146.6,261.1L128.6,271.7L110.4,261.1Z"></path></g>`;
const svg = (label, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 257.2 257.2" role="img" aria-label="${label}">${body}</svg>`;
const disc = (fill) => `<circle cx="128.6" cy="128.6" r="128.6" fill="${fill}"></circle>`;
const heart = (x, y, s) =>
  `<path transform="translate(${x},${y}) scale(${s})" d="M0,6C0,-2 10,-2 10,4C10,-2 20,-2 20,6C20,12 10,18 10,20C10,18 0,12 0,6Z"></path>`;
const flake = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"></circle>`;

/** @type {Record<import('./seasonal.js').Season, string>} */
export const ART = {
  valentines: svg(
    "The Eurth yurt for Valentine's Day",
    `${disc('#ed4245')}<g fill="#ffffff">${heart(58, 34, 1)}${heart(184, 30, 0.8)}${heart(42, 200, 0.7)}${heart(196, 198, 0.9)}${heart(122, 212, 0.6)}${heart(22, 112, 0.6)}${heart(222, 112, 0.6)}</g>${YURT()}`,
  ),
  'earth-day': svg(
    'The Eurth yurt for Earth Day',
    `<defs><clipPath id="eu-earth"><circle cx="128.6" cy="128.6" r="128.6"></circle></clipPath></defs><g clip-path="url(#eu-earth)"><rect width="257.2" height="257.2" fill="#2698d4"></rect><rect y="182" width="257.2" height="76" fill="#3ab54a"></rect></g>${YURT()}`,
  ),
  pride: svg(
    'The Eurth yurt for Pride',
    `<g transform="translate(0,-463.4)"><path d="M128.6,463.4C57.6,463.4 0,521 0,592C0,663 57.6,720.6 128.6,720.6C199.6,720.6 257.2,663 257.2,592C257.1,521 199.6,463.4 128.6,463.4Z" fill="#750787"></path><path d="M128.6,463.4C57.6,463.4 0,521 0,592C0.1,623.7 11.8,654.2 32.9,677.7L224.2,677.7C245.4,654.2 257.1,623.6 257.1,592C257.1,521 199.6,463.4 128.6,463.4Z" fill="#004dff"></path><path d="M128.6,463.4C57.6,463.4 0,521 0,592C0,606.6 2.6,621.1 7.5,634.9L249.6,634.9C254.5,621.1 257.1,606.7 257.1,592C257.1,521 199.6,463.4 128.6,463.4Z" fill="#008026"></path><path d="M128.6,463.4C57.6,463.4 0,521 0,592L257.1,592C257.1,521 199.6,463.4 128.6,463.4Z" fill="#ffed00"></path><path d="M128.6,463.4C74.2,463.5 25.7,497.8 7.5,549.1L249.6,549.1C231.5,497.8 183,463.5 128.6,463.4Z" fill="#ff8c00"></path><path d="M128.6,463.4C92.1,463.5 57.3,479 33,506.3L224.3,506.3C199.9,479.1 165.1,463.5 128.6,463.4Z" fill="#e40303"></path></g>${YURT()}`,
  ),
  halloween: svg(
    'The Eurth yurt for Halloween',
    `${disc('#030303')}<g fill="#ed4245"><path d="M82,103C64,97 56,80 60,60C68,76 80,86 96,92Z"></path><path d="M175.2,103C193.2,97 201.2,80 197.2,60C189.2,76 177.2,86 161.2,92Z"></path></g>${YURT('#ed4245')}`,
  ),
  december: svg(
    'The Eurth yurt for December',
    `${disc('#ed4245')}<g fill="#ffffff">${flake(44, 76, 4)}${flake(74, 38, 3)}${flake(128, 30, 4)}${flake(188, 42, 3)}${flake(220, 92, 4)}${flake(26, 140, 3)}${flake(232, 150, 3)}${flake(62, 212, 4)}${flake(128, 226, 3)}${flake(196, 210, 4)}${flake(100, 240, 2.5)}${flake(160, 238, 2.5)}${flake(36, 108, 2.5)}${flake(214, 60, 2.5)}</g>${YURT()}`,
  ),
};
