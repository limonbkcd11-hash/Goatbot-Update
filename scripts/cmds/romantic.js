const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "romantic",
    version: "2.0.1",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    category: "Media",
    shortDescription: "Random funny video"
  },

  onStart: async function ({ api, event }) {
    const videos = [
      "https://i.imgur.com/yrcQXtY.mp4",
      "https://i.imgur.com/xokwCXu.mp4",
      "https://i.imgur.com/pmrj0at.mp4",
      "https://i.imgur.com/gkrdZsl.mp4",
      "https://i.imgur.com/gpOukFP.mp4",
      "https://i.imgur.com/xyle5CH.mp4",
      "https://i.imgur.com/XEDTTKs.mp4",
      "https://i.imgur.com/3CP2XC0.mp4",
      "https://i.imgur.com/vCQQldS.mp4",
      "https://i.imgur.com/VhgSxIp.mp4",
      "https://i.imgur.com/CqL2dDx.mp4",
      "https://i.imgur.com/X76vuLq.mp4",
      "https://i.imgur.com/kUjmwBR.mp4",
      "https://i.imgur.com/OiWZmRd.mp4",
      "https://i.imgur.com/qrf6a7Z.mp4"
    ];

    const video =
      videos[Math.floor(Math.random() * videos.length)];

    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, "funny.mp4");

    try {
      await fs.ensureDir(cacheDir);

      const response = await axios({
        method: "GET",
        url: video,
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      fs.writeFileSync(filePath, Buffer.from(response.data));

      await api.sendMessage(
        {
          body: " Here's Your romantic Video 👀",
          attachment: fs.createReadStream(filePath)
        },
        event.threadID
      );

      fs.unlinkSync(filePath);
    } catch (e) {
      console.log(e);
      api.sendMessage(
        `❌ Error:\n${e.message}`,
        event.threadID
      );
    }
  }
};