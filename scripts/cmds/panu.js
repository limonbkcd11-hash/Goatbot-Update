module.exports = {
  config: {
    name: "panu",
    version: "1",
    author: "Hridoy",
    category: "NSFW",
    role: "all user",
    usePrefix: true,
    forAdminUsePrefix: false,
    cooldown: 20
  },
  
  onStart: async function({ event, message, usersData, args, getLang, role, api }) {
    try {
      // Add waiting reaction
      api.setMessageReaction("🐣", event.messageID, (err) => {}, true);
      
      // List of video URLs
      const videos = [,
"https://files.catbox.moe/ark10q.mp4",
"https://files.catbox.moe/r9i5m5.mp4",
"https://files.catbox.moe/waftpn.mp4",
"https://files.catbox.moe/02y70j.mp4",
"https://files.catbox.moe/38s6za.mp4",
"https://files.catbox.moe/7a2nkw.mp4",
"https://files.catbox.moe/r1spro.mp4",
"https://files.catbox.moe/dmt6p7.mp4",
"https://files.catbox.moe/007z0k.mp4",
"https://files.catbox.moe/gactoc.mp4",
"https://files.catbox.moe/8y2f0h.mp4",
"https://files.catbox.moe/ls27ea.mp4",
"https://files.catbox.moe/8qzsy6.mp4",
"https://files.catbox.moe/b0v3s1.mp4",
"https://files.catbox.moe/2cel82.mp4",
"https://files.catbox.moe/7elp3l.mp4",
"https://files.catbox.moe/y7ppy2.mp4",
"https://files.catbox.moe/9lf67i.mp4",
"https://files.catbox.moe/wirvl5.mp4",
"https://files.catbox.moe/jxkg3j.mp4",
"https://files.catbox.moe/qhez56.mp4",
"https://files.catbox.moe/3svgsv.mp4"
      ];
      
      // Select a random video
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      
      // Form message
      const form = {
        body: "「 HERE IS YOUR HORNY VIDEO, 🥵 」",
        attachment: await global.utils.getStreamFromURL(randomVideo)
      };
      
      // Send the message
      await message.reply(form);
      
      // Add success reaction
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      
    } catch (error) {
      console.error("Error in cornyvid command:", error);
      message.reply("An error occurred while processing your request.");
    }
  },
  
  onChat: async function({ event, message, usersData, args, getLang, role, api }) {
    // This allows admin to use the command without prefix
    if (role === 1 || role === 2) { // Assuming 1 and 2 are admin roles
      const command = event.body.toLowerCase();
      if (command === "cornyvid") {
        this.onStart({ event, message, usersData, args, getLang, role, api });
      }
    }
  }
};