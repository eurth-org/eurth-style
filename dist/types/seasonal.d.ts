/**
 * The season a date falls in, if any.
 * @param {Date} date
 * @param {{ approvedOnly?: boolean }} [options]
 * @returns {Season | null}
 */
export function seasonOf(date: Date, { approvedOnly }?: {
    approvedOnly?: boolean;
}): Season | null;
/**
 * Dresses the header's yurt for the season, if one is on. The shell calls this once.
 * @param {Date} [date]
 */
export function seasonalYurt(date?: Date): Promise<void>;
/**
 * The seasonal yurt: for a few internationally recognised events the yurt in the header changes
 * its ground, on the Eurth design kit's dates. The logo's shape never changes. The pictures are
 * in seasonal-art.js, fetched only while a season is on.
 *
 * This reads the visitor's own date, which is fine: it hides nothing, it only dresses up.
 */
/** @typedef {'valentines' | 'earth-day' | 'pride' | 'halloween' | 'december'} Season */
/** @type {{ id: Season, name: string, window: string, in: (month: number, day: number) => boolean }[]} */
export const SEASONS: {
    id: Season;
    name: string;
    window: string;
    in: (month: number, day: number) => boolean;
}[];
/**
 * The seasons whose yurt is approved for use on the tools. The rest are drawn and shown on
 * style.eurth.org, and switch on here once Eurth's staff say yes.
 * @type {Season[]}
 */
export const APPROVED: Season[];
export type Season = "valentines" | "earth-day" | "pride" | "halloween" | "december";
