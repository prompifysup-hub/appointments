import { useCalendar } from "@/calendar/contexts/calendar-context";
import { createEvent } from "@/calendar/requests";

import type { IEvent } from "@/calendar/interfaces";

/** Save a new appointment and show it in the calendar. */
export function useAddEvent() {
  const { setLocalEvents } = useCalendar();

  const addEvent = async (event: Omit<IEvent, "id">) => {
    const saved = await createEvent(event);
    setLocalEvents(prev => [...prev, saved]);
    return saved;
  };

  return { addEvent };
}
