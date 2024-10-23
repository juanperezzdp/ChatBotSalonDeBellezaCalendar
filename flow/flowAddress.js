const { addKeyword } = require("@bot-whatsapp/bot");

const flowAddress = addKeyword(["direccion", "ubicacion"]).addAnswer(
  "✨¡Te esperamos en nuestro salón de belleza para que vivas una experiencia única de relajación y estilo!✨ \n \n🏙️ *Ciudad:* Barquisimeto - Lara   \n📍 *Dirección:* [Calle 22, avenida 4. Local: 567] \n \n🕒 *Horario:* \n*Lunes a Sábados:* 7:00AM-6:00PM \n*Domingos:* Cerrado \n \n¡Ven y déjanos consentirte con los mejores tratamientos y servicios! 💅💆‍♀️",
  {
    media: "https://i.imgur.com/mDBDdcL.mp4",
  }
);

module.exports = { flowAddress };
