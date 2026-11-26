/*
 * Loading and saving appointments. Inside Prompify they live in the `appointments` and `staff`
 * tables; outside Prompify (local preview) the demo data in mocks.ts is used and changes are
 * kept in memory only.
 */
import { CALENDAR_ITEMS_MOCK, USERS_MOCK } from "@/calendar/mocks";
import { db, isConnected } from "@/lib/prompify";

import type { IEvent, IUser } from "@/calendar/interfaces";
import type { TEventColor } from "@/calendar/types";

/** A row of the `staff` table. */
interface StaffRow {
  id: string;
  name: string;
  picture_url: string | null;
}

/** A row of the `appointments` table. */
interface AppointmentRow {
  id: string;
  title: string;
  description: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  start_date: string;
  end_date: string;
  color: string | null;
  staff_id: string | null;
}

const UNASSIGNED: IUser = { id: "", name: "Unassigned", picturePath: null };

const toUser = (row: StaffRow): IUser => ({ id: row.id, name: row.name, picturePath: row.picture_url });

const toEvent = (row: AppointmentRow, staff: IUser[]): IEvent => ({
  id: row.id,
  title: row.title,
  description: row.description ?? "",
  clientName: row.client_name ?? "",
  clientEmail: row.client_email ?? "",
  clientPhone: row.client_phone ?? "",
  startDate: new Date(row.start_date).toISOString(),
  endDate: new Date(row.end_date).toISOString(),
  color: (row.color as TEventColor) || "blue",
  user: staff.find(user => user.id === row.staff_id) ?? UNASSIGNED,
});

const toRow = (event: Omit<IEvent, "id">) => ({
  title: event.title,
  description: event.description,
  client_name: event.clientName || null,
  client_email: event.clientEmail || null,
  client_phone: event.clientPhone || null,
  start_date: event.startDate,
  end_date: event.endDate,
  color: event.color,
  staff_id: event.user.id || null,
});

export const getUsers = async (): Promise<IUser[]> => {
  if (!isConnected()) return USERS_MOCK;
  return (await db.list<StaffRow>("staff")).map(toUser);
};

export const getEvents = async (): Promise<IEvent[]> => {
  if (!isConnected()) return CALENDAR_ITEMS_MOCK;
  const [rows, staff] = await Promise.all([db.list<AppointmentRow>("appointments"), getUsers()]);
  return rows.map(row => toEvent(row, staff));
};

export const createEvent = async (event: Omit<IEvent, "id">): Promise<IEvent> => {
  if (!isConnected()) return { ...event, id: crypto.randomUUID() };
  const row = await db.create<AppointmentRow>("appointments", toRow(event));
  return { ...event, id: row.id };
};

export const saveEvent = async (event: IEvent): Promise<void> => {
  if (!isConnected()) return;
  await db.update("appointments", String(event.id), toRow(event));
};

export const deleteEvent = async (id: IEvent["id"]): Promise<void> => {
  if (!isConnected()) return;
  await db.remove("appointments", String(id));
};
