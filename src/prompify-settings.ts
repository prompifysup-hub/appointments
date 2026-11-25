/*
 * Settings Prompify fills in from the wizard when it imports this template.
 *
 * AUDIENCE — who uses the app ("Who uses it?"):
 *  - 'team'      Staff only: the app opens on the calendar; no public pages.
 *  - 'customers' Customer-facing: the app opens on the public booking page (/book); staff use the
 *                calendar under "Staff area".
 *  - 'both'      Calendar first, plus the public booking page at /book.
 * There is no login yet: the booking page is open to anyone with the link.
 *
 * THEME_MODE — light or dark on first visit (src/theme.css has both; the header switch changes it).
 */
export type Audience = 'team' | 'customers' | 'both';
export type ThemeMode = 'light' | 'dark';

export const AUDIENCE: Audience = 'team';

export const THEME_MODE: ThemeMode = 'dark';

/** True when the public booking page is switched on. */
export const HAS_CUSTOMER_PORTAL = AUDIENCE !== 'team';
