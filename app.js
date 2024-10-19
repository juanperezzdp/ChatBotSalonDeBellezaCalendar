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
      "https://scontent-bog2-2.xx.fbcdn.net/v/t39.30808-6/463206425_8488342821213872_7485064648436879787_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGrkA4r1IrCHjGOS1SkAz_mOuecFBThr-g655wUFOGv6MBz8JBdylMGFRGdwwaa469gwkTzPp1WHrzcXCFe3gpX&_nc_ohc=aEAmTagMW7QQ7kNvgGpjM4E&_nc_zt=23&_nc_ht=scontent-bog2-2.xx&_nc_gid=A75y3Ayp35xuOb7h1uDqG3C&oh=00_AYD46-hQADWQllOiP0a4K69MJYCF1fiKctZdl5Y-evZcAg&oe=671613AB",
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
