const axios = require("axios");

const IMAGE_ACTIONS = [
  "ngif","hug","pat","cuddle","meow","tickle","gasm","spank",
  "feed","slap","wallpaper","neko","fox_girl","kiss","waifu","smug"
];

const TEXT_ACTIONS = [
  "fact","why","name","owoify","spoiler","8ball"
];

function buildMenu() {
  let i = 1;
  let text = `✨ NEKOS MENU ✨\n\n🖼 IMAGE\n`;

  for (const a of IMAGE_ACTIONS) {
    text += `  ${i}. ${a}\n`;
    i++;
  }

  text += `\n🧠 TEXT\n`;

  for (const a of TEXT_ACTIONS) {
    text += `  ${i}. ${a}\n`;
    i++;
  }

  text += `\nReply number (1-${i - 1})`;
  return text;
}

module.exports = {
  config: {
    name: "nekos",
    version: "2.1.0",
    author: "Hridoy",
    role: 0,
    shortDescription: "Nekos.life menu system",
    category: "Image",
    guide: "{pn}nekos",
    cooldown: 5
  },

  onStart: async function ({ api, event }) {
    return api.sendMessage(
      buildMenu(),
      event.threadID,
      (err, info) => {
        if (!global.GoatBot) global.GoatBot = {};
        if (!global.GoatBot.onReply) global.GoatBot.onReply = new Map();

        global.GoatBot.onReply.set(info.messageID, {
          commandName: "nekos",
          author: event.senderID
        });
      },
      event.messageID
    );
  },

  onReply: async function ({ api, event, Reply }) {
    try {
      if (!Reply || event.senderID !== Reply.author) return;

      const choice = parseInt(event.body);
      if (!choice) return;

      const all = [...IMAGE_ACTIONS, ...TEXT_ACTIONS];
      const action = all[choice - 1];
      if (!action) return;

      /* ================= IMAGE ================= */
      if (IMAGE_ACTIONS.includes(action)) {
        const res = await axios.get(
          `https://nekos.life/api/v2/img/${action}`
        );

        const url = res.data?.url;
        if (!url) throw new Error("No image URL");

        return api.sendMessage(
          {
            body: `✨ ${action.toUpperCase()}`,
            attachment: await global.utils.getStreamFromURL(url)
          },
          event.threadID,
          event.messageID
        );
      }

      /* ================= TEXT ================= */
      const res = await axios.get(
        `https://nekos.life/api/v2/${action}`
      );

      const key = Object.keys(res.data || {})[0];

      return api.sendMessage(
        `✨ ${action.toUpperCase()} ✨\n\n${res.data[key] || "No data"}`,
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.error("NEKOS ERROR:", err.message);

      return api.sendMessage(
        "❌ API error / invalid response. Try again later.",
        event.threadID,
        event.messageID
      );
    }
  }
};