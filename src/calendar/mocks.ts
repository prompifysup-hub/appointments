/*
 * Demo data used ONLY when the app runs outside Prompify (no /env-config.js), so the template can be
 * previewed locally. Inside Prompify the real staff and appointments tables are always used.
 */
import { WORKING_HOURS } from "@/config/app";

import type { TEventColor } from "@/calendar/types";
import type { IEvent, IUser } from "@/calendar/interfaces";

export const USERS_MOCK: IUser[] = [
  { id: "dd503cf9-6c38-43cf-94cc-0d4032e2f77a", name: "Sarah Chen", picturePath: null },
  { id: "f3b035ac-49f7-4e92-a715-35680bf63175", name: "Daniel Okafor", picturePath: null },
  { id: "3e36ea6e-78f3-40dd-ab8c-a6c737c3c422", name: "Maria Rossi", picturePath: null },
  { id: "a7aff6bd-a50a-4d6a-ab57-76f76bb27cf5", name: "James Patel", picturePath: null },
];

const SERVICES = ["Consultation", "Follow-up", "First visit", "Check-up", "Review meeting", "Assessment"];
const CLIENTS = [
  ["Emma Wilson", "emma@example.com", "555-0101"],
  ["Liam Brown", "liam@example.com", "555-0102"],
  ["Olivia Garcia", "olivia@example.com", ""],
  ["Noah Martin", "noah@example.com", "555-0104"],
  ["Ava Thompson", "", "555-0105"],
  ["Lucas Moreau", "lucas@example.com", ""],
];
const COLORS: TEventColor[] = ["blue", "green", "purple", "orange", "yellow", "red", "gray"];

/** About 25 appointments from a week ago to two weeks ahead, inside opening hours, plus one happening now. */
function generate(): IEvent[] {
  const events: IEvent[] = [];
  const now = new Date();
  let id = 1;

  const add = (start: Date, minutes: number, index: number) => {
    const [clientName, clientEmail, clientPhone] = CLIENTS[index % CLIENTS.length];
    const end = new Date(start.getTime() + minutes * 60000);
    events.push({
      id: id++,
      title: `${SERVICES[index % SERVICES.length]} - ${clientName}`,
      description: index % 3 === 0 ? "Bring previous notes." : "",
      clientName,
      clientEmail,
      clientPhone,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      color: COLORS[index % COLORS.length],
      user: USERS_MOCK[index % USERS_MOCK.length],
    });
  };

  // One appointment happening right now, so "Happening now" in the day view has something to show.
  add(new Date(now.getTime() - 15 * 60000), 45, 0);

  for (let dayOffset = -7, n = 1; dayOffset <= 14; dayOffset++) {
    const day = new Date(now);
    day.setDate(now.getDate() + dayOffset);
    const hours = WORKING_HOURS[day.getDay()];
    if (!hours || hours.to <= hours.from) continue;
    // One or two appointments per open day, on the hour or half hour.
    for (let k = 0; k < (dayOffset % 2 === 0 ? 2 : 1); k++, n++) {
      const start = new Date(day);
      start.setHours(hours.from + ((n * 3) % Math.max(1, hours.to - hours.from - 1)), n % 2 === 0 ? 30 : 0, 0, 0);
      add(start, n % 3 === 0 ? 60 : 30, n);
    }
  }

  return events;
}

export const CALENDAR_ITEMS_MOCK: IEvent[] = generate();
