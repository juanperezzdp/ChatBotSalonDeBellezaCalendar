const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const flowPDF = addKeyword(EVENTS.ACTION).addAnswer("catalogo", {
  media:
    "https://raw.githubusercontent.com/juanperezzdp/ChatBotSalonDeBellezaCalendar/refs/heads/main/img/catalogo.pdf",
});

const flowProducts = addKeyword(["productos", "producto", "produto"]).addAnswer(
  "✨¡Te presentamos nuestro catálogo de productos!💇‍♀️💅 \nExplora nuestras opciones y encuentra lo que mejor se adapta a ti. \n \nSi tienes alguna pregunta o quieres agendar una cita, no dudes en escribirnos. ¡Estamos aquí para ayudarte!📲💬",
  null,
  async (ctx, ctxFn) => {
    return ctxFn.gotoFlow(flowPDF);
  },
  [flowPDF]
);

module.exports = { flowProducts };
