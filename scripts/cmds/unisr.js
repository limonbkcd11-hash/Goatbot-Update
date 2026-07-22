const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "unisr",
    aliases: ["univideo", "ur"],
    version: "1.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    description: "Search random TikTok video by keyword",
    category: "Media",
    guide: "{pn} <keyword>\nExample: {pn} naruto"
  },

  langs: {
    en: {
      noInput: "⚠️ Give a keyword!\nExample: {pn} naruto",
      tooLarge: "❌ Video is too large (25MB+). Try another!",
      success: "🎬 Here is your bideo\n🔍 Search: %1",
      error: "❌ Error: %1"
    }
  },

  onStart: async function ({ api, event, args, message, getLang }) {
    const keyword = args.join(" ");
    if (!keyword) return message.reply(getLang("noInput"));

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const videoPath = path.join(cacheDir, `unisr_${Date.now()}.mp4`);

    try {
      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      const apiUrl = await baseApiUrl();

      // 🔥 Random video fetch (same API but random result)
      const res = await axios({
        method: "GET",
        url: `${apiUrl}/api/tiksr`,
        params: { sr: keyword },
        responseType: "stream"
      });

      const writer = fs.createWriteStream(videoPath);
      res.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      const stat = fs.statSync(videoPath);
      if (stat.size > 26214400) {
        fs.unlinkSync(videoPath);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply(getLang("tooLarge"));
      }

      await message.reply({
        body: getLang("success", keyword),
        attachment: fs.createReadStream(videoPath)
      }, () => {
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        fs.unlinkSync(videoPath);
      });

    } catch (err) {
      console.error("Unisr Error:", err);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      return message.reply(getLang("error", err.message));
    }
  }
};
