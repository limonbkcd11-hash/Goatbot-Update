const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { pipeline } = require("stream");
const { promisify } = require("util");

const streamPipeline = promisify(pipeline);

module.exports = {
  config: {
    name: "catpic",
    version: "1.1.2",
    author: "Hrudoy",
    role: 0,
    shortDescription: "Random cat image 😺",
    category: "Image",
    guide: "{pn}",
    cooldown: 5
  },

  onStart: async function ({ api, event }) {
    const cacheDir = path.join(__dirname, "cache");
    const cachePath = path.join(cacheDir, `cat_${Date.now()}.jpg`);

    try {
      await fs.ensureDir(cacheDir);

      // Get cat image URL
      const res = await axios.get(
        "https://api.thecatapi.com/v1/images/search",
        { timeout: 15000 }
      );

      const imgUrl = res?.data?.[0]?.url;
      if (!imgUrl) {
        return api.sendMessage(
          "😿 Cat image load hoilo na...",
          event.threadID,
          event.messageID
        );
      }

      // Download image as stream
      const response = await axios({
        url: imgUrl,
        method: "GET",
        responseType: "stream",
        timeout: 20000
      });

      await streamPipeline(
        response.data,
        fs.createWriteStream(cachePath)
      );

      // Send image
      return api.sendMessage(
        {
          body: "😺 Random Cat Pic!",
          attachment: fs.createReadStream(cachePath)
        },
        event.threadID,
        () => fs.unlink(cachePath).catch(() => {}),
        event.messageID
      );

    } catch (err) {
      console.error("catpic error:", err);
      return api.sendMessage(
        "⚠️ Cat pic fetch failed... abar try koro 😅",
        event.threadID,
        event.messageID
      );
    }
  }
};