import { useCalendar } from "@/calendar/contexts/calendar-context";
import { deleteEvent } from "@/calendar/requests";

import type { IEvent } from "@/calendar/interfaces";

/** Delete an appointment and remove it from the calendar. */
export function useDeleteEvent() {
  const { setLocalEvents } = useCalendar();

  const removeEvent = async (id: IEvent["id"]) => {
    await deleteEvent(id);
    setLocalEvents(prev => prev.filter(e => e.id !== id));
  };

  return { removeEvent };
}
