import { createContext, useContext, useState } from "react";

import { BADGE_VARIANT, VISIBLE_HOURS, WORKING_HOURS } from "@/config/app";

import type { Dispatch, SetStateAction } from "react";
import type { IEvent, IUser } from "@/calendar/interfaces";
import type { TBadgeVariant, TVisibleHours, TWorkingHours } from "@/calendar/types";

interface ICalendarContext {
  selectedDate: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedUserId: IUser["id"] | "all";
  setSelectedUserId: (userId: IUser["id"] | "all") => void;
  /** How appointments look (BADGE_VARIANT in src/config/app.ts). */
  badgeVariant: TBadgeVariant;
  users: IUser[];
  /** Opening hours and visible hours (src/config/app.ts — also used by the booking page). */
  workingHours: TWorkingHours;
  visibleHours: TVisibleHours;
  events: IEvent[];
  setLocalEvents: Dispatch<SetStateAction<IEvent[]>>;
}

const CalendarContext = createContext({} as ICalendarContext);

/** Calendar state: the selected day and staff filter, the loaded staff and appointments. */
export function CalendarProvider({ children, users, events }: { children: React.ReactNode; users: IUser[]; events: IEvent[] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState<IUser["id"] | "all">("all");
  // The loaded appointments; add / edit / delete / drag update this list after saving.
  const [localEvents, setLocalEvents] = useState<IEvent[]>(events);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate: handleSelectDate,
        selectedUserId,
        setSelectedUserId,
        badgeVariant: BADGE_VARIANT,
        users,
        workingHours: WORKING_HOURS,
        visibleHours: VISIBLE_HOURS,
        events: localEvents,
        setLocalEvents,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}
