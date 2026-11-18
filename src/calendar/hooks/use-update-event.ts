import { useCalendar } from "@/calendar/contexts/calendar-context";
import { saveEvent } from "@/calendar/requests";

import type { IEvent } from "@/calendar/interfaces";

/** Save a changed appointment (edit dialog, drag and drop) and update the calendar. */
export function useUpdateEvent() {
  const { setLocalEvents } = useCalendar();

  const updateEvent = async (event: IEvent) => {
    const newEvent: IEvent = {
      ...event,
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString(),
    };

    let previous: IEvent | undefined;
    setLocalEvents(prev => {
      const index = prev.findIndex(e => e.id === event.id);
      if (index === -1) return prev;
      previous = prev[index];
      return [...prev.slice(0, index), newEvent, ...prev.slice(index + 1)];
    });

    try {
      await saveEvent(newEvent);
    } catch (error) {
      // Put the appointment back where it was if it could not be saved.
      if (previous) {
        const restore = previous;
        setLocalEvents(prev => prev.map(e => (e.id === restore.id ? restore : e)));
      }
      alert(`Could not save the appointment: ${error instanceof Error ? error.message : error}`);
    }
  };

  return { updateEvent };
}
