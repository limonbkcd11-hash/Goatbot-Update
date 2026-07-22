const axios = require('axios');

module.exports = {
  config: {
    name: "imgur",
    version: "1.5.0",
    author: "乛 SIYAM ゎ",
    countDown: 5,
    role: 0,
    category: "AI",
    shortDescription: { en: "ᴜᴘʟᴏᴀᴅ ᴍᴇᴅɪᴀ ᴛᴏ ɪᴍɢᴜʀ ᴠɪᴀ ᴀᴅᴠᴀɴᴄᴇᴅ ᴀᴘɪ" },
    guide: { en: "『 ʀᴇᴘʟʏ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ ᴏʀ ᴠɪᴅᴇᴏ 』" }
  },

  onStart: async function ({ api, event, message }) {
    const reply = event.messageReply;

    if (!reply || !reply.attachments || reply.attachments.length === 0) {
      return message.reply("✧ ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴛᴏ ᴍᴇᴅɪᴀ Ი");
    }

    message.reaction("🐋", event.messageID);

    try {
      // API Endpoint
      const apiEndpoint = "https://maybexenos.vercel.app/uploader/imgur";
      
      let resultMsg = "";
      
      const uploadPromises = reply.attachments.map(async (attachment, index) => {
        try {
          const res = await axios.get(`${apiEndpoint}?link=${encodeURIComponent(attachment.url)}`);
          
          const link = res.data.uploaded.image; 
          
          if (link) {
            return `ʟɪɴᴋ ${index + 1}: ${link}`;
          } else {
            return `ʟɪɴᴋ ${index + 1}: ᴜᴘʟᴏᴀᴅ ғᴀɪʟᴇᴅ`;
          }
        } catch (e) {
          return `ʟɪɴᴋ ${index + 1}: ᴄᴏɴɴᴇᴄᴛɪᴏɴ ᴇʀʀᴏʀ`;
        }
      });

      const results = await Promise.all(uploadPromises);
      resultMsg += results.join("\n");
      resultMsg += "";

      message.reaction("🪶", event.messageID);
      return message.reply(resultMsg);

    } catch (err) {
      message.reaction("🥲", event.messageID);
      return message.reply("✧ sᴇʀᴠᴇʀ ᴅᴏᴡɴ ᴏʀ ɪɴᴠᴀʟɪᴅ ᴀᴘɪ ");
    }
  }
};