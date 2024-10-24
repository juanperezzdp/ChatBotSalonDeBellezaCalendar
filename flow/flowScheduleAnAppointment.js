const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { iso2text, text2iso } = require("../script/utils");
const {
  isDateAvailable,
  getNextAvailableSlot,
  createEvent,
} = require("../script/calendar");

const { chat } = require("../script/chatgpt");

const promtBase = `Eres un asistente virtual diseñado para ayudar a los usuarios a agendar citas mediante una conversación.
Tu único objetivo es ayudar al usuario a elegir una fecha y un horario para reservar una cita, quiero que revise muy bien si la fecha que esta resiviendo esta disponible pero sino no lo esta solo dale la siguiente opcion.
Te proporcionaré la fecha solicitada por el usuario y la disponibilidad de la misma, la cual debe ser confirmada por el usuario.
Si la disponibilidad es true, responde de la siguiente manera:
La fecha solicitada está disponible. El turno sería el jueves 30 de mayo de 2024 a las 10:00 am.
Si la disponibilidad es false, responde de esta forma:
La fecha y horario solicitados no están disponibles. Te puedo ofrecer el jueves 30 de mayo de 2024 a las 11:00 am.
Bajo ninguna circunstancia debes realizar consultas adicionales a la fecha que estas resiviendo.
En caso de que la disponibilidad sea false, no indiques directamente que no hay disponibilidad. En lugar de eso, envía una disculpa por la indisponibilidad de la fecha y ofrece la siguiente opción.`;

const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

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

const flowFormName = addKeyword("si").addAnswer(
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

const flowConfir = addKeyword(["si", "no"]).addAnswer(
  "¿Confirmas esta fecha y hora? \n \nResponde solamente con las siguientes optiones: \n1. *Sí* \n2. *Quiero otra diferente* \n3. *No quiero agendar*",
  { capture: true },
  (ctx, ctxFn) => {
    const answer = ctx.body.toLowerCase();

    if (answer === "si") {
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

const flowConfirmarFecha = addKeyword("si").addAnswer(
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
        promtBase +
          `\nHoy es el día: ${currentDate.toISOString().split("T")[0]}` +
          `\nLa fecha solicitada es: ${solicitedDate}` +
          `\nLa disponibilidad de esa fecha esta ocupada. 
          \nEl próximo espacio disponible posible que te ofrecemos es: ${dateText}. 
          \nDa la fecha en español.`,
        messages
      );

      await ctxFn.flowDynamic(response);
      await ctxFn.state.update({ date: nextAvailableSlot.start });
      return ctxFn.gotoFlow(flowConfir);
    }

    if (dateAvailable === true) {
      const messages = [{ role: "user", content: `${ctx.body}` }];
      const response = await chat(
        promtBase +
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
  `Por favor, indícame la fecha y hora que deseas agendar? \n \npor ejemplo: *Lunes 14 de octubre a la 01:00 pm*. \n \nRecuerda que la fecha de hoy es *${formattedDate}*`,
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
