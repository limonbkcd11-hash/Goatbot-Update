const axios = require("axios");

module.exports = {
  config: {
    name: "slap2",
    version: "1.0",
    author: "Hridoy",
    role: 0,
    shortDescription: "Punch a user with gif",
    category: "Tag Fun"
  },

  onStart: async function ({ message, event, api }) {
    let targetID;
    let targetName;

    const gifs = [
        "https://i.imgur.com/S9rvNi7.gif",
        "https://i.imgur.com/RMZRMCt.gif",
        "https://i.imgur.com/RqgwUfP.gif",
        "https://i.imgur.com/ISeFVQa.gif",
        "https://i.imgur.com/IjAfDDI.gif",
        "https://i.imgur.com/eJjfftq.gif" ,
        "https://i.imgur.com/4XAMBBk.gif",
        "https://i.imgur.com/7GlLfiM.gif"
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
        body: `${tag} you got slap 👋💥`,
        mentions: [
          {
            id: targetID,
            tag: tag
          }
        ],
        attachment: res.data
      });

    } catch (err) {
      console.error("SLAP GIF ERROR:", err.message || err);
      return message.reply("❌ GIF load failed.");
    }
  }
};