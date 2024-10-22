const { addKeyword } = require("@bot-whatsapp/bot");

const flowProducts = addKeyword(["productos", "producto", "produto"]).addAnswer(
  "✨¡Te presentamos nuestro catálogo de productos!💇‍♀️💅 \nExplora nuestras opciones y encuentra lo que mejor se adapta a ti. \n \n*Link del catalogo:*  https://www.canva.com/design/DAGUQMZmVfY/5C-i-ycv2dqit_0swza3qg/view?utm_content=DAGUQMZmVfY&utm_campaign=designshare&utm_medium=link&utm_source=editor#4 \n \nSi tienes alguna pregunta o quieres agendar una cita, no dudes en escribirnos. ¡Estamos aquí para ayudarte!📲💬"
);

module.exports = { flowProducts };
