import { z } from "zod";

import { TEXT } from "@/config/text";

const e = TEXT.form.errors;

/** Validation for the add / edit appointment form. Notes and client details are optional. */
export const eventSchema = z
  .object({
    user: z.string({ required_error: e.staff }).min(1, e.staff),
    title: z.string().min(1, e.title),
    clientName: z.string(),
    clientEmail: z.string().refine(v => !v || /^\S+@\S+\.\S+$/.test(v), e.email),
    clientPhone: z.string(),
    description: z.string(),
    startDate: z.date({ required_error: e.startDate }),
    startTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: e.startTime }),
    endDate: z.date({ required_error: e.endDate }),
    endTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: e.endTime }),
    color: z.enum(["blue", "green", "red", "yellow", "purple", "orange", "gray"], { required_error: e.color }),
  })
  .refine(
    data => {
      const start = new Date(data.startDate);
      start.setHours(data.startTime.hour, data.startTime.minute, 0, 0);
      const end = new Date(data.endDate);
      end.setHours(data.endTime.hour, data.endTime.minute, 0, 0);
      return start < end;
    },
    { message: e.order, path: ["endTime"] }
  );

export type TEventFormData = z.infer<typeof eventSchema>;
