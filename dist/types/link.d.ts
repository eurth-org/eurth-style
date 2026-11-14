/**
 * The state as the value of a query parameter: "<version>.<compact JSON, base64url>".
 * @param {unknown} value anything JSON can hold; keep its keys short
 * @param {number} [version] raise it when the shape changes, and keep reading the old ones
 */
export function encodeState(value: unknown, version?: number): string;
/**
 * Reads a state back. Null for anything that isn't one: too long, malformed, not JSON.
 * @param {string | null | undefined} text
 * @param {{ maxLength?: number }} [options] longest text accepted (default 8000 characters)
 * @returns {{ version: number, value: unknown } | null}
 */
export function decodeState(text: string | null | undefined, { maxLength }?: {
    maxLength?: number;
}): {
    version: number;
    value: unknown;
} | null;
/**
 * The link for a state: the page's own address with the state as its only query parameter.
 * A state with nothing in it (the tool's defaults) is the plain address, with no parameter.
 * @param {unknown} value
 * @param {{ version?: number, param?: string, base?: string }} [options] base: the page's address (default: where we are)
 */
export function stateLink(value: unknown, { version, param, base }?: {
    version?: number;
    param?: string;
    base?: string;
}): string;
/**
 * The state in the address bar, if there is one.
 * @param {{ param?: string, maxLength?: number }} [options]
 */
export function stateFromLocation({ param, maxLength }?: {
    param?: string;
    maxLength?: number;
}): {
    version: number;
    value: unknown;
} | null;
/**
 * Keeps the address bar in step with the state, without adding to the Back button's history.
 * Nothing is stored: the address is the save.
 * @param {unknown} value
 * @param {{ version?: number, param?: string }} [options]
 */
export function stateToLocation(value: unknown, options?: {
    version?: number;
    param?: string;
}): void;
