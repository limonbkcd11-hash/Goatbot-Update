const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "nature",
    version: "1.1.1",
    author: "Hridoy",
    role: 0,
    shortDescription: "Random beautiful nature photo 🌿",
    category: "Image",
    guide: "{pn}",
    cooldown: 5
  },

  onStart: async function ({ api, event }) {
    const cachePath = path.join(__dirname, "cache", `nature_${Date.now()}.jpg`);

    try {
      const API_KEY = "YOUR_PEXELS_API_KEY";

      const res = await axios.get(
        "https://api.pexels.com/v1/search?query=nature&per_page=15",
        {
          headers: { Authorization: API_KEY }
        }
      );

      const photos = res.data?.photos;
      if (!photos || photos.length === 0) {
        return api.sendMessage(
          "⚠️ No nature photos found! Try again later.",
          event.threadID,
          event.messageID
        );
      }

      const photo = photos[Math.floor(Math.random() * photos.length)];

      // safer image size (avoid huge file issue)
      const photoUrl = photo.src.large2x || photo.src.large || photo.src.original;

      await fs.ensureDir(path.dirname(cachePath));

      const response = await axios({
        url: photoUrl,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(cachePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: "🌿 Here is a beautiful nature photo!",
            attachment: fs.createReadStream(cachePath)
          },
          event.threadID,
          () => {
            fs.unlink(cachePath).catch(() => {});
          },
          event.messageID
        );
      });

      writer.on("error", (err) => {
        console.error(err);
        api.sendMessage(
          "❌ Image save failed!",
          event.threadID,
          event.messageID
        );
      });

    } catch (err) {
      console.error(err);
      api.sendMessage(
        "⚠️ Something went wrong! Could not fetch nature photo.",
        event.threadID,
        event.messageID
      );
    }
  }
};