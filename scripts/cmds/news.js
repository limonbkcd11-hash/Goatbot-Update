const axios = require("axios");

module.exports = {
  config: {
    name: "news",
    aliases: ["headline"],
    version: "3.0",
    role: 0,
    author: "Hridoy",
    description: "Get latest news (GNews API)",
    category: "Utility",
    guide: "{pn} [topic]"
  },

  onStart: async function ({ message, args }) {
    try {
      const API_KEY = "bea58024be648aa6b2c4fd9bf62ff7ba"; // এখানে key বসাও

      let topic = args.join(" ") || "technology";

      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=en&max=10&token=${API_KEY}`;

      const res = await axios.get(url);

      if (!res.data.articles.length) {
        return message.reply("❌ No news found!");
      }

      const news = res.data.articles[Math.floor(Math.random() * res.data.articles.length)];

      let msg =
        `📰 ${news.title}\n\n` +
        `${news.description || "No description"}\n\n` +
        `🌐 Source: ${news.source.name}\n` +
        `🔗 ${news.url}`;

      // image safe send
      if (news.image) {
        return message.reply({
          body: msg,
          attachment: await global.utils.getStreamFromURL(news.image)
        });
      } else {
        return message.reply(msg);
      }

    } catch (err) {
      console.log(err);
      return message.reply("❌ API error! Check API key or try again.");
    }
  }
};
