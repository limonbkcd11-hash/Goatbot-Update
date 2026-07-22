const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "sad",
    version: "2.0.1",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    category: "Media",
    shortDescription: "Random funny video"
  },

  onStart: async function ({ api, event }) {
    const videos = [
      "https://i.imgur.com/6ktvnqN.mp4",
      "https://i.imgur.com/0Jrsr2e.mp4",
      "https://i.imgur.com/Doa1TpO.mp4",
      "https://i.imgur.com/8l9BxTR.mp4",
      "https://i.imgur.com/MjTC15R.mp4",
      "https://i.imgur.com/kf7mzNU.mp4",
      "https://i.imgur.com/xpnTQrr.mp4",
      "https://i.imgur.com/xglXpx1.mp4",
      "https://i.imgur.com/sZov8lr.mp4",
      "https://i.imgur.com/74VNRIp.mp4",
      "https://i.imgur.com/8NyChz7.mp4",
      "https://i.imgur.com/THAGbvB.mp4",
      "https://i.imgur.com/87rzUP1.mp4",
      "https://i.imgur.com/eye1gDi.mp4",
      "https://i.imgur.com/6ktvnqN.mp4"
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
          body: " Here's Your Sad  Video!",
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