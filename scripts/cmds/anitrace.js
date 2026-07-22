const axios = require("axios");

module.exports = {
  config: {
    name: "anitrace",
    version: "1.0",
    role: 0,
    author: "Hridoy",
    description: "Find anime from image",
    category: "Media",
    guide: "Reply to an image"
  },

  onStart: async function ({ message, event }) {
    try {
      // 📌 check reply image
      if (!event.messageReply || !event.messageReply.attachments.length) {
        return message.reply("❌ Please reply to an image!");
      }

      const imgUrl = event.messageReply.attachments[0].url;

      // 📡 API call
      const api = `https://api.trace.moe/search?url=${encodeURIComponent(imgUrl)}`;
      const res = await axios.get(api);

      if (!res.data.result || res.data.result.length === 0) {
        return message.reply("❌ No result found!");
      }

      const data = res.data.result[0];

      const title =
        data.anilist?.title?.english ||
        data.anilist?.title?.romaji ||
        "Unknown";

      const episode = data.episode || "N/A";
      const similarity = (data.similarity * 100).toFixed(2);

      const video = data.video;
      const image = data.image;

      let msg =
        `🎌 Anime Found!\n\n` +
        `📺 Title: ${title}\n` +
        `🎬 Episode: ${episode}\n` +
        `📊 Similarity: ${similarity}%`;

      // 🎥 send preview video যদি থাকে
      if (video) {
        return message.reply({
          body: msg,
          attachment: await global.utils.getStreamFromURL(video)
        });
      }

      // 🖼️ fallback image
      if (image) {
        return message.reply({
          body: msg,
          attachment: await global.utils.getStreamFromURL(image)
        });
      }

      return message.reply(msg);

    } catch (err) {
      console.log(err);
      return message.reply("❌ Error detecting anime!");
    }
  }
};
