const axios = require("axios");

module.exports = {
  config: {
    name: "kick",
    version: "1.0",
    author: "Hridoy", // author cng korle Tor ma re cdmu raja condom lagai 🐍 
    role: 0,
    shortDescription: "kick a user with gif",
    category: "Tag Fun"
  },

  onStart: async function ({ message, event, api }) {
    let targetID;
    let targetName;

    const gifs = [
        "https://i.imgur.com/v5klVac.gif",
        "https://i.imgur.com/niWRj0Z.gif",
        "https://i.imgur.com/Dze3otO.gif",
        "https://i.imgur.com/U8V0UmL.gif",
        "https://i.imgur.com/VJ95BSY.gif",
        "https://i.imgur.com/RAXDfSS.gif",
        "https://i.imgur.com/2e5w3Xw.gif",
        "https://i.imgur.com/MUHN9pP.gif"
        ];

    // mention system
    if (Object.keys(event.mentions || {}).length > 0) {
      targetID = Object.keys(event.mentions)[0];
      targetName = event.mentions[targetID];
    }

    // reply system
    else if (event.type === "message_reply" && event.messageReply) {
      targetID = event.messageReply.senderID;

      const info = await api.getUserInfo(targetID);
      targetName = info[targetID]?.name || "User";
    }

    if (!targetID) {
      return message.reply("❌ Please mention or reply to someone.");
    }

    const url = gifs[Math.floor(Math.random() * gifs.length)];
    const tag = `@${targetName}`;

    try {
      const res = await axios({
        method: "GET",
        url,
        responseType: "stream",
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      return message.reply({
        body: `${tag} you got kick 🦶 💥`,
        mentions: [
          {
            id: targetID,
            tag: tag
          }
        ],
        attachment: res.data
      });

    } catch (err) {
      console.error("KICK GIF ERROR:", err.message || err);
      return message.reply("❌ GIF load failed.");
    }
  }
};