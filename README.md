# Prompify appointments template

Big Calendar by Leonardo Ramos (MIT, see `LICENSE`), moved from Next.js to Vite and connected to
Prompify's database.

- **Inside Prompify**: appointments and staff are loaded from and saved to the `appointments` and
  `staff` tables (see `src/calendar/requests.ts`).
- **Locally**: `npm install && npm run dev` runs it with Big Calendar's demo data.

Changes from the original: Next.js pages, cookies and fonts replaced by Vite, react-router and
localStorage; the add dialog now creates appointments, edits and drag-and-drop are saved, and the
details dialog has a Delete button; the author links in the header and the separate `/demo`
calendar were removed.
