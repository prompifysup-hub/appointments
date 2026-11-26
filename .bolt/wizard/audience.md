## team

Internal staff only. `AUDIENCE` is ALREADY `'team'` in `src/prompify-settings.ts`: the app opens on
the calendar and the public booking page (/book) is switched off.
- Do not add a booking page, sign-up or a client area.
- Wording is for colleagues (TERMS in src/config/text.ts): e.g. meeting / room / colleague for an
  internal scheduling tool.

## customers

Clients book online. `AUDIENCE` is ALREADY `'customers'`: the app opens on the public booking page;
staff use the calendar (footer link "Staff area").
- Make the booking page the front door: `TEXT.booking` in src/config/text.ts (title, intro, button
  in the business's voice), `APP.contactEmail`, and `BOOKING` in src/config/app.ts (appointment
  length, slot step, how far ahead, colour of online bookings) to match the business.
- If the business has services (haircut 30 min, colour 90 min…), follow recipe A in
  description.md and let clients pick a service before the time.
- Keep it account-free: no login, sign-up or client accounts.
- Known limitations to mention in your reply to the user: online bookings are not confirmed by
  email, clients cannot cancel online, and the page has no spam protection.

## both

Staff calendar plus online booking. `AUDIENCE` is ALREADY `'both'`: the app opens on the calendar,
the staff header has "Booking page", and /book is on.
- Adapt the booking page as in `customers` (wording, contact email, booking settings, services if
  any), and the staff wording as in `team`.
- Same limitations to mention: no confirmation emails, no online cancellation, no spam protection.
