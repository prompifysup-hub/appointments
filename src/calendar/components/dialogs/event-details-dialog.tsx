import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, Contact, Text, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDeleteEvent } from "@/calendar/hooks/use-delete-event";
import { EditEventDialog } from "@/calendar/components/dialogs/edit-event-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TEXT } from "@/config/text";

import type { IEvent } from "@/calendar/interfaces";

const text = TEXT.details;

interface IProps {
  event: IEvent;
  children: React.ReactNode;
}

/** An appointment's details (staff member, client, start, end, notes) with Edit and Delete. */
export function EventDetailsDialog({ event, children }: IProps) {
  const { removeEvent } = useDeleteEvent();
  const [open, setOpen] = useState(false);
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const client = [event.clientName, event.clientEmail, event.clientPhone].filter(Boolean).join(" · ");

  const rows: { icon: typeof User; label: string; value: string }[] = [
    { icon: User, label: text.staff, value: event.user.name || text.unassigned },
    ...(client ? [{ icon: Contact, label: text.client, value: client }] : []),
    { icon: Calendar, label: text.start, value: format(startDate, "MMM d, yyyy h:mm a") },
    { icon: Clock, label: text.end, value: format(endDate, "MMM d, yyyy h:mm a") },
    ...(event.description ? [{ icon: Text, label: text.notes, value: event.description }] : []),
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {rows.map(row => (
            <div key={row.label} className="flex items-start gap-2">
              <row.icon className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{row.label}</p>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              if (!confirm(text.confirmDelete(event.title))) return;
              await removeEvent(event.id);
              setOpen(false);
            }}
          >
            {text.delete}
          </Button>

          <EditEventDialog event={event}>
            <Button type="button" variant="outline">
              {text.edit}
            </Button>
          </EditEventDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
