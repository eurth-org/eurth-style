/**
 * What every page does once it has loaded, started by components/Page.astro: buttons answer
 * clicks, outside links open in new tabs, the Tools menu closes itself, line-md icons draw
 * themselves again when pointed at, the footer's hearts
 * beat, the Konami code sends an emu, the yurt dresses for the season, the browser's offer to
 * install is caught, and (in the built site) the service worker keeps a copy for offline.
 */
import { beatHearts, clickDelights, closingMenus, emu, externalLinks, konami, lineIcons } from './fun.js';
import { watchInstall } from './install.js';
import { seasonalYurt } from './seasonal.js';

/**
 * @param {{ serviceWorker?: boolean }} [options] serviceWorker: register /sw.js (the built site only)
 */
export function startShell({ serviceWorker = false } = {}) {
  clickDelights();
  externalLinks();
  closingMenus();
  lineIcons();
  watchInstall();
  const footer = document.querySelector('.eu-footer');
  if (footer) {
    beatHearts(footer);
    konami(() => emu(footer));
  }
  seasonalYurt().catch(() => {});
  if (serviceWorker && 'serviceWorker' in navigator) {
    addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }
}
