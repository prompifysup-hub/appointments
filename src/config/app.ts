/*
 * APP CONFIG — the placeholders for this business. Prompify (or the AI, from the user's description)
 * replaces these values; the calendar and the booking page read them from here. The defaults keep
 * the app working.
 *
 * Wording lives in src/config/text.ts, colours and the look in src/theme.css, and who uses the app
 * and the first light / dark mode in src/prompify-settings.ts.
 */
import type { TBadgeVariant, TEventColor, TVisibleHours, TWorkingHours } from "@/calendar/types";

/** Identity: shown in the header, on the booking page and in the browser tab. */
export const APP = {
  name: "Appointments",
  tagline: "Book and manage appointments",
  /** Browser-tab description (set at start-up from here). */
  description: "Book and manage appointments by day, week, month or agenda.",
  company: "Your Company",
  /** Shown on the booking page as a contact line; leave empty to hide it. */
  contactEmail: "hello@example.com",
};

/**
 * Opening hours per weekday (0 = Sunday … 6 = Saturday), in whole hours, 24-hour clock.
 * from == to means closed. Used by the calendar (bookable vs. closed hours) AND the booking page.
 */
export const WORKING_HOURS: TWorkingHours = {
  0: { from: 0, to: 0 },
  1: { from: 8, to: 17 },
  2: { from: 8, to: 17 },
  3: { from: 8, to: 17 },
  4: { from: 8, to: 17 },
  5: { from: 8, to: 17 },
  6: { from: 8, to: 12 },
};

/** Hours shown in the day and week views. */
export const VISIBLE_HOURS: TVisibleHours = { from: 7, to: 18 };

/** How appointments look in the calendar: "colored" (filled), "dot" (dot + text) or "mixed". */
export const BADGE_VARIANT: TBadgeVariant = "colored";

/** Appointment colours staff can pick, with their names (stored value → label). */
export const EVENT_COLORS: { value: TEventColor; label: string }[] = [
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "red", label: "Red" },
  { value: "yellow", label: "Yellow" },
  { value: "purple", label: "Purple" },
  { value: "orange", label: "Orange" },
  { value: "gray", label: "Gray" },
];

/** Online booking (the public /book page). */
export const BOOKING = {
  /** Length of an online booking, in minutes. */
  appointmentMinutes: 30,
  /** Bookable start times are offered every this many minutes. */
  slotMinutes: 30,
  /** How far ahead customers can book, in days. */
  daysAhead: 30,
  /** Calendar colour of appointments booked online, so staff can spot them. */
  color: "green" as TEventColor,
};
