# Appointments template — function spec

The reference for what this template does, screen by screen, button by button. Every change to the
template must keep this spec true, and the test checklist at the end must pass before a change is
pushed. Kept in `.bolt/`, which Prompify does not import into the user's project (no token cost).

How each wizard answer changes the template (what Prompify applies itself, and what the AI is
told to do) is in `.bolt/wizard/` — see its README.

Based on Big Calendar by Leonardo Ramos (MIT). React 18 + Vite + TypeScript + Tailwind 3 +
shadcn/ui (Radix) + react-hook-form + zod + date-fns + react-dnd + react-aria (time inputs) +
react-day-picker. No other UI library.

---

## 1. Who uses it

| Role | Where | Signs in? |
|---|---|---|
| **Staff** | The calendar (day, week, month, agenda) | No login. Anyone with the link can use it. |
| **Client** | The public booking page /book (only when `AUDIENCE` is `'customers'` or `'both'`) | No login, no account. |

`AUDIENCE` (src/prompify-settings.ts, set by Prompify from the wizard's "Who uses it?"):

| Value | App opens on | /book | Staff header shows "Booking page" |
|---|---|---|---|
| `'team'` (default) | /month-view | off (the route does not exist) | no |
| `'customers'` | /book | on | yes |
| `'both'` | /month-view | on | yes |

`THEME_MODE` (same file) is light or dark on the first visit; the header switch changes it and the
choice is remembered in the browser.

---

## 2. Screens

Unknown staff addresses redirect to /month-view.

### 2.1 Staff header (src/components/layout/header.tsx)
- `APP.name` and `APP.tagline`, a calendar icon.
- **Booking page** button → /book (only when public booking is on).
- **Light / dark switch** (sun / moon icon).

### 2.2 Calendar frame (src/calendar/components/client-container.tsx + header/)
Shared by all four views, inside a rounded border:
- **Today** button (month abbreviation + day number): jumps to today.
- **Date navigator:** "<Month> <Year>", a badge "<n> appointments" (count for the period of the
  current view and staff filter), the date range of the view, and **Previous** / **Next** arrows
  that move by one day / week / month depending on the view.
- **View switcher:** Day (/day-view), Week (/week-view), Month (/month-view), Agenda (/agenda-view);
  the active view is highlighted.
- **Staff filter:** "All" (avatars of everyone) or one staff member; filters every view.
- **Add Appointment** button → the add dialog (2.7).

Appointments are drawn in their colour (EVENT_COLORS) in the style set by `BADGE_VARIANT`
("colored", "dot" or "mixed"). Clicking an appointment opens its details (2.6).

### 2.3 Month view — /month-view
- 7-column grid (Sun…Sat), days outside the month dimmed, today circled.
- Up to **3 appointments per day**; more shows "+n" (small screens) / "<n> more…".
- Multi-day appointments run across the days they cover.
- **Drag and drop** an appointment to another day: same start time, same length (saves at once).
- **Click a day number** → the day view for that day (add appointments there or with the header button).

### 2.4 Week view — /week-view and Day view — /day-view
- Hour rows from `VISIBLE_HOURS`, widened automatically to include any appointment outside them.
- Hours outside `WORKING_HOURS` (and closed days) are striped.
- A line marks the current time.
- **Click an empty quarter-hour** (hh:00, :15, :30, :45) → the add dialog with that day and start time.
- **Drag and drop** an appointment onto a quarter-hour: new start, same length (saves at once).
- Overlapping appointments sit side by side. Multi-day appointments appear in a row above the hours.
- Week view: not available on small screens ("Weekly view is not available on smaller devices.").
- Day view: a side panel (medium screens and up) with a month picker to change the day, and
  "Happening now" listing appointments in progress (or "No appointments at the moment").

### 2.5 Agenda view — /agenda-view
- The selected month's appointments grouped by day ("Monday, November 30, 2026"), multi-day ones
  repeated on each day. Empty month: "No appointments scheduled for the selected month".

### 2.6 Appointment details (dialogs/event-details-dialog.tsx)
- Title; Staff member (or "Unassigned"); Client (name · email · phone, when any is set); Start;
  End; Notes (when set).
- **Delete:** asks "Delete "<title>"?"; on OK deletes, removes it from the calendar and closes the dialog.
- **Edit:** opens the edit dialog (2.7) with the appointment's values.

### 2.7 Add / Edit appointment (dialogs/add-event-dialog.tsx, edit-event-dialog.tsx, form in event-form.tsx)
- Fields: Staff member (required), Title (required), Client name / email / phone (optional),
  Start Date + Start Time, End Date + End Time (required; 12-hour time inputs), Color (required;
  from EVENT_COLORS), Notes (optional).
- Validation messages: "Pick a staff member", "Title is required", "Start date is required",
  "Start time is required", "End date is required", "End time is required", "Color is required",
  "Enter a valid email address" (only when an email is typed), "The end must be after the start"
  (checked once the other fields are valid).
- **Create Appointment** / **Save Changes** (reads "Saving…" while saving) saves and closes; a save
  error is shown under the title and the dialog stays open. **Cancel** closes without saving.

### 2.8 Public booking page — /book (src/booking/)
- Header with `APP.name` / `APP.tagline`; footer with the contact line "Questions? Email us at
  <APP.contactEmail>" (hidden when empty) and **Staff area** → /month-view.
- **With:** "Anyone available" (default) or one staff member.
- **Day picker:** past days, days beyond `BOOKING.daysAhead` and closed days are disabled.
- **Free times on <day>:** buttons every `BOOKING.slotMinutes` from opening to the last start that
  still ends by closing (`BOOKING.appointmentMinutes` long), skipping times already past and times
  when the chosen staff member (or, for "anyone", every staff member) is booked. None: "No free
  times on this day. Try another day."
- After picking a time: Your name (required), Email (required), Phone, Anything we should know?
  → **Confirm booking** ("Booking…"). Creates an appointment: title = the client's name, the
  client's name / email / phone in their own fields, notes "Booked online" (+ their note), colour
  `BOOKING.color`, staff = the chosen one or the first free one.
- Confirmation "You're booked" with day, time and staff member, and **Book another** (the booked
  time is no longer offered).

---

## 3. Data

Created by the AI in one `<boltAction type="data">`; reached only through `src/calendar/requests.ts`
(which uses `src/lib/prompify.ts`). Every row also has `id` (uuid), `created_at`, `updated_at`.

### staff
| Column | Type | Meaning |
|---|---|---|
| name | text, required | Shown in the filter, forms, details, booking page |
| picture_url | text | Avatar image (initial letter when empty) |

### appointments
| Column | Type | Meaning |
|---|---|---|
| title | text, required | Shown in the calendar |
| description | text | Notes |
| client_name / client_email / client_phone | text | Who the appointment is for |
| start_date / end_date | timestamptz, required | Start and end (end after start) |
| color | text | blue, green, red, yellow, purple, orange or gray (default blue) |
| staff_id | uuid → staff.id | Who it is with ("Unassigned" when empty or unknown) |

Mapping to the app's types: `IEvent` (camelCase: clientName, startDate, user …) and `IUser`.

---

## 4. Rules (all in one place)

1. The end of an appointment must be after its start.
2. Dragging keeps the appointment's length: to a day (month view) keeps the start time; to a
   quarter-hour (week / day view) takes that start time. The change saves at once; if saving fails
   the appointment jumps back and a message is shown.
3. Online booking only offers free times: inside `WORKING_HOURS`, on open days, within
   `BOOKING.daysAhead`, not in the past, and not overlapping that staff member's appointments.
   "Anyone available" assigns the first free staff member.
4. Opening hours have one source, `WORKING_HOURS` in src/config/app.ts, used by the calendar
   (striped hours) and the booking page.
5. Staff filter and the "<n> appointments" count apply to the current view's period.

---

## 5. Files that make up the look and the wording

| File | Holds |
|---|---|
| src/theme.css | The look placeholders: colours for light and dark (`:root`, `.light`, `.dark`), font, base text size, heading weight, letter spacing, card and input padding, radius, button and badge shape, shadows. Rewritten by Prompify; every use has a fallback. |
| tailwind.config.ts | Maps the variables to shadcn class names; `accent` = shadcn's subtle hover, `highlight` = the brand accent. |
| src/components/ui/* | shadcn/ui components (button, input, select, dialog, calendar…), the shared look. |
| src/config/app.ts | Identity, opening and visible hours, badge style, appointment colours, booking settings. |
| src/config/text.ts | Every on-screen word, built from TERMS. |
| src/prompify-settings.ts | `AUDIENCE`, `THEME_MODE`. |

The appointment colours (blue, green… in the event badges and the colour dots) are the user's
per-appointment labels, not the theme; everything else uses theme classes.

---

## 6. Known limitations

1. **No double-booking check for staff.** Adding, editing or dragging in the calendar allows
   overlapping appointments for the same person (only the booking page avoids overlaps).
2. **Booking is not protected.** Anyone with the /book link can book; there is no confirmation
   email, cancellation link or spam protection.
3. **No login.** Anyone with the staff link can see and change every appointment.
4. **Times are the browser's local time.** Staff and clients in different time zones see their own
   local times; the business's time zone is not configured.
5. **Week view is hidden on small screens.**
6. **Drag and drop** needs a mouse (react-dnd HTML5 backend); on touch screens use Edit instead.
7. **Outside Prompify** (no /env-config.js) the demo data in src/calendar/mocks.ts is used and
   changes are kept in memory only.

Not included in the basic version (the AI adds them only if the user's description asks):
services with prices and durations, recurring appointments, reminders / emails, cancellation by
clients, staff working hours per person, buffers between appointments, payments.

---

## 7. Test checklist

Run with `AUDIENCE = 'both'` against the demo data. Automated in `.bolt/test/flow-full.cjs` (30
checks): start the app with `npx vite --port 5192`, then from a folder with `puppeteer-core`
installed run `node flow-full.cjs http://localhost:5192 <screenshot-prefix>`; it ends with "ALL
PASSED". Put `AUDIENCE` back to `'team'` afterwards.

**Frame**
- [ ] The month view shows a count; there is no settings panel and no year view.
- [ ] The light / dark switch changes the theme.
- [ ] Day / Week / Agenda / Month buttons open their views.
- [ ] Next / Previous move by one month; Today returns to the current month.
- [ ] Clicking a day number in the month view opens the day view.
- [ ] The staff filter narrows the count; "All" restores it.

**Add / edit / delete**
- [ ] An empty form is refused (title, staff member); a bad email is refused; an end before the
      start is refused.
- [ ] A valid appointment is created, the dialog closes and the count goes up.
- [ ] Details show the client; Edit saves a new title; Delete asks, removes it and closes the dialog.

**Booking page**
- [ ] /book opens; picking a staff member and a day shows free times.
- [ ] Booking shows "You're booked" with the time and staff member; that time is then no longer offered.
- [ ] The contact line is shown.

**By hand (not automated)**
- [ ] Drag an appointment to another day (month) and to another time (week / day); it keeps its length.
- [ ] Click an empty quarter-hour in the day view: the add dialog opens with that time.

**Build**
- [ ] `npx tsc --noEmit -p .` and `npx vite build` pass.
