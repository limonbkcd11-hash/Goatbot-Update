const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "sanda",
    version: "2.0.1",
    author: "Hridoy", //author cng korle Tor ma re cdmu raja condom lagai 🐍 
    countDown: 5,
    role: 0,
    shortDescription: "Expose someone as sanda",
    category: "Tag Fun",
    guide: {
      en: "{pn} @mention or reply"
    }
  },

  onStart: async function ({ event, message, api }) {
    let targetID;

    // Mention system
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    }

    // Reply system
    if (event.type === "message_reply" && event.messageReply) {
      targetID = event.messageReply.senderID;
    }

    if (!targetID) {
      return message.reply("❗ Tag or reply to someone!");
    }

    if (targetID === event.senderID) {
      return message.reply("❗ নিজেকেই sanda বানাবি? 😂");
    }

    const baseFolder = path.join(__dirname, "NAFIJ");
    if (!fs.existsSync(baseFolder)) fs.mkdirSync(baseFolder);

    const outputPath = path.join(baseFolder, `sanda_${targetID}.png`);

    try {
      // background + avatar
      const bgUrl =
        "https://raw.githubusercontent.com/alkama844/res/refs/heads/main/image/sanda.jpg";

      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const [bgBuffer, avatarBuffer] = await Promise.all([
        axios.get(bgUrl, { responseType: "arraybuffer" }).then(r => r.data),
        axios.get(avatarUrl, { responseType: "arraybuffer" }).then(r => r.data)
      ]);

      const bg = await loadImage(bgBuffer);
      const avatar = await loadImage(avatarBuffer);

      const canvas = createCanvas(600, 800);
      const ctx = canvas.getContext("2d");

      // background
      ctx.drawImage(bg, 0, 0, 600, 800);

      // avatar circle
      const size = 140;
      const x = 230;
      const y = 60;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(avatar, x, y, size, size);
      ctx.restore();

      const buffer = canvas.toBuffer("image/png");

      fs.writeFileSync(outputPath, buffer);

      const userInfo = await api.getUserInfo(targetID);
      const name = userInfo[targetID]?.name || "User";

      return message.reply(
        {
          body: `🤣 ${name} এখন official Sanda! 🦥`,
          attachment: fs.createReadStream(outputPath)
        },
        () => {
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        }
      );

    } catch (err) {
      console.error("Sanda Error:", err);
      return message.reply("❌ Image generate failed. আবার try করো।");
    }
  }
};