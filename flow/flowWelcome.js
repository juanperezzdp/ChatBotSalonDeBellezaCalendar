const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { flowCheckDate } = require("./flowScheduleAnAppointment");
const { flowProducts } = require("./flowProducts");
const { flowPrice } = require("./flowPrice");
const { flowAddress } = require("./flowAddress");

const flowWelcome = addKeyword(EVENTS.ACTION).addAnswer(
  "En el salón de belleza Yuli, nos especializamos en brindarte el mejor cuidado para tu cabello y piel. \nAquí podrás encontrar una amplia gama de servicios. \n \nEscribe solamente la palabra del servicio o información que desees: \n1. *🗓️Agendar turno* \n2. *📍Dirección:* \n3. *💅Produtos* \n4. *📝Cotización*",
  { capture: true },
  async (ctx, ctxFn) => {
    if (
      ctx.body.toLowerCase() === "agendar turno" ||
      ctx.body.toLowerCase() === "agendar" ||
      ctx.body.toLowerCase() === "turno"
    ) {
      return ctxFn.gotoFlow(flowCheckDate);
    } else if (
      ctx.body.toLowerCase() === "productos" ||
      ctx.body.toLowerCase() === "producto"
    ) {
      return ctxFn.gotoFlow(flowProducts);
    } else if (
      ctx.body.toLowerCase() === "cotizar" ||
      ctx.body.toLowerCase() === "cotizacion" ||
      ctx.body.toLowerCase() === "cotización"
    ) {
      return ctxFn.gotoFlow(flowPrice);
    } else if (
      ctx.body.toLowerCase() === "direccion" ||
      ctx.body.toLowerCase() === "ubicacion" ||
      ctx.body.toLowerCase() === "direcion"
    ) {
      return ctxFn.gotoFlow(flowAddress);
    } else {
      return setTimeout(() => {
        ctxFn.endFlow();
      }, 2000);
    }
  },
  [flowCheckDate]
);

module.exports = { flowWelcome };
