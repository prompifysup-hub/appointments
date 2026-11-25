import type { TEventColor } from "@/calendar/types";

/*
 * Online booking settings. Bookable times come from the opening hours (WORKING_HOURS in
 * src/calendar/contexts/calendar-context.tsx) and skip times the staff member is already booked.
 */

/** Length of an online booking, in minutes. */
export const APPOINTMENT_MINUTES = 30;

/** Bookable start times are offered every this many minutes. */
export const SLOT_MINUTES = 30;

/** How far ahead customers can book, in days. */
export const BOOKING_DAYS_AHEAD = 30;

/** Calendar colour of appointments booked online, so staff can spot them. */
export const BOOKING_COLOR: TEventColor = "green";

/** Words used on the booking page; change them to the business's words. */
export const BOOKING_TEXT = {
  title: "Book an appointment",
  intro: "Pick a day and a time that suits you. We will see you then.",
  staffLabel: "With",
  anyStaff: "Anyone available",
  submit: "Confirm booking",
  done: "You're booked",
};
