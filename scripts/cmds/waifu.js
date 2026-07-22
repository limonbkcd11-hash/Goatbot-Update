const axios = require("axios");

module.exports = {
  config: {
    name: "waifu",
    version: "1.0",
    author: "Hridoy",
    role: 0,
    category: "Image"
  },

  onStart: async function ({ message }) {
    try {
      const res = await axios.get(
        "https://api.waifu.im/images?IncludedTags=waifu&OrderBy=Random"
      );

      const img = res.data.items[0].url;

      return message.reply({
        body: "Heres your Waifu 😘",
        attachment: await global.utils.getStreamFromURL(img)
      });

    } catch (e) {
      console.log(e);
      return message.reply("API error: " + e.message);
    }
  }
};