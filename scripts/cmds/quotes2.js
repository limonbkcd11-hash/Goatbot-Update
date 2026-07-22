const axios = require("axios");
module.exports = {
  config: {
    name: "quotes2",
    version: "1.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Random Kanye West quote" },
    longDescription: { en: "Get a random Kanye West quote" },
    category: "AI",
    guide: { en: ".quotes2" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.get("https://api.kanye.rest");
      const quote = res.data.quote;
      message.reply(`Quotes From Kakashi:\n"${quote}"`);
    } catch {
      message.reply("Call Kakashi For help .");
    }
  }
};
