import { parseISO } from "date-fns";

import { useDisclosure } from "@/hooks/use-disclosure";
import { useUpdateEvent } from "@/calendar/hooks/use-update-event";

import { Dialog, DialogHeader, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EventForm } from "@/calendar/components/dialogs/event-form";
import { TEXT } from "@/config/text";

import type { IEvent } from "@/calendar/interfaces";

interface IProps {
  children: React.ReactNode;
  event: IEvent;
}

/** "Edit": opens the shared form with the appointment's values and saves the changes. */
export function EditEventDialog({ children, event }: IProps) {
  const { updateEvent } = useUpdateEvent();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const start = parseISO(event.startDate);
  const end = parseISO(event.endDate);

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{TEXT.form.editTitle}</DialogTitle>
          <DialogDescription>{TEXT.form.editIntro}</DialogDescription>
        </DialogHeader>
        <EventForm
          defaults={{
            user: event.user.id,
            title: event.title,
            description: event.description,
            clientName: event.clientName,
            clientEmail: event.clientEmail,
            clientPhone: event.clientPhone,
            startDate: start,
            startTime: { hour: start.getHours(), minute: start.getMinutes() },
            endDate: end,
            endTime: { hour: end.getHours(), minute: end.getMinutes() },
            color: event.color,
          }}
          submitLabel={TEXT.form.save}
          onSubmit={async draft => {
            await updateEvent({ ...event, ...draft });
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
