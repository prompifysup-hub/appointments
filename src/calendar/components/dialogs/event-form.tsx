import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCalendar } from "@/calendar/contexts/calendar-context";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TimeInput } from "@/components/ui/time-input";
import { SingleDayPicker } from "@/components/ui/single-day-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormField, FormLabel, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

import { eventSchema } from "@/calendar/schemas";
import { EVENT_COLORS } from "@/config/app";
import { TEXT } from "@/config/text";

import type { TimeValue } from "react-aria-components";
import type { IEvent } from "@/calendar/interfaces";
import type { TEventColor } from "@/calendar/types";
import type { TEventFormData } from "@/calendar/schemas";

const text = TEXT.form;

/** Dot colour of each appointment colour (the per-appointment labels, not the theme). */
const COLOR_DOT: Record<TEventColor, string> = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  red: "bg-red-600",
  yellow: "bg-yellow-600",
  purple: "bg-purple-600",
  orange: "bg-orange-600",
  gray: "bg-neutral-600",
};

/** What the form produces: an appointment without its id. */
export type TEventDraft = Omit<IEvent, "id">;

interface IProps {
  /** Starting values (an existing appointment when editing; a clicked day / time when adding). */
  defaults: Partial<TEventFormData>;
  submitLabel: string;
  /** Saves the appointment; throw to show the error in the form. */
  onSubmit: (draft: TEventDraft) => Promise<void>;
}

const EMPTY: Partial<TEventFormData> = { title: "", description: "", clientName: "", clientEmail: "", clientPhone: "" };

/** The appointment form shared by the add and edit dialogs. Renders its own Cancel / Save footer. */
export function EventForm({ defaults, submitLabel, onSubmit }: IProps) {
  const { users } = useCalendar();
  const [saving, setSaving] = useState(false);
  const form = useForm<TEventFormData>({ resolver: zodResolver(eventSchema), defaultValues: { ...EMPTY, ...defaults } });

  // A new clicked day / time (add dialog) refills the form.
  useEffect(() => {
    form.reset({ ...EMPTY, ...defaults });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaults.startDate?.getTime(), defaults.startTime?.hour, defaults.startTime?.minute]);

  const submit = async (values: TEventFormData) => {
    const user = users.find(u => u.id === values.user);
    if (!user) return form.setError("user", { message: text.errors.staff });

    const start = new Date(values.startDate);
    start.setHours(values.startTime.hour, values.startTime.minute, 0, 0);
    const end = new Date(values.endDate);
    end.setHours(values.endTime.hour, values.endTime.minute, 0, 0);

    setSaving(true);
    try {
      await onSubmit({
        user,
        title: values.title.trim(),
        color: values.color,
        description: values.description.trim(),
        clientName: values.clientName.trim(),
        clientEmail: values.clientEmail.trim(),
        clientPhone: values.clientPhone.trim(),
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
      form.reset({ ...EMPTY, ...defaults });
    } catch (error) {
      form.setError("title", { message: error instanceof Error ? error.message : String(error) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form id="event-form" onSubmit={form.handleSubmit(submit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="user"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{text.staff}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger data-invalid={fieldState.invalid}>
                    <SelectValue placeholder={text.chooseHint} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id} className="flex-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarImage src={user.picturePath ?? undefined} alt={user.name} />
                            <AvatarFallback className="text-xxs">{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <p className="truncate">{user.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="title">{text.title}</FormLabel>
              <FormControl>
                <Input id="title" placeholder={text.titleHint} data-invalid={fieldState.invalid} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              ["clientName", text.clientName, "text"],
              ["clientEmail", text.clientEmail, "email"],
              ["clientPhone", text.clientPhone, "tel"],
            ] as const
          ).map(([name, label, type]) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor={name}>{label}</FormLabel>
                  <FormControl>
                    <Input id={name} type={type} data-invalid={fieldState.invalid} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {(
          [
            ["startDate", "startTime", text.startDate, text.startTime],
            ["endDate", "endTime", text.endDate, text.endTime],
          ] as const
        ).map(([dateName, timeName, dateLabel, timeLabel]) => (
          <div key={dateName} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name={dateName}
              render={({ field, fieldState }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor={dateName}>{dateLabel}</FormLabel>
                  <FormControl>
                    <SingleDayPicker
                      id={dateName}
                      value={field.value}
                      onSelect={date => field.onChange(date as Date)}
                      placeholder={text.dateHint}
                      data-invalid={fieldState.invalid}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={timeName}
              render={({ field, fieldState }) => (
                <FormItem className="flex-1">
                  <FormLabel>{timeLabel}</FormLabel>
                  <FormControl>
                    <TimeInput value={field.value as TimeValue} onChange={field.onChange} hourCycle={12} data-invalid={fieldState.invalid} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <FormField
          control={form.control}
          name="color"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{text.color}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger data-invalid={fieldState.invalid}>
                    <SelectValue placeholder={text.chooseHint} />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_COLORS.map(c => (
                      <SelectItem key={c.value} value={c.value}>
                        <div className="flex items-center gap-2">
                          <div className={`size-3.5 rounded-full ${COLOR_DOT[c.value]}`} />
                          {c.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{text.notes}</FormLabel>
              <FormControl>
                <Textarea {...field} data-invalid={fieldState.invalid} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            {text.cancel}
          </Button>
        </DialogClose>
        <Button form="event-form" type="submit" disabled={saving}>
          {saving ? text.saving : submitLabel}
        </Button>
      </DialogFooter>
    </Form>
  );
}
