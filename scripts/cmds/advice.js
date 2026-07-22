const axios = require("axios");
module.exports = {
  config: {
    name: "advice",
    version: "1.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Random advice" },
    longDescription: { en: "Get a random piece of advice" },
    category: "AI",
    guide: { en: ".advice" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://api.adviceslip.com/advice");
      const advice = res.data.slip.advice;
      message.reply(`Advice From Kakashi:\n"${advice}"`);
    } catch {
      message.reply("Advice From Kakashi: -");
    }
  }
};
