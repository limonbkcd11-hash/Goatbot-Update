const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "lumin",
    version: "1.0",
    author: "Saimx69x (API by Renz)",
    countDown: 5,
    role: 0,
    description: {
      en: "Generate an AI image using the Oculux Luminarium API",
    },
    category: "AI",
    guide: {
      en: "{pn} <prompt>\nExample: /lumin futuristic neon city at night",
    },
  },

  onStart: async function ({ message, event, args, api, commandName }) {
    
    let prefix = "/";
    try {
      prefix =
        (global.utils?.getPrefix &&
          (await global.utils.getPrefix(event.threadID))) ||
        global.GoatBot?.config?.prefix ||
        "/";
    } catch {
      prefix = "/";
    }

    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply(
        `⚠️ Please provide a prompt.\nExample: ${prefix}${commandName} futuristic neon city at night`
      );
    }

    api.setMessageReaction("🎨", event.messageID, () => {}, true);
    const waitingMsg = await message.reply("🎨 Generating your Luminarium image... Please wait...");

    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://dev.oculux.xyz/api/luminarium?prompt=${encodedPrompt}`;
    const imgPath = path.join(__dirname, "cache", `lumin_${event.senderID}.png`);

    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, response.data);

      await message.reply(
        {
          body: `✅ Here is your generated ${commandName} image.`,
          attachment: fs.createReadStream(imgPath),
        },
        () => {
          fs.unlinkSync(imgPath);
          if (waitingMsg?.messageID) api.unsendMessage(waitingMsg.messageID);
        }
      );
    } catch (error) {
      console.error("Luminarium generation error:", error);
      message.reply("⚠️ Failed to generate image. Please try again later.");
      if (waitingMsg?.messageID) api.unsendMessage(waitingMsg.messageID);
    }
  },
};
