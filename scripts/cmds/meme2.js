const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "meme2",
    version: "1.2.0",
    author: "Hridoy",
    role: 0,
    shortDescription: "Random meme 😆",
    category: "Image",
    guide: "{pn}",
    countDown: 5
  },

  onStart: async function ({ api, event }) {
    try {
      const res = await axios.get("https://meme-api.com/gimme");

      if (!res.data?.url)
        return api.sendMessage(
          "😅 Meme load hoilo na... abar try koro!",
          event.threadID,
          event.messageID
        );

      const memeUrl = res.data.url;
      const title = res.data.title || "Meme";
      const subreddit = res.data.subreddit || "Unknown";

      const ext = path.extname(memeUrl.split("?")[0]) || ".jpg";

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const filePath = path.join(
        cacheDir,
        `meme_${Date.now()}${ext}`
      );

      const response = await axios({
        method: "GET",
        url: memeUrl,
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, response.data);

      api.sendMessage(
        {
          body: `😂 ${title}\n📌 Subreddit: r/${subreddit}`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(filePath))
            fs.unlinkSync(filePath);
        },
        event.messageID
      );

    } catch (err) {
      console.error("MEME ERROR:", err.message);

      api.sendMessage(
        "⚠️ Meme fetch korte pari nai... abar try koro 😅",
        event.threadID,
        event.messageID
      );
    }
  }
};