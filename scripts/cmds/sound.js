const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "sound",
    version: "1.0.0",
    author: "Hridoy",
    role: 0,
    category: "AI",
    shortDescription: "Get MyInstants sound as audio"
  },

  onStart: async function ({ args, message }) {
    const query = args.join(" ");
    if (!query) return message.reply("❌ Please give a sound name");

    try {
      // 1. Search MyInstants
      const searchUrl = `https://www.myinstants.com/en/search/?name=${encodeURIComponent(query)}`;
      const res = await axios.get(searchUrl);
      const $ = cheerio.load(res.data);

      // 2. Get first result link
      const firstLink = $(".instant-link").attr("href");

      if (!firstLink) return message.reply("❌ No sound found");

      const soundPage = "https://www.myinstants.com" + firstLink;

      // 3. Load sound page
      const pageRes = await axios.get(soundPage);
      const $$ = cheerio.load(pageRes.data);

      // 4. Extract MP3
      const mp3 =
        $$("audio source").attr("src") ||
        $$("meta[property='og:audio']").attr("content");

      if (!mp3) return message.reply("❌ Audio not found");

      const audioUrl = mp3.startsWith("http")
        ? mp3
        : "https://www.myinstants.com" + mp3;

      // 5. Download file
      const filePath = path.join(__dirname, "sound.mp3");
      const audio = await axios.get(audioUrl, { responseType: "arraybuffer" });

      fs.writeFileSync(filePath, audio.data);

      // 6. Send audio
      return message.reply({
        attachment: fs.createReadStream(filePath)
      });

    } catch (err) {
      console.log(err);
      message.reply("❌ Error fetching sound");
    }
  }
};