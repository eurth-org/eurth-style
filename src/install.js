/**
 * Installing the tool as an app. Chrome, Edge and Android offer it through an event; the shell
 * catches that event early (it comes once, soon after the page loads) and the Install button
 * uses it when pressed. iPhones and iPads have no such event: there the button explains
 * Add to Home Screen instead.
 */

/** @type {any} */
let offer = null;
/** @type {Set<() => void>} */
const listeners = new Set();
const tell = () => listeners.forEach((listener) => listener());

/** Starts listening for the browser's offer. The shell calls this once. */
export function watchInstall() {
  addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    offer = event;
    tell();
  });
  addEventListener('appinstalled', () => {
    offer = null;
    tell();
  });
}

/** Already running as an installed app. */
export function installed() {
  return matchMedia('(display-mode: standalone)').matches || /** @type {any} */ (navigator).standalone === true;
}

/** An iPhone or iPad, where installing is done by hand from the Share menu. */
export function onIos() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/** What the Install button can do here: 'prompt', 'ios' (show the how-to) or null (hide it). */
export function installWay() {
  if (installed()) return null;
  if (offer) return 'prompt';
  return onIos() ? 'ios' : null;
}

/** Asks the browser to install. True if the visitor said yes. */
export async function install() {
  if (!offer) return false;
  offer.prompt();
  const choice = await offer.userChoice;
  offer = null;
  tell();
  return choice?.outcome === 'accepted';
}

/**
 * Calls back when what the button can do changes. Returns a function that stops it.
 * @param {() => void} listener
 */
export function onInstallChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
