import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { addDays, format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { APP_NAME, APP_TAGLINE } from "@/components/layout/header";
import { WORKING_HOURS } from "@/calendar/contexts/calendar-context";
import { createEvent, getEvents, getUsers } from "@/calendar/requests";
import { APPOINTMENT_MINUTES, BOOKING_COLOR, BOOKING_DAYS_AHEAD, BOOKING_TEXT, SLOT_MINUTES } from "@/booking/booking-settings";
import { isOpenOn, slotsFor, type Slot } from "@/booking/slots";

import type { IEvent, IUser } from "@/calendar/interfaces";

const ANY = "any";

/**
 * Public booking page (/book). A customer picks a day, a staff member (or anyone available) and a
 * free time, enters their details, and the appointment is added to the staff calendar.
 */
export function BookingPage() {
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [day, setDay] = useState<Date | undefined>();
  const [staffId, setStaffId] = useState<string>(ANY);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [booked, setBooked] = useState<IEvent | null>(null);

  useEffect(() => {
    Promise.all([getUsers(), getEvents()])
      .then(([u, e]) => {
        setUsers(u);
        setEvents(e);
      })
      .catch(e => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const staff = useMemo(() => (users ?? []).filter(u => staffId === ANY || u.id === staffId), [users, staffId]);
  const slots = useMemo(
    () => (day ? slotsFor(day, WORKING_HOURS, events, staff, { minutes: APPOINTMENT_MINUTES, step: SLOT_MINUTES }) : []),
    [day, events, staff],
  );

  const today = startOfDay(new Date());
  const lastDay = addDays(today, BOOKING_DAYS_AHEAD);
  const set = (field: keyof typeof form) => (e: { target: { value: string } }) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (!slot) return;
    setSaving(true);
    setError(null);
    try {
      const details = [`Booked online`, `Email: ${form.email}`, form.phone && `Phone: ${form.phone}`, form.notes && `\n${form.notes}`]
        .filter(Boolean)
        .join("\n");
      const event = await createEvent({
        title: form.name,
        description: details,
        startDate: slot.start.toISOString(),
        endDate: slot.end.toISOString(),
        color: BOOKING_COLOR,
        user: slot.free[0],
      });
      setEvents(prev => [...prev, event]);
      setBooked(event);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  function bookAnother() {
    setBooked(null);
    setSlot(null);
    setForm({ name: "", email: "", phone: "", notes: "" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-3 px-6">
          <div className="flex size-10 items-center justify-center rounded-full border">
            <CalendarIcon className="size-5" />
          </div>
          <div>
            <p className="font-medium leading-5">{APP_NAME}</p>
            <p className="text-sm text-muted-foreground">{APP_TAGLINE}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {booked ? (
          <div className="mx-auto max-w-md space-y-4 rounded-lg border bg-card p-8 text-center shadow-card">
            <CheckCircle2 className="mx-auto size-12 text-success" />
            <h1 className="text-2xl font-semibold">{BOOKING_TEXT.done}</h1>
            <p className="text-muted-foreground">
              {format(new Date(booked.startDate), "EEEE d MMMM")} at {format(new Date(booked.startDate), "HH:mm")}
              {booked.user.id && <> with {booked.user.name}</>}.
            </p>
            <Button variant="outline" onClick={bookAnother}>
              Book another
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold">{BOOKING_TEXT.title}</h1>
              <p className="mt-1 text-muted-foreground">{BOOKING_TEXT.intro}</p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}

            {!users ? (
              <Skeleton className="h-[420px] w-full rounded-xl" />
            ) : (
              <div className="grid gap-6 md:grid-cols-[auto_1fr]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{BOOKING_TEXT.staffLabel}</Label>
                    <Select
                      value={staffId}
                      onValueChange={value => {
                        setStaffId(value);
                        setSlot(null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ANY}>{BOOKING_TEXT.anyStaff}</SelectItem>
                        {users.map(u => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg border bg-card">
                    <Calendar
                      mode="single"
                      selected={day}
                      onSelect={d => {
                        setDay(d);
                        setSlot(null);
                      }}
                      disabled={d => d < today || d > lastDay || !isOpenOn(d, WORKING_HOURS)}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>{day ? `Free times on ${format(day, "EEEE d MMMM")}` : "Choose a day first"}</Label>
                    {day && slots.length === 0 && <p className="text-sm text-muted-foreground">No free times on this day. Try another day.</p>}
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slots.map(s => (
                        <Button
                          key={s.start.toISOString()}
                          type="button"
                          variant={slot?.start.getTime() === s.start.getTime() ? "default" : "outline"}
                          onClick={() => setSlot(s)}
                        >
                          {format(s.start, "HH:mm")}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {slot && (
                    <form onSubmit={confirm} className="space-y-4 rounded-lg border bg-card p-5 shadow-card">
                      <p className="text-sm text-muted-foreground">
                        {format(slot.start, "EEEE d MMMM, HH:mm")} – {format(slot.end, "HH:mm")}
                      </p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="book-name">Your name</Label>
                          <Input id="book-name" required value={form.name} onChange={set("name")} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="book-email">Email</Label>
                          <Input id="book-email" type="email" required value={form.email} onChange={set("email")} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="book-phone">Phone (optional)</Label>
                          <Input id="book-phone" value={form.phone} onChange={set("phone")} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="book-notes">Anything we should know? (optional)</Label>
                        <Textarea id="book-notes" value={form.notes} onChange={set("notes")} />
                      </div>
                      <Button type="submit" className="w-full" disabled={saving}>
                        {saving ? "Booking…" : BOOKING_TEXT.submit}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="pb-8 text-center text-sm text-muted-foreground">
        <Link to="/month-view" className="hover:text-foreground">
          Staff area
        </Link>
      </footer>
    </div>
  );
}
