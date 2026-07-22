const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { pipeline } = require("stream");
const { promisify } = require("util");

const streamPipeline = promisify(pipeline);

module.exports = {
  config: {
    name: "dogpic",
    version: "1.1.1",
    author: "Hridoy",
    role: 0,
    shortDescription: "Random dog image 🐶",
    category: "Image",
    guide: "{pn}",
    cooldown: 5
  },

  onStart: async function ({ api, event }) {
    const cacheDir = path.join(__dirname, "cache");
    const cachePath = path.join(cacheDir, `dog_${Date.now()}.jpg`);

    try {
      await fs.ensureDir(cacheDir);

      // Get dog image URL
      const res = await axios.get(
        "https://dog.ceo/api/breeds/image/random",
        { timeout: 15000 }
      );

      const imgUrl = res?.data?.message;
      if (!imgUrl || res?.data?.status !== "success") {
        return api.sendMessage(
          "🐕 Dog pic load hoilo na... abar try koro!",
          event.threadID,
          event.messageID
        );
      }

      // Download image safely
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

      return api.sendMessage(
        {
          body: "🐶 Random Dog Pic!",
          attachment: fs.createReadStream(cachePath)
        },
        event.threadID,
        () => fs.unlink(cachePath).catch(() => {}),
        event.messageID
      );

    } catch (err) {
      console.error("dogpic error:", err);
      return api.sendMessage(
        "⚠️ Dog pic fetch failed... abar try koro 😅",
        event.threadID,
        event.messageID
      );
    }
  }
};