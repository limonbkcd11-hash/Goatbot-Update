const axios = require('axios');

module.exports = {
  config: {
    name: "nsfw",
    aliases: [],
    version: "1.1",
    author: "Hridoy",
    countDown: 10,
    role: 0,  // 0 = সবাই, চাইলে 1 করে admin only করো
    shortDescription: "Interactive NSFW pic selector",
    longDescription: "NSFW category list দেখায়, তুমি reply করে category select করলে pic send করে। Nights API use করে।",
    category: "NSFW",
    guide: {
      bd: "{pn}\n\nCommand দিলে category list আসবে। Reply করে category নাম লিখো (যেমন: ass বা hentai)।"
    }
  },

  onStart: async function ({ message, api, event }) {
    const categories = [
      "Anal", "Ass", "Boobs", "Gonewild", "Hanal", "Hass", "Hboobs", "Hentai",
      "Hkitsune", "Hmidriff", "Hneko", "Hthigh", "Neko", "Paizuri", "Pgif",
      "Pussy", "Tentacle", "Thigh", "Yaoi"
    ];

    const listMsg = `😈 NSFW Category Select করো!\n\nAvailable options:\n${categories.map(cat => `• ${cat}`).join("\n")}\n\nReply করে শুধু category নাম লিখো (case insensitive), pic আসবে! 🔥\n\nExample reply: ass`;

    return message.reply(listMsg, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "select_category",
          messageID: info.messageID,
          author: event.senderID
        });
      }
    });
  },

  onReply: async function ({ message, event, Reply, api }) {
    if (Reply.commandName !== this.config.name || Reply.author !== event.senderID) return;

    const userReply = event.body.trim().toLowerCase();
    const categories = [
      "anal", "ass", "boobs", "gonewild", "hanal", "hass", "hboobs", "hentai",
      "hkitsune", "hmidriff", "hneko", "hthigh", "neko", "paizuri", "pgif",
      "pussy", "tentacle", "thigh", "yaoi"
    ];

    const selected = categories.find(cat => cat === userReply);

    if (!selected) {
      return message.reply(`Invalid selection bro! List থেকে একটা দাও:\n\nExample: ass, hentai, pussy ইত্যাদি\n\nআবার reply করো।`);
    }

    const apiKey = "5ZW1vsrOnj-utK8iWK8MQFFcpZHFdwc-cmhBjJjeYU"; // .env use করো recommended

    try {
      const url = `https://api.night-api.com/images/nsfw/${selected}`;
      const response = await axios.get(url, {
        headers: { authorization: apiKey }
      });

      if (response.status !== 200 || !response.data?.content?.url) {
        return message.reply("Pic load হচ্ছে না 😔 Try again!");
      }

      const imageUrl = response.data.content.url;
      const attachment = await global.utils.getStreamFromURL(imageUrl);

      await api.sendMessage({
        body: `🔞 ${selected.toUpperCase()} category থেকে random pic! 😈\nEnjoy bro 🔥\nNights API powered`,
        attachment: attachment
      }, event.threadID, event.messageID);

      // Clean up reply listener
      global.GoatBot.onReply.delete(Reply.messageID);

    } catch (error) {
      console.error("NSFW Reply Error:", error);
      let errMsg = "Error! ";
      if (error.response) errMsg += `API: ${error.response.status}`;
      else errMsg += error.message;
      return message.reply(errMsg + "\nLimit বা key issue হতে পারে।");
    }
  }
};
