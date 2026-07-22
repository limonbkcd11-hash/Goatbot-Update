const axios = require("axios");

module.exports = {
  config: {
    name: "world",
    version: "3.0",
    author: "rX",
    countDown: 5,
    role: 0,
    shortDescription: "Random Image",
    longDescription: "Send random world image",
    category: "Image"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    try {
      // Picsum random image (always works)
      const imageUrl = "https://picsum.photos/600/800";

      const response = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream"
      });

      return api.sendMessage({
        body: "Beautiful World 🌎✨",
        attachment: response.data
      }, threadID, messageID);

    } catch (error) {
      console.log(error);
      return api.sendMessage("Image আনতে সমস্যা হচ্ছে ❌ আবার চেষ্টা করো।", threadID, messageID);
    }
  }
};