const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "fakeface",
    aliases: ["face", "ai-face"],
    version: "2.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: "Send AI-generated human face",
    longDescription: "Downloads AI face from link and sends as image",
    category: "AI",
    guide: {
      en: "{pn}fakeface"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // 1️⃣ Image link
      const imageUrl = "https://thispersondoesnotexist.com/";

      // 2️⃣ Temp file path
      const filePath = path.join(__dirname, "cache", `fakeface_${Date.now()}.jpg`);

      // 3️⃣ Download image
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                        "(KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
          "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
        }
      });

      // 4️⃣ Write image to temp file
      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      // 5️⃣ Send image as attachment
      await api.sendMessage(
        {
          body: "🤖 Here's a random AI-generated face:",
          attachment: fs.createReadStream(filePath)
        },
        event.threadID
      );

      // 6️⃣ Delete temp file
      fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ | Could not generate face, try again!", event.threadID);
    }
  }
};
