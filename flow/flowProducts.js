const { addKeyword } = require("@bot-whatsapp/bot");

const flowProducts = addKeyword(["productos", "produto"]).addAnswer(
  null,
  {
    media:
      "https://younique-dfiles.s3-us-west-2.amazonaws.com/s3fs-public/Younique_Product_Catalog_2016_09_es_US.pdf",
  },
  async (ctx, ctxFn) => {
    return ctxFn.endFlow(
      "catálogo en PDF de los productos que ofrecemos para ti"
    );
  }
);

module.exports = { flowProducts };
