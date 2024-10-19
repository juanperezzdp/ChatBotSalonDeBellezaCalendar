const { addKeyword } = require("@bot-whatsapp/bot");

const flowPrice = addKeyword(["cotizacion", "cotización", "cotizar"]).addAnswer(
  "En la imagen encontrarás todos los servicios que ofrecemos en el salón de belleza Yuli, junto con sus precios💇‍♀️💅 \n \nSi tienes alguna pregunta o quieres agendar una cita, no dudes en escribirnos. ¡Estamos aquí para ayudarte!📲",
  {
    media:
      "https://scontent-bog2-1.xx.fbcdn.net/v/t39.30808-6/463534695_8488274191220735_3217294649378817230_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHStNW7fnY58sLwuWIUapLbJL_cRt6HgUckv9xG3oeBR1ZZaGLwXEO2xNEU-K3qYqTFjT-SPyT12hZMJcs0kjIJ&_nc_ohc=ATMN1GlJcwoQ7kNvgFKDsDM&_nc_zt=23&_nc_ht=scontent-bog2-1.xx&_nc_gid=AKW67zRKl8ZUZnYJ1og-0kQ&oh=00_AYBqKrop6yt3hG4mHDQlwTRJDwV1BhcY2jzAAGXWjvzWGw&oe=67161DF8",
  }
);

module.exports = { flowPrice };
