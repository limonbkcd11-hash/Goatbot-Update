const axios = require('axios');

module.exports = {
  config: {
    name: "ass",         
    aliases: [],         
    version: "1.0",
    author: "Hridoy",
    countDown: 8,         // cooldown to avoid API limit
    role: 0,              // 0 = সবাই, 1 = admin only
    shortDescription: "Random ass pic from Nights API",
    longDescription: "NSFW image send করে।",
    category: "NSFW",
    guide: "{pn}"         // শুধু .ass লিখলেই চলবে, extra arg না লাগে
  },

  onStart: async function ({ message, api, event }) {
    const apiKey = "5ZW1vsrOnj-utK8iWK8MQFFcpZHFdwc-cmhBjJjeYU"; // env-এ রাখলে ভালো

    const category = "ass"; // ← এখানে fixed category দাও (যেমন "ass", "boobs", "pussy" ইত্যাদি)

    try {
      const url = `https://api.night-api.com/images/nsfw/${category}`;
      const response = await axios.get(url, {
        headers: { authorization: apiKey }
      });

      if (response.status !== 200 || !response.data?.content?.url) {
        return message.reply("API থেকে pic লোড হচ্ছে না 😔 আবার ট্রাই করো!");
      }

      const imageUrl = response.data.content.url;
      const attachment = await global.utils.getStreamFromURL(imageUrl);

      await api.sendMessage({
        body: `😈 ${category.toUpperCase()} pic তোমার জন্য!`,
        attachment: attachment
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error("NSFW Error:", error);
      let errMsg = "Error! ";
      if (error.response) {
        errMsg += `API: ${error.response.status}`;
      } else {
        errMsg += error.message;
      }
      return message.reply(errMsg + "\nLimit শেষ বা key issue হতে পারে।");
    }
  }
};
