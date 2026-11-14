/**
 * @param {{ serviceWorker?: boolean }} [options] serviceWorker: register /sw.js (the built site only)
 */
export function startShell({ serviceWorker }?: {
    serviceWorker?: boolean;
}): void;
