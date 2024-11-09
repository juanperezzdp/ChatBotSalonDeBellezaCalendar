const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { iso2text, text2iso } = require("../script/utils");
const {
  isDateAvailable,
  getNextAvailableSlot,
  createEvent,
} = require("../script/calendar");

const { chat } = require("../script/chatgpt");

const currenDate = new Date();
const formattedDate = currenDate.toLocaleDateString("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const formattedTime = currenDate.toLocaleTimeString("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const fullFormattedDate = `${formattedDate} ${formattedTime}`;

const promptBase = `Eres un asistente virtual especializado en agendar citas en un horario laboral de lunes a sábado, de 7:00 am a 6:00 pm y los domingo esta cerrado.
Tu objetivo es ayudar al usuario a reservar un turno en el horario disponible y adecuado. Te proporcionaré la fecha y disponibilidad solicitadas, y debes confirmarlas con el usuario. Sigue estas reglas:

1. **Disponibilidad dentro del horario permitido**:
   - Si el horario está disponible (true) y dentro del horario laboral, responde:
     - "La fecha solicitada está disponible. El turno sería el [día] [fecha] a las [hora]."
   - Si el horario solicitado no está disponible (false) o está fuera del horario laboral, responde:
     - "La fecha y hora solicitada no están disponibles. Te puedo ofrecer el [día] [fecha] a las [hora disponible dentro del horario]."
   - Si la fecha y hora solicitadas ya pasaron según la fecha y hora actual (${fullFormattedDate}), revisa con google calendar si hay una hay hora dispoble para hoy que sea la mas proxima a la hora actual
    responde:
     - "La fecha y hora solicitadas ya han pasado. La fecha y hora actual es *${fullFormattedDate}*. Por favor, intenta nuevamente."
   - Si la fecha y hora solicitadas es algon como quiero un turno para hoy, quiero para hoy un turno, hoy.
    responde:
     - "La fecha y hora dispoble seria para hoy del turno el [día] [fecha] a las [hora] "

2. **Reglas adicionales**:
   - Si Google Calendar indica disponibilidad pero la fecha ya ha pasado, ofrece una nueva fecha y hora próximas disponibles dentro del horario permitido.
   - Solo ofrece horarios entre 7:00 am y 6:00 pm.
   - No permitas agendar citas para fechas u horas pasadas.
   - Solo programa citas de lunes a sábado. Si es domingo, informa que no hay disponibilidad sin sugerir otra fecha.

3. **Manejo de disponibilidad**:
   - Si la disponibilidad es (false), pide disculpas y sugiere una nueva opción disponible dentro del horario permitido.

**Nota**: 
No hagas preguntas adicionales ni solicites información que no esté en los datos proporcionados.`;

const flowCreate = addKeyword(EVENTS.ACTION).addAnswer(
  "Por favor, espera un momento mientras guardamos tu turno.📝",
  null,
  async (ctx, ctxFn) => {
    const userInfo = await ctxFn.state.getMyState();
    const eventName = userInfo.name;
    const description = userInfo.motive;
    const date = userInfo.date;
    const eventId = await createEvent(eventName, description, date);
    console.log("Evento creado con ID: " + date);
    await ctxFn.state.clear();
    return ctxFn.endFlow("¡Tu turno ha sido agendada exitosamente!😊💅");
  }
);

const flowFormMotive = addKeyword(EVENTS.ACTION).addAnswer(
  "Perfecto!👌 \n*Cual es el motivo del turno?*",
  { capture: true },
  async (ctx, ctxFn) => {
    if (ctx.body && ctx.body.trim()) {
      await ctxFn.state.update({ motive: ctx.body });
      return ctxFn.gotoFlow(flowCreate);
    }
  },
  [flowCreate]
);

const flowFormName = addKeyword(["si", "sí"]).addAnswer(
  "Excelente! Gracias por confimar la fecha.😉 \n \nTe voy a hacer unas consultas para agendar tu turno. \n*Primero dime cuál es tu nombre?*",
  { capture: true },
  async (ctx, ctxFn) => {
    if (ctx.body && ctx.body.trim()) {
      console.log("Nombre capturado:", ctx.body);
      await ctxFn.state.update({ name: ctx.body });
      return ctxFn.gotoFlow(flowFormMotive);
    }
  },
  [flowFormMotive]
);

const flowCancel = addKeyword("no quiero agendar").addAnswer(
  "Entendido, se ha cancelado el proceso."
);

const flowConfir = addKeyword(["si", "sí", "no"]).addAnswer(
  "¿Confirmas esta fecha y hora? \n \nResponde solamente con las siguientes optiones: \n1. *Sí* \n2. *Quiero otra diferente* \n3. *No quiero agendar*",
  { capture: true },
  (ctx, ctxFn) => {
    const answer = ctx.body.toLowerCase();

    if (answer === "si" || answer === "sí") {
      return ctxFn.gotoFlow(flowFormName);
    }

    if (answer === "quiero otra diferente") {
      return ctxFn.gotoFlow(flowCheckDate);
    }

    if (answer === "no quiero agendar") {
      return ctxFn.gotoFlow(flowCancel);
    }
  },
  [flowFormName]
);

const flowConfirmarFecha = addKeyword(["si", "sí"]).addAnswer(
  "Revisando disponibilidad...🤔",
  null,
  async (ctx, ctxFn) => {
    const solicitedDate = await text2iso(ctx.body);
    const currentDate = new Date();

    console.log("Esta es la fecha en dateFlow:", solicitedDate);

    if (!solicitedDate || solicitedDate.includes("false")) {
      ctxFn.flowDynamic(
        "No se pudo deducir una fecha. Por favor, vuelve a preguntar."
      );
      return gotoFlow(flowCheckDate);
    }

    const startDate = new Date(solicitedDate);
    console.log("Fecha de inicio: ", startDate);

    let dateAvailable = await isDateAvailable(startDate);
    console.log("¿Fecha disponible?: ", dateAvailable);

    if (dateAvailable === false) {
      const nextAvailableSlot = await getNextAvailableSlot(startDate);
      const isoString = nextAvailableSlot.start.toISOString();
      const dateText = await iso2text(isoString);

      const messages = [{ role: "user", content: `${ctx.body}` }];

      const response = await chat(
        promptBase +
          `\nHoy es el día: ${currentDate.toISOString().split("T")[0]}` +
          `\nLa fecha solicitada es: ${solicitedDate}` +
          `\nLa disponibilidad de esa fecha esta ocupada. 
        \nEl próximo espacio disponible posible que te ofrecemos es: ${dateText}. 
        \nDa la fecha en español.`,
        messages
      );

      await ctxFn.flowDynamic(response);

      if (response.includes("pasado")) {
        console.log("La fecha y horario solicitados ya han pasado:", response);
        return ctxFn.gotoFlow(flowCheckDate);
      }

      await ctxFn.state.update({ date: nextAvailableSlot.start });
      return ctxFn.gotoFlow(flowConfir);
    }

    if (dateAvailable === true) {
      const messages = [{ role: "user", content: `${ctx.body}` }];
      const response = await chat(
        promptBase +
          `\nHoy es el día: ${currentDate.toISOString().split("T")[0]}` +
          `\nLa fecha solicitada es: ${solicitedDate}` +
          `\nLa disponibilidad de esa fecha esta disponible.`,
        messages
      );

      await ctxFn.flowDynamic(response);
      await ctxFn.state.update({ date: startDate });
      return ctxFn.gotoFlow(flowConfir);
    }
  },
  [flowConfir]
);

const flowCheckDate = addKeyword(["agendar cita", "agendar"]).addAnswer(
  `Por favor, indícame la fecha y hora que deseas agendar? \n \npor ejemplo: *Lunes 14 de octubre a la 01:00 pm*. \n \nRecuerda que la fecha de hoy es *${fullFormattedDate}*`,
  { capture: true },
  async (ctx, ctxFn) => {
    console.log("flowCheckDate", ctx.body);
    const solicitedDate = await text2iso(ctx.body);
    console.log("Fecha solicitada: " + solicitedDate);

    if (!solicitedDate || solicitedDate.includes("false")) {
      await ctxFn.flowDynamic(
        "No pude deducir la fecha. Por favor, intenta nuevamente."
      );
      return ctxFn.gotoFlow(flowCheckDate);
    }

    ctxFn.flowDynamic({ solicitedDate });
    ctxFn.gotoFlow(flowConfirmarFecha);
  },
  [flowConfirmarFecha]
);

module.exports = { flowCheckDate };
