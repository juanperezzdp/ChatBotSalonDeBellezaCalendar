const { addKeyword } = require("@bot-whatsapp/bot");

const flowProducts = addKeyword(["productos", "produto"]).addAnswer(
  "catálogo en PDF",
  {
    media:
      "https://younique-dfiles.s3-us-west-2.amazonaws.com/s3fs-public/Younique_Product_Catalog_2016_09_es_US.pdf",
  },
  async (ctx, ctxFn) => {
    return ctxFn.endFlow("productos");
  }
);

module.exports = { flowProducts };
