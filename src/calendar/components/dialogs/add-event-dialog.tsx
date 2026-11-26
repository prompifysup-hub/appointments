import { useDisclosure } from "@/hooks/use-disclosure";
import { useAddEvent } from "@/calendar/hooks/use-add-event";

import { Dialog, DialogHeader, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EventForm } from "@/calendar/components/dialogs/event-form";
import { TEXT } from "@/config/text";

interface IProps {
  children: React.ReactNode;
  /** Prefilled when opened from a day or a time slot in the calendar. */
  startDate?: Date;
  startTime?: { hour: number; minute: number };
}

/** "Add appointment": opens the shared form empty (or with the clicked day / time) and saves a new appointment. */
export function AddEventDialog({ children, startDate, startTime }: IProps) {
  const { addEvent } = useAddEvent();
  const { isOpen, onClose, onToggle } = useDisclosure();

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{TEXT.form.addTitle}</DialogTitle>
          <DialogDescription>{TEXT.form.addIntro}</DialogDescription>
        </DialogHeader>
        <EventForm
          defaults={{ startDate, startTime }}
          submitLabel={TEXT.form.create}
          onSubmit={async draft => {
            await addEvent(draft);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
