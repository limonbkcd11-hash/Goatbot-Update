const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "goru2",
    version: "2.7.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    category: "Tag Fun",
    shortDescription: { en: "Funny Cow edit with mention + reply support" },
    guide: { en: "{pn} @mention or reply" }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;

    const cacheDir = path.join(process.cwd(), "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

    // ✅ mention OR reply support (FIXED)
    let targetID = Object.keys(mentions || {})[0];

    if (!targetID && messageReply) {
      targetID = messageReply.senderID;
    }

    if (!targetID) {
      return message.reply("আরে বলদ 😒 মেনশন বা রিপ্লাই কর তারপর গরু বানাবি 🐄");
    }

    try {
      const userInfo = await api.getUserInfo(targetID);
      const userName = userInfo?.[targetID]?.name || "User";

      const imgLink = "https://i.imgur.com/pkoB67f.jpeg";
      const filePath = path.join(cacheDir, `goru_${Date.now()}.png`);

      message.reply("দাঁড়া মামা... গরু বানানো হচ্ছে 🐄⏳");

      const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

      const userPfpUrl =
        `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=${accessToken}`;

      const targetPfpUrl =
        `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${accessToken}`;

      const [baseImage, userPfp, targetPfp] = await Promise.all([
        loadImage(imgLink),
        loadImage(userPfpUrl),
        loadImage(targetPfpUrl)
      ]);

      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0);

      function circle(img, x, y, size) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      }

      // sender
      circle(userPfp, 168, 153, 104);

      // target
      circle(targetPfp, 58, 288, 104);

      fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

      const caption =
        `এই নে তোর গরুর ছবি! 🐄\n\n${userName}, এখন ঘাস খাওয়াইতে নিয়া যা 😂`;

      return api.sendMessage(
        {
          body: caption,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.existsSync(filePath) && fs.unlinkSync(filePath),
        messageID
      );

    } catch (e) {
      console.error(e);
      return message.reply("গরু বানাতে সমস্যা হইছে ❌ আবার চেষ্টা কর");
    }
  }
};