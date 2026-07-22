const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pet",
    version: "1.1",
    author: "nexo",
    countDown: 5,
    role: 0,
    shortDescription: "Pet a user",
    longDescription: "Generates a pet image/video for a tagged, replied, or yourself",
    category: "Tag Fun",
    guide: {
      en: "{pn} @user\n{pn} (reply to a user)\n{pn}"
    }
  },

  onStart: async function ({ message, event, usersData }) {
    try {
      let userid;

      // Reply target
      if (event.type === "message_reply" && event.messageReply) {
        userid = event.messageReply.senderID;
      }
      // Mention target
      else if (Object.keys(event.mentions || {}).length > 0) {
        userid = Object.keys(event.mentions)[0];
      }
      // Self target
      else {
        userid = event.senderID;
      }

      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/pet?userid=${userid}`;

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir))
        fs.mkdirSync(cacheDir, { recursive: true });

      const res = await axios.get(apiUrl, {
        responseType: "arraybuffer"
      });

      const contentType = res.headers["content-type"] || "";

      let ext = "jpg";
      if (contentType.includes("gif")) ext = "gif";
      else if (contentType.includes("mp4")) ext = "mp4";
      else if (contentType.includes("png")) ext = "png";

      const filePath = path.join(cacheDir, `pet_${userid}.${ext}`);

      fs.writeFileSync(filePath, res.data);

      const name = await usersData.getName(userid);

      await message.reply({
        body: `🐾 You petted ${name}!`,
        attachment: fs.createReadStream(filePath)
      });

      if (fs.existsSync(filePath))
        fs.unlinkSync(filePath);

    } catch (err) {
      console.error("❌ Pet command error:", err);
      message.reply("⚠️ Failed to generate pet image/video.");
    }
  }
};