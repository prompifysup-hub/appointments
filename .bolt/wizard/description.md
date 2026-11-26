## description

The user's description is the main spec. This scheduling app already works end to end; adapt it in
the order below and change code only when a placeholder cannot express what the user asked for.

### 1. Read the description for these signals

| The user says… | Change |
|---|---|
| The business name, what it does | `APP.name`, `APP.tagline`, `APP.description`, `APP.company` (src/config/app.ts) |
| A contact address | `APP.contactEmail` |
| Opening hours ("Mon–Fri 9–6, Sat 10–2") | `WORKING_HOURS` (0 = Sunday; from == to = closed) and `VISIBLE_HOURS` (a little wider) |
| What they call appointments ("bookings", "sessions", "classes", "reservations") | `TERMS.appointment / appointments / Appointment` in src/config/text.ts |
| Who appointments are with ("stylists", "doctors", "trainers", "rooms", "tables") | `TERMS.staff / Staff`; seed those people or resources as `staff` rows |
| Who they are for ("patients", "guests", "members", "students") | `TERMS.client / Client` |
| How long an appointment usually lasts; how far ahead people can book | `BOOKING.appointmentMinutes`, `BOOKING.slotMinutes`, `BOOKING.daysAhead` |
| Services with durations / prices | Recipe A |
| Appointment states (confirmed, completed, cancelled, no-show) | Recipe C |
| "Don't allow double bookings" | Recipe E |
| Different hours per person, or breaks between appointments | Recipes D and F |
| A feature this template has (views, drag and drop, staff filter, online booking, client details) | Nothing to build: adapt wording and data only |

Sample data (the data action) must match the business: 3–5 staff (people or rooms), 15–25
appointments over the current and next two weeks inside `WORKING_HOURS`, titles like
"<service> - <client>", and client name / email / phone filled in.

### 2. Order of work
1. src/config/app.ts — identity, hours, booking settings.
2. src/config/text.ts — TERMS first, then single lines that still read wrong.
3. The data action — tables (see the template instructions), sample rows.
4. Only then code, for missing features, following the recipes.

### 3. Never change (the stable core)
- `src/lib/prompify.ts`, `src/calendar/requests.ts` as the only data path (you may ADD fields to the
  mapping), `src/calendar/mocks.ts`.
- The `staff` and `appointments` tables and their existing columns (ADD columns / tables, never
  rename or remove).
- The views, the grid, drag and drop (`src/calendar/components/dnd/`), the date helpers
  (`src/calendar/helpers.ts`), the calendar context.
- One appointment form: `dialogs/event-form.tsx` with `schemas.ts` — add fields there, never a
  second form. Opening hours only in `WORKING_HOURS`.
- The booking slot logic in `src/booking/slots.ts` (extend it, keep: inside opening hours, not in the
  past, no overlap for that staff member).
- `src/prompify-settings.ts` and `src/theme.css` values (Prompify set them).
- No wording in components (src/config/text.ts); no raw interface colours (colours.md).
- No login, sign-up, payments or other calendar / UI libraries.

### 4. Recipes for missing features

**A. Services (name, duration, price)**
1. Table `services` (transactional): name text NOT NULL, duration_minutes integer NOT NULL, price
   numeric, color text; 4–8 sample rows. Column `appointments.service_id uuid references services.id`.
2. Types: an `IService`; `serviceId` on `IEvent`; map it in requests.ts (toEvent / toRow) and load
   services alongside staff.
3. event-form.tsx: a Service select (shadcn Select) — choosing one sets the title to
   "<service> - <client>", the end time to start + duration, and the colour.
4. Booking page: a Service select first; use its duration for `slotsFor` (instead of
   `BOOKING.appointmentMinutes`) and save `service_id`.
5. A Services page to manage them: see recipe B for the page pattern; show price on the booking page.

**B. A management page** (staff, services, clients)
1. A component in src/pages/<Name>.tsx (create the folder) with: a table or list of rows, an
   add / edit Dialog with Input fields and validation, Delete with `confirm()`. Load and save with new
   functions in requests.ts using `db.list / create / update / remove` from src/lib/prompify.ts.
2. A route inside `StaffApp` in src/App.tsx (e.g. /services) and an outline Button link in the staff
   header (src/components/layout/header.tsx) next to "Booking page".
3. Wording in a new section of src/config/text.ts.

**C. Appointment status**
1. Column `appointments.status text` (e.g. booked, confirmed, completed, cancelled, no_show); a
   `STATUSES` list `{ value, label }` in src/config/app.ts.
2. `status` on IEvent + mapping; a Status select in event-form.tsx; shown in event-details-dialog.tsx.
3. Cancelled / no-show: show them faded (`opacity-50 line-through`) in the badges and exclude them
   from the booking-page overlap check in slots.ts. Online bookings start as "booked".

**D. Different working hours per staff member**
1. Column `staff.working_hours jsonb` in the `WORKING_HOURS` shape (null = use the business hours).
2. In slots.ts, check each staff member against their own hours; in the week / day views keep the
   business hours for the striped background.

**E. No double bookings in the staff calendar**
1. A helper `overlaps(event, events)` (same staff member, intervals overlap, excluding itself),
   using `areIntervalsOverlapping` from date-fns.
2. event-form.tsx: refuse with a message (add it to TEXT.form.errors) when it overlaps.
3. Drag and drop (use-update-event.ts or the droppables): if the new time overlaps, do not save and
   show the message.

**F. Breaks between appointments** — `BOOKING.bufferMinutes`; in slots.ts treat each existing
appointment as ending `bufferMinutes` later when checking overlaps.

**G. Renaming the product everywhere** — TERMS + APP only; never edit wording inside components.

### 5. Before finishing
- Every new button, form and page works end to end (create, edit, delete, validation, empty state).
- New tables are in the data action with valid sample rows; new IEvent fields are mapped both ways.
- The booking page still only offers free times inside opening hours.
- No raw interface colours, no wording in components, one appointment form.
- Mention the limitations that apply (no confirmation emails, no online cancellation, no spam
  protection; staff calendar allows overlaps unless recipe E was applied).
