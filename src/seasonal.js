/**
 * The seasonal yurt: for a few internationally recognised events the yurt in the header changes
 * its ground, on the Eurth design kit's dates. The logo's shape never changes. The pictures are
 * in seasonal-art.js, fetched only while a season is on.
 *
 * This reads the visitor's own date, which is fine: it hides nothing, it only dresses up.
 */

/** @typedef {'valentines' | 'earth-day' | 'pride' | 'halloween' | 'december'} Season */

/** @type {{ id: Season, name: string, window: string, in: (month: number, day: number) => boolean }[]} */
export const SEASONS = [
  { id: 'valentines', name: "Valentine's Day", window: '1 to 14 February', in: (m, d) => m === 2 && d <= 14 },
  { id: 'earth-day', name: 'Earth Day', window: '16 to 22 April', in: (m, d) => m === 4 && d >= 16 && d <= 22 },
  { id: 'pride', name: 'Pride', window: 'June', in: (m) => m === 6 },
  { id: 'halloween', name: 'Halloween', window: 'October', in: (m) => m === 10 },
  { id: 'december', name: 'December: Christmas and New Year', window: 'December', in: (m) => m === 12 },
];

/**
 * The seasons whose yurt is approved for use on the tools: all five, since 14 November 2026.
 * A new one is drawn, shown on style.eurth.org, and added here once Eurth's staff say yes.
 * @type {Season[]}
 */
export const APPROVED = ['valentines', 'earth-day', 'pride', 'halloween', 'december'];

/**
 * The season a date falls in, if any.
 * @param {Date} date
 * @param {{ approvedOnly?: boolean }} [options]
 * @returns {Season | null}
 */
export function seasonOf(date, { approvedOnly = true } = {}) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const found = SEASONS.find((s) => s.in(month, day) && (!approvedOnly || APPROVED.includes(s.id)));
  return found?.id ?? null;
}

/**
 * Dresses the header's yurt for the season, if one is on. The shell calls this once.
 * @param {Date} [date]
 */
export async function seasonalYurt(date = new Date()) {
  const season = seasonOf(date);
  if (!season) return;
  const { ART } = await import('./seasonal-art.js');
  for (const mark of document.querySelectorAll('.eu-yurt[data-seasonal]')) mark.innerHTML = ART[season];
}
