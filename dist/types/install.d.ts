/** Starts listening for the browser's offer. The shell calls this once. */
export function watchInstall(): void;
/** Already running as an installed app. */
export function installed(): boolean;
/** An iPhone or iPad, where installing is done by hand from the Share menu. */
export function onIos(): boolean;
/** What the Install button can do here: 'prompt', 'ios' (show the how-to) or null (hide it). */
export function installWay(): "prompt" | "ios" | null;
/** Asks the browser to install. True if the visitor said yes. */
export function install(): Promise<boolean>;
/**
 * Calls back when what the button can do changes. Returns a function that stops it.
 * @param {() => void} listener
 */
export function onInstallChange(listener: () => void): () => boolean;
