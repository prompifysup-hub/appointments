import { addMinutes, areIntervalsOverlapping, isBefore, setHours, setMinutes, startOfDay } from "date-fns";

import type { IEvent, IUser } from "@/calendar/interfaces";
import type { TWorkingHours } from "@/calendar/types";

export interface Slot {
  start: Date;
  end: Date;
  /** Staff members free for the whole slot. */
  free: IUser[];
}

/** Is the business open at all on this day? */
export const isOpenOn = (day: Date, hours: TWorkingHours) => {
  const h = hours[day.getDay()];
  return Boolean(h && h.to > h.from);
};

/**
 * Bookable slots on a day: every `step` minutes inside the opening hours, long enough for the
 * appointment, not in the past, with at least one of `staff` free (no overlapping appointment).
 */
export function slotsFor(
  day: Date,
  hours: TWorkingHours,
  events: IEvent[],
  staff: IUser[],
  { minutes, step, now = new Date() }: { minutes: number; step: number; now?: Date },
): Slot[] {
  const h = hours[day.getDay()];
  if (!h || h.to <= h.from || staff.length === 0) return [];

  const close = setMinutes(setHours(startOfDay(day), h.to), 0);
  const slots: Slot[] = [];

  for (let start = setHours(startOfDay(day), h.from); !isBefore(close, addMinutes(start, minutes)); start = addMinutes(start, step)) {
    const end = addMinutes(start, minutes);
    if (isBefore(start, now)) continue;

    const free = staff.filter(
      user =>
        !events.some(
          e => e.user.id === user.id && areIntervalsOverlapping({ start, end }, { start: new Date(e.startDate), end: new Date(e.endDate) }),
        ),
    );
    if (free.length > 0) slots.push({ start, end, free });
  }

  return slots;
}
