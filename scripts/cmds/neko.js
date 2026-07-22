const axios = require("axios");

module.exports = {
  config: {
    name: "neko",
    version: "1.0.0",
    author: "Hridoy",
    role: 0,
    shortDescription: "Send random neko image 🐱",
    category: "Image",
    guide: "{pn}",
    cooldown: 5
  },

  onStart: async function ({ api, event }) {
    try {
      const res = await axios.get("https://nekos.life/api/v2/img/neko");

      const imageUrl = res.data.url; // 🔥 main fix

      if (!imageUrl) {
        return api.sendMessage(
          "❌ Neko image not found!",
          event.threadID,
          event.messageID
        );
      }

      return api.sendMessage(
        {
          body: "🐱 Here is your neko!",
          attachment: await global.utils.getStreamFromURL(imageUrl)
        },
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.error(err);
      api.sendMessage(
        "⚠️ Error fetching neko image!",
        event.threadID,
        event.messageID
      );
    }
  }
};