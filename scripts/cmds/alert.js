const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "alert",
    version: "1.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Create an alert style image with custom text"
    },
    description: {
      en: "Generates an alert style meme image using your text"
    },
    category: "Image",
    guide: {
      en: "{p}alert <text>\nExample: {p}alert Warning!"
    }
  },

  langs: {
    en: {
      missing: "âŒ | Please provide text for the alert image.",
      error: "âŒ | Failed to generate alert image."
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args.length) return message.reply(getLang("missing"));

    const text = encodeURIComponent(args.join(" "));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/alert?text=${text}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `alert_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: "Here's your alert image!",
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
