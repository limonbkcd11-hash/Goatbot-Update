const axios = require("axios");

module.exports = {
  config: {
    name: "hwaifu",
    version: "1.0.0",
    author: "Hridoy",
    role: 2,
    cooldown: 5,
    description: "Send random waifu image from specific artist",
    category: "NSFW"
  },

  onStart: async function ({ message }) {
    try {
      const url = "https://api.waifu.im/images?IncludedArtists=186&OrderBy=Random&IsNsfw=All";

      const res = await axios.get(url);
      const data = res.data;

      if (!data.items || !data.items.length)
        return message.reply("❌ No waifu found.");

      const image = data.items[0].url;

      return message.reply({
        body: "💖 Here is your waifu!",
        attachment: await global.utils.getStreamFromURL(image)
      });

    } catch (err) {
      console.error(err);
      return message.reply("❌ API error occurred.");
    }
  }
};
