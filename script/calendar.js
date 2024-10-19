const { google } = require("googleapis");
const { serviceAccount } = require("../google");

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3" });

const calendarID =
  "75cdaa2cf2e561423fbd806db1126668ec0943e9d172383bafb48e4f2eae2c5e@group.calendar.google.com";

const timeZone = "America/Bogota";

const rangeLimit = {
  days: [1, 2, 3, 4, 5, 6],
  startHour: 7,
  endHour: 18,
};
const standardDuration = 1;
const dateLimit = 30;

async function createEvent(
  eventName,
  description,
  date,
  duration = standardDuration
) {
  try {
    const authClient = await auth.getClient();

    google.options({ auth: authClient });

    const startDateTime = new Date(date);

    const endDateTime = new Date(startDateTime);

    endDateTime.setHours(startDateTime.getHours() + duration);

    const event = {
      summary: eventName,
      description: description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: timeZone,
      },
      colorId: "2",
    };

    const response = await calendar.events.insert({
      calendarId: calendarID,
      resource: event,
    });

    const eventId = response.data.id;
    console.log("se a guardado en calendar");
    return eventId;
  } catch (error) {
    console.log(error);
  }
}

async function listAvailableSlots(startDate = new Date(), endDate) {
  try {
    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    if (!endDate) {
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + dateLimit);
    }

    const response = await calendar.events.list({
      calendarId: calendarID,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      timeZone: timeZone,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    const slots = [];
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const dayOfWeek = currentDate.getDay();

      if (rangeLimit.days.includes(dayOfWeek)) {
        for (
          let hour = rangeLimit.startHour;
          hour < rangeLimit.endHour;
          hour++
        ) {
          const slotStart = new Date(currentDate);
          slotStart.setHours(hour, 0, 0, 0);
          const slotEnd = new Date(slotStart);
          slotEnd.setHours(hour + standardDuration);

          const isBusy = events.some((event) => {
            const eventStart = new Date(
              event.start.dateTime || event.start.date
            );
            const eventEnd = new Date(event.end.dateTime || event.end.date);
            return slotStart < eventEnd && slotEnd > eventStart;
          });

          if (!isBusy) {
            slots.push({
              start: slotStart,
              end: slotEnd,
            });
          }
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  } catch (error) {
    console.log(error);
  }
}
async function getNextAvailableSlot(date) {
  try {
    if (typeof date === "string") {
      date = new Date(date);
    } else if (!(date instanceof Date) || isNaN(date)) {
      throw new Error("La fecha proporcionada no es válida.");
    }

    const availableSlots = await listAvailableSlots(date);

    const filteredSlots = availableSlots.filter(
      (slot) => new Date(slot.start) > date
    );

    const sortedSlots = filteredSlots.sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );
    return sortedSlots.length > 0 ? sortedSlots[0] : null;
  } catch (error) {
    console.log(error);
  }
}

async function isDateAvailable(date) {
  try {
    const currentDate = new Date();
    const maxDate = new Date(currentDate);
    maxDate.setDate(currentDate.getDate() + dateLimit);

    if (date < currentDate || date > maxDate) {
      return false;
    }

    const dayOfweek = date.getDay();
    if (!rangeLimit.days.includes(dayOfweek)) {
      return false;
    }

    const hour = date.getHours();
    if (hour < rangeLimit.startHour || hour >= rangeLimit.endHour) {
      return false;
    }

    const availableSlots = await listAvailableSlots(currentDate);

    const slotsOnGivenDate = availableSlots.filter(
      (slot) => new Date(slot.start).toDateString() === date.toDateString()
    );

    const isSlotAvailable = slotsOnGivenDate.some(
      (slot) =>
        new Date(slot.start).getTime() === date.getTime() &&
        new Date(slot.end).getTime() ===
          date.getTime() + standardDuration * 60 * 60 * 1000
    );

    return isSlotAvailable;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createEvent, isDateAvailable, getNextAvailableSlot };
