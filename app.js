const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

const { flowWelcome } = require("./flow/flowWelcome");

const flowMain = addKeyword(EVENTS.WELCOME).addAnswer(
  "¡Hola! 👋 \n*Bienvenida a salón de belleza Yuli* \nEstamos encantados de que nos contactes.",
  {
    delay: 3000,
    media:
      "https://raw.githubusercontent.com/juanperezzdp/ChatBotSalonDeBellezaCalendar/refs/heads/main/img/bienvenida.png",
  },
  async (ctx, ctxFn) => {
    return ctxFn.gotoFlow(flowWelcome);
  },
  [flowWelcome]
);

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowMain]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
