const { addKeyword } = require("@bot-whatsapp/bot");

const flowPrice = addKeyword(["cotizacion", "cotización", "cotizar"]).addAnswer(
  "En la imagen encontrarás todos los servicios que ofrecemos en el salón de belleza Yuli, junto con sus precios💇‍♀️💅 \n \nSi tienes alguna pregunta o quieres agendar una cita, no dudes en escribirnos. ¡Estamos aquí para ayudarte!📲",
  {
    media:
      "https://raw.githubusercontent.com/juanperezzdp/ChatBotSalonDeBellezaCalendar/refs/heads/main/img/cotizar.png",
  }
);

module.exports = { flowPrice };
