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
    <header className="mx-auto flex h-[88px] w-full max-w-screen-2xl items-center justify-center">
      <div className="my-3 flex h-14 w-full items-center justify-between px-8">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-full border p-3">
            <Calendar className="size-6 text-foreground" />
          </div>

          <div className="space-y-1">
            <p className="text-lg font-medium leading-6">{APP.name}</p>
            <p className="text-sm text-foreground">{APP.tagline}</p>
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
