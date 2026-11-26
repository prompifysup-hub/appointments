import type { TEventColor } from "@/calendar/types";

export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
}

export interface IEvent {
  id: string | number; // uuid from Prompify; numbers only in the local demo data (mocks.ts)
  startDate: string;
  endDate: string;
  title: string;
  color: TEventColor;
  /** Notes about the appointment. */
  description: string;
  /** Who the appointment is for (empty when not given). */
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  user: IUser;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
