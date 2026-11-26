## all-styles

The chosen style's numbers are ALREADY applied by Prompify in `src/theme.css`: light or dark (and
the other mode for the switch), font, base text size (scales the whole app), heading weight, letter
spacing, card padding, input padding, corner radius, button shape, badge shape and shadows. Do not
edit those values.

Your job is what variables cannot express: the character of the style. Work in this order and stop
when the app clearly feels like the style:
1. Shared pieces first: `src/components/ui/button.tsx` (variants — outline, secondary, ghost),
   `input.tsx`, `textarea.tsx`, `select.tsx` (trigger), `badge.tsx`, `dialog.tsx` (DialogContent:
   radius, padding, shadow).
2. The frame: `src/components/layout/header.tsx` (staff header), `src/calendar/components/
   client-container.tsx` (the calendar's outer border), `header/calendar-header.tsx` (toolbar,
   view switcher), `header/today-button.tsx`, `header/date-navigator.tsx`.
3. Appointment shapes (keep their colours): `month-view/month-event-badge.tsx`,
   `week-and-day-view/event-block.tsx`, `agenda-view/agenda-event-card.tsx` — radius, padding,
   border, font weight.
4. The booking page `src/booking/booking-page.tsx`: header, cards, time buttons, spacing.

Keep: the views, the grid, drag and drop, every button and behaviour, the wording
(src/config/text.ts), the appointment colours. Use only theme classes for interface colour (see
colours.md). Do not import other fonts and do not remove the light / dark switch. Read-only, do not
edit: ui/calendar.tsx, time-input.tsx, single-day-picker.tsx, popover.tsx, scroll-area.tsx,
tooltip.tsx, form.tsx, avatar-group.tsx.

Current classes you will be changing (for orientation):
- Staff header: `h-[88px]`, icon in `size-12 rounded-full border`, name `text-lg font-medium`.
- Calendar frame: `overflow-hidden rounded-xl border`; toolbar `border-b p-4`.
- View switcher: joined `size="icon"` buttons, active `variant="default"`, others `outline`.
- Month cells: `border-l border-t`; today `bg-primary text-primary-foreground rounded-full`.
- Appointment badges / blocks: `rounded-md border px-2 text-xs`.
- Dialogs: `border bg-background p-6 shadow-lg` (radius from `sm:rounded-lg`).
- Booking cards: `rounded-lg border bg-card p-[var(--card-padding)] shadow-card`; times are outline buttons.

## apple

Calm, airy, premium.
- Staff header and booking header: translucent `bg-background/80 backdrop-blur-md`, hairline border.
- Calendar frame: `rounded-2xl border-border shadow-card`; toolbar `p-5`.
- View switcher: a segmented control — wrap in `rounded-full bg-muted p-1`, buttons `rounded-full`,
  active `bg-background text-foreground shadow-sm`, others ghost.
- Buttons: primary is the pill (already); `outline` → `border-transparent bg-muted text-primary`.
- Inputs / select: `bg-muted border-transparent rounded-xl`, focus `ring-4 ring-primary/20`.
- Appointment badges / blocks: `rounded-lg border-0 font-medium`.
- Dialogs: `rounded-2xl p-8`, softer shadow.
- Booking page: `space-y-8`, time buttons pill-shaped, title `text-3xl tracking-tight`.

## airbnb

Warm, friendly, rounded.
- Calendar frame and booking cards: `rounded-2xl shadow-card` (three-layer shadow already set).
- Buttons: primary `font-semibold`; `outline` → `border-foreground/20 hover:border-foreground`.
- View switcher: `rounded-full` buttons, active `bg-foreground text-background`.
- Booking time buttons: `rounded-xl font-semibold`, the chosen one primary.
- Appointment badges: `rounded-lg font-medium`.
- Inputs: visible border, focus `border-foreground ring-1 ring-foreground`.
- Dialogs: `rounded-2xl`.

## stripe

Precise, refined, trustworthy.
- Calendar frame: `rounded-lg border shadow-card`; toolbar uses hairline dividers.
- Buttons: primary adds `shadow-sm`; outline `bg-card border-border`.
- Titles: light weight already; `tracking-tight`. Counts and times `tabular-nums`.
- Inputs: `bg-card border-border`, focus `border-primary ring-2 ring-primary/20`.
- Appointment badges: `rounded border font-medium` (small corners).
- Booking time buttons: `rounded tabular-nums`.

## notion

Quiet, document-like.
- No shadows: calendar frame `border` only; dialogs `shadow-sm`.
- Buttons: outline → ghost (`border-transparent hover:bg-muted`); primary small and solid.
- View switcher: ghost buttons, active `bg-muted text-foreground`.
- Appointment badges: `rounded border-0 font-normal` (the colour tint carries them).
- Booking page: generous spacing `space-y-10`, time buttons ghost with a border.

## linear

Dense, precise, dark.
- Staff header `h-16`; toolbar `p-3`; month cells keep thin borders.
- Buttons one step smaller (`size="sm"` for toolbar actions); outline `bg-foreground/[0.03]`.
- View switcher: ghost buttons, active `bg-muted text-foreground`.
- Appointment badges / blocks: `rounded border-0 text-xs font-medium` (dense).
- Inputs: `bg-background border-border text-sm`.
- Dialogs: `rounded-lg border-border p-5`.

## figma

Playful and bold.
- Buttons: pill (already); outline `border-2 border-foreground`.
- View switcher: `rounded-full`, active `bg-foreground text-background`.
- Appointment badges: `rounded-full px-3 font-medium`.
- Calendar frame: `rounded-2xl border-2`.
- Booking time buttons: `rounded-full`.

## spotify

Bold, dense, dark.
- Calendar frame: no border, `bg-card rounded-lg`; month cells `border-border/50`.
- Buttons: pill (already), primary `font-bold`; outline `border-muted-foreground hover:border-foreground`.
- Appointment badges: `rounded font-bold`.
- Booking time buttons: pill, `font-bold`.
- Hover: rows and badges brighten (`hover:brightness-110`).

## framer

Cinematic, dark, motion-forward.
- Titles `tracking-tight`; booking title `text-4xl`.
- Calendar frame and dialogs: `rounded-2xl border-border`.
- Buttons: pill (already); outline frosted `bg-foreground/10 border-transparent backdrop-blur`.
- Motion: badges and time buttons `transition-transform hover:scale-[1.02]`.

## raycast

A precision instrument.
- Calendar frame and dialogs: `border-border` with the inset highlight shadow (already set).
- Buttons: hover with `hover:opacity-80`; outline `bg-foreground/[0.03] border-border`.
- Badges and time buttons: keyboard-key look — `border border-border bg-muted font-medium`.
- Toolbar compact `p-3`.

## supabase

A developer tool.
- Calendar frame `rounded-md border`, no shadow.
- Buttons: primary pill (already); outline pill `border-border hover:border-foreground/40`.
- Active view: `border border-primary/40 bg-primary/10 text-primary`.
- Times, dates and counts in `font-mono text-xs` where they appear in the toolbar and booking page.
- Appointment badges: `rounded font-normal`.
