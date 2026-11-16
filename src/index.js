/**
 * @eurth/style, for the browser: what a tool's own code may call. Everything here is safe to
 * import in a Svelte component.
 *
 * Build-time helpers (the list of tools, launch dates, SEO data) are in '@eurth/style/build'
 * and must never be imported by code that runs in the browser: see HANDBOOK.md, Launch.
 */
export { toast, paperPlane, nice, niceWatcher, playTones, clickDelights, konami, emu, beatHearts, externalLinks, closingMenus, lineIcons, scrollLine, inView } from './fun.js';
export { getPrefs, setPrefs, onPrefs, calm, soundOn, decodePrefs, encodePrefs, DEFAULTS } from './prefs.js';
export { shareTargets, markdownText, markdownTable, copyText, copyPicture, canShare, shareSheet, PICTURE_SIZES } from './share.js';
export { install, installWay, installed, onIos, onInstallChange, watchInstall } from './install.js';
export { SEASONS, APPROVED, seasonOf, seasonalYurt } from './seasonal.js';
export { contrast, luminance, resolveColors, checkPairs, PAIRS, TEXT, LARGE_TEXT, NOT_TEXT, BRAND_TEXT } from './contrast.js';
export { encodeState, decodeState, stateLink, stateFromLocation, stateToLocation } from './link.js';
export { download, fileSlug, pictureFilename, svgToPicture } from './download.js';
export { ref, wikipedia } from './ref.js';
export { startShell } from './shell.js';
export { THEME_COLOR, VERSION } from './generated.js';
