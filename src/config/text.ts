/*
 * TEXT — every piece of wording on screen. Change the TERMS to rename things everywhere at once
 * (e.g. appointment → booking, staff member → stylist, client → patient); change a single line
 * below to reword one place. Components never contain their own wording.
 */

const TERMS = {
  appointment: "appointment",
  appointments: "appointments",
  Appointment: "Appointment",
  /** Who an appointment is with (a person or a resource such as a room). */
  staff: "staff member",
  Staff: "Staff member",
  /** Who the appointment is for. */
  client: "client",
  Client: "Client",
};

const t = TERMS;

export const TEXT = {
  header: {
    bookingPage: "Booking page",
    toggleTheme: "Switch light / dark",
  },

  calendar: {
    loadError: (error: string) => `Could not load the calendar: ${error}`,
    viewDay: "View by day",
    viewWeek: "View by week",
    viewMonth: "View by month",
    viewAgenda: "View by agenda",
    add: `Add ${t.Appointment}`,
    count: (n: number) => `${n} ${n === 1 ? t.appointment : t.appointments}`,
    allStaff: "All",
    previous: "Previous",
    next: "Next",
    today: "Today",
    more: (n: number) => `${n} more…`,
    weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    weekViewSmallScreen: "Weekly view is not available on smaller devices.",
    weekViewSwitch: "Please switch to daily or monthly view.",
    happeningNow: "Happening now",
    nothingNow: `No ${t.appointments} at the moment`,
    agendaEmpty: `No ${t.appointments} scheduled for the selected month`,
  },

  /** The add / edit appointment form. */
  form: {
    addTitle: `Add New ${t.Appointment}`,
    addIntro: `Fill in the details and pick the ${t.staff}.`,
    editTitle: `Edit ${t.Appointment}`,
    editIntro: `Change the details of this ${t.appointment}.`,
    staff: t.Staff,
    title: "Title",
    titleHint: "Enter a title",
    clientName: `${t.Client} name`,
    clientEmail: `${t.Client} email`,
    clientPhone: `${t.Client} phone`,
    startDate: "Start Date",
    startTime: "Start Time",
    endDate: "End Date",
    endTime: "End Time",
    dateHint: "Select a date",
    color: "Color",
    chooseHint: "Select an option",
    notes: "Notes",
    cancel: "Cancel",
    create: `Create ${t.Appointment}`,
    save: "Save Changes",
    saving: "Saving…",
    errors: {
      title: "Title is required",
      startDate: "Start date is required",
      startTime: "Start time is required",
      endDate: "End date is required",
      endTime: "End time is required",
      color: "Color is required",
      email: "Enter a valid email address",
      order: "The end must be after the start",
      staff: `Pick a ${t.staff}`,
    },
  },

  details: {
    staff: t.Staff,
    client: t.Client,
    start: "Start",
    end: "End",
    notes: "Notes",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: (title: string) => `Delete "${title}"?`,
    unassigned: "Unassigned",
  },

  booking: {
    title: `Book an ${t.appointment}`,
    intro: "Pick a day and a time that suits you. We will see you then.",
    staffLabel: "With",
    anyStaff: "Anyone available",
    freeTimesOn: (day: string) => `Free times on ${day}`,
    chooseDay: "Choose a day first",
    noFreeTimes: "No free times on this day. Try another day.",
    name: "Your name",
    email: "Email",
    phone: "Phone (optional)",
    notes: "Anything we should know? (optional)",
    submit: "Confirm booking",
    saving: "Booking…",
    done: "You're booked",
    doneDetails: (day: string, time: string, staff?: string) => `${day} at ${time}${staff ? ` with ${staff}` : ""}.`,
    another: "Book another",
    staffArea: "Staff area",
    contact: (email: string) => `Questions? Email us at ${email}`,
    /** Title of an online booking in the staff calendar. */
    eventTitle: (name: string) => name,
    bookedOnline: "Booked online",
  },
};
