const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "nigga",
    aliases: ["roast", "burn"],
    version: "1.3",
    author: "Hridoy",
    countDown: 2,
    role: 0,
    description: "Send a roast image using UID (mention/reply/self)",
    category: "Tag Fun",
    guide: {
      en: "{pn} @mention\n{pn} (reply to a user)\nOr use without mention/reply to roast yourself."
    }
  },

  onStart: async function ({ api, event }) {
    try {
      let targetUID;

      // Reply target
      if (event.type === "message_reply" && event.messageReply) {
        targetUID = event.messageReply.senderID;
      }
      // Mention target
      else if (Object.keys(event.mentions || {}).length > 0) {
        targetUID = Object.keys(event.mentions)[0];
      }
      // Self target
      else {
        targetUID = event.senderID;
      }

      const cacheDir = path.join(__dirname, "cache");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const url = `https://betadash-api-swordslush-production.up.railway.app/nigga?userid=${targetUID}`;

      const response = await axios.get(url, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(cacheDir, `roast_${targetUID}.jpg`);

      fs.writeFileSync(filePath, Buffer.from(response.data));

      api.sendMessage(
        {
          body: "Look I found a nigga 😂",
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        },
        event.messageID
      );

    } catch (error) {
      console.error("Nigga Command Error:", error);

      api.sendMessage(
        "❌ Couldn't generate image. Try again later.",
        event.threadID,
        event.messageID
      );
    }
  }
};