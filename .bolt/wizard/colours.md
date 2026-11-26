## colours

The user's palette is ALREADY applied: Prompify rewrote `src/theme.css` from it, for the default
mode (`:root`) and both modes of the light / dark switch (`.light`, `.dark`), and set `THEME_MODE`.
Do not edit that file's colour values and do not add colours anywhere else.

How the palette was mapped (for reference):

| Wizard colour | Theme variables | Where it shows in this app |
|---|---|---|
| Primary | `--primary` (+ `--primary-foreground`, `--ring`) | Add Appointment, Create / Save, Confirm booking, the chosen time on the booking page, the active view button, today's date, the Today button's month strip, focus rings |
| Secondary | tints `--background`, `--card`, `--muted`, `--hover`, `--input`, `--border` | Page, calendar frame, dialogs, popovers, hover states, borders (a light tint in light mode, a faint one in dark mode) |
| Accent | `--accent` (+ `--accent-foreground`) — Tailwind class `highlight` | Highlights you add (badges, callouts); not used by default |
| (from the style) | `--foreground`, `--muted-foreground` | Main and secondary text |
| (fixed meaning) | `--success`, `--warning`, `--destructive` | "Happening now", the booking confirmation tick, Delete and errors |

Class names (shadcn): `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `bg-secondary`,
`border-border`, `border-input`, `text-foreground`, `text-muted-foreground`, `bg-primary` +
`text-primary-foreground`, `text-primary`, `bg-highlight` + `text-highlight-foreground` (the brand
accent), `bg-accent` + `text-accent-foreground` (shadcn's SUBTLE HOVER, not the brand accent),
`text-success`, `text-destructive`, `ring-ring`. Opacity works: `bg-primary/15`.

Rules for components:
- Use only theme classes for the interface; never raw Tailwind colours (`bg-zinc-900`,
  `text-blue-600`) or hex / rgb values.
- Text on a filled colour uses its pair: `bg-primary` → `text-primary-foreground`.
- The appointment colours (blue, green, red, yellow, purple, orange, gray — `EVENT_COLORS` in
  src/config/app.ts, drawn in month-event-badge.tsx, event-block.tsx, agenda-event-card.tsx and the
  colour dots in event-form.tsx) are the user's per-appointment LABELS. Leave them as they are; do
  not recolour them to the palette.
- If a genuinely new colour role is needed (rare), add a variable to BOTH mode blocks in
  `src/theme.css` and to `colors` in `tailwind.config.ts`, then use its class.
