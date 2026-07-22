const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "funny",
    version: "2.0.1",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    category: "Media",
    shortDescription: "Random funny video"
  },

  onStart: async function ({ api, event }) {
    const videos = [
      "https://i.imgur.com/H2NVMnh.mp4",
      "https://i.imgur.com/NymDz1h.mp4",
      "https://i.imgur.com/5rzJoYl.mp4",
      "https://i.imgur.com/CNl2A49.mp4",
      "https://i.imgur.com/zL1euog.mp4",
      "https://i.imgur.com/jNUF29F.mp4",
      "https://i.imgur.com/F3DigYq.mp4",
      "https://i.imgur.com/P08i544.mp4",
      "https://i.imgur.com/GnkEkmc.mp4",
      "https://i.imgur.com/TXxF7LV.mp4",
      "https://i.imgur.com/4XO5LpP.mp4",
      "https://i.imgur.com/5lanr2B.mp4",
      "https://i.imgur.com/CFa8duC.mp4",
      "https://i.imgur.com/p5P26WQ.mp4",
      "https://i.imgur.com/mwGA9tT.mp4"
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
          body: "😂 Here's Your Funny Video!",
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