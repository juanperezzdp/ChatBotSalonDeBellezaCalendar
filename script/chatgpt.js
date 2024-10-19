const OpenAI = require("openai");

require("dotenv").config();
const openaiApiKey = process.env.OPENAI_API_KEY;

console.log("OpenAI API Key:", openaiApiKey);

const chat = async (prompt, messages) => {
  try {
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }, ...messages],
    });

    const answ = completion.choices[0].message.content;
    return answ;
  } catch (err) {
    console.error("Error al conectar con OpenAI:", err);
    return "ERROR en GPT";
  }
};

module.exports = { chat };
