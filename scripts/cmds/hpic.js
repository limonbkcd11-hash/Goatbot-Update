const axios = require("axios");

module.exports = {
  config: {
    name: "hpic",
    version: "1.0.0",
    author: "Hridoy",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Random Ero / Hot Picture"
    },
    longDescription: {
      en: "Send random NSFW ero (sexy/hentai) image from waifu.im"
    },
    category: "NSFW",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    try {
      const apiUrl = "https://api.waifu.im/images?IncludedTags=ero&IsNsfw=True&PageSize=1";

      const res = await axios.get(apiUrl);

      if (!res.data?.items?.length) {
        return message.reply("❌ No image found.");
      }

      const imageUrl = res.data.items[0].url;

      return message.reply({
        body: "🔥 Random Hot Pic",
        attachment: await global.utils.getStreamFromURL(imageUrl)
      });

    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to fetch image.");
    }
  }
};