import { Calendar, Globe } from "lucide-react";
import { Link } from "react-router-dom";

import { ToggleTheme } from "@/components/layout/change-theme";
import { Button } from "@/components/ui/button";
import { HAS_CUSTOMER_PORTAL } from "@/prompify-settings";
import { APP } from "@/config/app";
import { TEXT } from "@/config/text";

/** Staff header: business name and tagline, the booking page link, the light / dark switch. */
export function Header() {
  return (
    <header className="flex h-[88px] w-full items-center justify-center bg-brand-secondary text-brand-secondary-foreground">
      <div className="mx-auto my-3 flex h-14 w-full max-w-screen-2xl items-center justify-between px-8">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-full border border-brand-secondary-foreground/25 p-3">
            <Calendar className="size-6" />
          </div>

          <div className="space-y-1">
            <p className="text-lg font-medium leading-6">{APP.name}</p>
            <p className="text-sm opacity-80">{APP.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {HAS_CUSTOMER_PORTAL && (
            <Button variant="outline" asChild>
              <Link to="/book">
                <Globe />
                {TEXT.header.bookingPage}
              </Link>
            </Button>
          )}
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
