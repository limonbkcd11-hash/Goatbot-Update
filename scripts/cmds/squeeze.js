const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "squeeze",
    version: "1.0.3",
    hasPermssion: 2,
    credits: "Hridoy",
    description: "Squeeze your friend (reply or mention)",
    category: "NSFW",
    usages: "@tag or reply",
    cooldowns: 5
  },

  onStart: async function({ api, event }) {
    try {

      let mentionID;
      let tagName;

      // ✅ CASE 1: Reply system
      if (event.type === "message_reply") {
        mentionID = event.messageReply.senderID;
        const userInfo = await api.getUserInfo(mentionID);
        tagName = userInfo[mentionID]?.name || "friend";
      }

      // ✅ CASE 2: Mention system
      else if (event.mentions && Object.keys(event.mentions).length > 0) {
        mentionID = Object.keys(event.mentions)[0];
        tagName = event.mentions[mentionID].replace("@", "");
      }

      // ❌ No target found
      else {
        return api.sendMessage(
          "❌ Please reply to someone or tag them!",
          event.threadID,
          event.messageID
        );
      }

      // GIF list
      const gifs = [
        "https://i.postimg.cc/pLrqnDg4/78d07b6be53bea612b6891724c1a23660102a7c4.gif",
        "https://i.postimg.cc/gJFD51nb/detail.gif",
        "https://i.postimg.cc/xjPRxxQB/GiC86RK.gif",
        "https://i.postimg.cc/L8J3smPM/tumblr-myzq44-Hv7-G1rat3p6o1-500.gif",
      ];

      const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

      // cache folder
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const gifPath = path.join(cacheDir, "squeeze.gif");

      // download gif
      const response = await axios({
        url: randomGif,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(gifPath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `${tagName}!\n𝗬𝗼𝘂 𝗚𝗲𝘁 𝗬𝗼𝘂𝗿 𝗦𝗾𝘂𝗲𝗲𝘇𝗲 😝`,
            mentions: [{ tag: tagName, id: mentionID }],
            attachment: fs.createReadStream(gifPath)
          },
          event.threadID,
          () => fs.existsSync(gifPath) && fs.unlinkSync(gifPath),
          event.messageID
        );
      });

      writer.on("error", () => {
        api.sendMessage(
          "❌ Failed to download GIF.",
          event.threadID,
          event.messageID
        );
      });

    } catch (err) {
      console.error(err);
      api.sendMessage(
        "❌ An unexpected error occurred.",
        event.threadID,
        event.messageID
      );
    }
  }
};