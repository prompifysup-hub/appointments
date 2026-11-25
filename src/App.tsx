import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Settings } from "lucide-react";

import { CalendarProvider } from "@/calendar/contexts/calendar-context";

import { Header } from "@/components/layout/header";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientContainer } from "@/calendar/components/client-container";
import { ChangeBadgeVariantInput } from "@/calendar/components/change-badge-variant-input";
import { ChangeVisibleHoursInput } from "@/calendar/components/change-visible-hours-input";
import { ChangeWorkingHoursInput } from "@/calendar/components/change-working-hours-input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { getEvents, getUsers } from "@/calendar/requests";
import { BookingPage } from "@/booking/booking-page";
import { AUDIENCE, HAS_CUSTOMER_PORTAL } from "@/prompify-settings";

import type { IEvent, IUser } from "@/calendar/interfaces";

/** Calendar layout: loads staff and appointments, then shows the selected view and the calendar settings. */
function CalendarLayout({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<{ events: IEvent[]; users: IUser[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getEvents(), getUsers()])
      .then(([events, users]) => setData({ events, users }))
      .catch(e => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  if (error) {
    return <p className="mx-auto max-w-screen-2xl px-8 py-4 text-sm text-destructive">Could not load the calendar: {error}</p>;
  }

  if (!data) {
    return (
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-8 py-4">
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <CalendarProvider users={data.users} events={data.events}>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-8 py-4">
        {children}

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="flex-none gap-2 py-0 hover:no-underline">
              <div className="flex items-center gap-2">
                <Settings className="size-4" />
                <p className="text-base font-semibold">Calendar settings</p>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="mt-4 flex flex-col gap-6">
                <ChangeBadgeVariantInput />
                <ChangeVisibleHoursInput />
                <ChangeWorkingHoursInput />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </CalendarProvider>
  );
}

/** The staff app: header, calendar views and settings. */
function StaffApp() {
  return (
    <>
      <Header />
      <CalendarLayout>
        <Routes>
          <Route path="/day-view" element={<ClientContainer view="day" />} />
          <Route path="/week-view" element={<ClientContainer view="week" />} />
          <Route path="/month-view" element={<ClientContainer view="month" />} />
          <Route path="/year-view" element={<ClientContainer view="year" />} />
          <Route path="/agenda-view" element={<ClientContainer view="agenda" />} />
          <Route path="*" element={<Navigate to="/month-view" replace />} />
        </Routes>
      </CalendarLayout>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public booking page, when "Who uses it?" includes customers (src/prompify-settings.ts). */}
      {HAS_CUSTOMER_PORTAL && <Route path="/book" element={<BookingPage />} />}
      {AUDIENCE === "customers" && <Route path="/" element={<Navigate to="/book" replace />} />}
      <Route path="*" element={<StaffApp />} />
    </Routes>
  );
}
