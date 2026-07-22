const axios = require("axios");
const simsim = "https://simsimi-api-tjb1.onrender.com";

module.exports = {
  config: {
    name: "baby",
    aliases: ["hippi"],
    version: "2.0.0",
    author: "rX",
    countDown: 0,
    role: 0,
    shortDescription: "Cute AI Baby Chatbot (Auto Teach + Typing)",
    longDescription: "Talk & Chat with Emotion — Auto teach enabled with typing effect.",
    category: "Utility",
    guide: {
      en: "{p}baby [message]\n{p}baby teach [Question] - [Answer]\n{p}baby list"
    }
  },

  // ───────── MAIN COMMAND ─────────
  onStart: async function ({ api, event, args, message, usersData }) {
    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const query = args.join(" ").trim().toLowerCase();
    const threadID = event.threadID;

    const sendTyping = async () => {
      try {
        api.sendTypingIndicator(threadID, true);
        await new Promise(r => setTimeout(r, 2000));
        api.sendTypingIndicator(threadID, false);
      } catch (err) {
        console.error("Typing error:", err.message);
      }
    };

    try {
      if (!query) {
        await sendTyping();
        const ran = ["Bolo baby 💖", "Hea baby 😚"];
        const r = ran[Math.floor(Math.random() * ran.length)];
        return message.reply(r, (err, info) => {
          if (!err)
            global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: senderID });
        });
      }

      // teach
if (args[0] === "teach") {

  await sendTyping();

  const roastReplies = [
    "Teach? 😏 তুই আগে নিজে শিখে আয় তারপর আমাকে শেখা 🐸",
    "আমি AI baby, তোর কাছে tuition নিবো নাকি? 🤨",
    "ওরে বাবা, teacher আইছে! কিন্তু brain kothay? 🤣",
    "Teach করতে আইছোস? 🤡 আগে spelling শিখ bro",
    "আমাকে শেখানোর দরকার নাই, তুই নিজেই confused 😵",
    "Baby ke teach? 😂 Respect maintain kor",
    "Tor kotha shune bot crash hoye jabe 😭",
    "Teach korar age IQ check kor 😆",
    "আমি already smart, তুই upgrade ho 🐸",
    "এইটা school na, ja giya pora lekha kor 📚"
  ];

  const reply = roastReplies[Math.floor(Math.random() * roastReplies.length)];

  return message.reply(reply, (err, info) => {
    if (!err)
      global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: senderID });
  });
}
      // list
      if (args[0] === "list") {

        await sendTyping();

        const res = await axios.get(`${simsim}/list`);
        if (res.data.code === 200)
          return message.reply(`♾ Total Questions: ${res.data.totalQuestions}\n★ Replies: ${res.data.totalReplies}\n👑 Author: ${res.data.author}`);
        else
          return message.reply(`Error: ${res.data.message || "Failed to fetch list"}`);
      }

      // normal chat
      await sendTyping();

      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);

      const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

      if (!responses || responses.length === 0) {
        await axios.get(`${simsim}/teach?ask=${encodeURIComponent(query)}&ans=${encodeURIComponent("hmm baby 😚 (auto learned)")}&senderName=${encodeURIComponent(senderName)}`);
        return message.reply("hmm baby 😚");
      }

      for (const reply of responses) {
        await new Promise(resolve => {
          message.reply(reply, (err, info) => {
            if (!err)
              global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: senderID });
            resolve();
          });
        });
      }

    } catch (err) {
      console.error("❌ Baby main error:", err);
      message.reply(`Error in baby command: ${err.message}`);
    }
  },

  // ───────── REPLY SYSTEM ─────────
  onReply: async function ({ api, event, message, usersData }) {
    const threadID = event.threadID;
    const senderName = await usersData.getName(event.senderID);
    const replyText = event.body ? event.body.trim().toLowerCase() : "";

    const sendTyping = async () => {
      try {
        api.sendTypingIndicator(threadID, true);
        await new Promise(r => setTimeout(r, 2000));
        api.sendTypingIndicator(threadID, false);
      } catch (err) {}
    };

    try {
      if (!replyText) return;

      await sendTyping();

      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(replyText)}&senderName=${encodeURIComponent(senderName)}`);

      const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

      if (!responses || responses.length === 0)
        return message.reply("hmm baby 😚");

      for (const reply of responses) {
        await new Promise(resolve => {
          message.reply(reply, (err, info) => {
            if (!err)
              global.GoatBot.onReply.set(info.messageID, { commandName: "baby", author: event.senderID });
            resolve();
          });
        });
      }

    } catch (err) {
      console.error("❌ Baby reply error:", err);
    }
  },

  // ───────── AUTO CHAT ─────────
  onChat: async function ({ api, event, message, usersData }) {
    const raw = event.body ? event.body.toLowerCase().trim() : "";
    if (!raw) return;

    const senderName = await usersData.getName(event.senderID);
    const senderID = event.senderID;
    const threadID = event.threadID;

    const sendTyping = async () => {
      try {
        api.sendTypingIndicator(threadID, true);
        await new Promise(r => setTimeout(r, 2000));
        api.sendTypingIndicator(threadID, false);
      } catch (err) {}
    };

    try {

      const simpleTriggers = ["baby","bot","bby","বেবি","বট","toru","kakashi","jan"];

      if (simpleTriggers.includes(raw)) {

        await sendTyping();

        const replies = [
          
          "𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐰𝐚𝐥𝐚𝐢𝐤𝐮𝐦 ♥",
          "বলেন sir__😌",
          "𝐁𝐨𝐥𝐨 𝐣𝐚𝐧 𝐤𝐢 𝐤𝐨𝐫𝐭𝐞 𝐩𝐚𝐫𝐢 𝐭𝐨𝐦𝐫 𝐣𝐨𝐧𝐧𝐨 🐸",
          "𝐋𝐞𝐛𝐮 𝐤𝐡𝐚𝐰 𝐝𝐚𝐤𝐭𝐞 𝐝𝐚𝐤𝐭𝐞 𝐭𝐨 𝐡𝐚𝐩𝐚𝐲 𝐠𝐞𝐬𝐨",
          "𝐆𝐚𝐧𝐣𝐚 𝐤𝐡𝐚 𝐦𝐚𝐧𝐮𝐬𝐡 𝐡𝐨 🍁",
          "𝐋𝐞𝐦𝐨𝐧 𝐭𝐮𝐬 🍋",
          "মুড়ি খাও 🫥",
          "𝐚𝐦𝐤𝐞 𝐬𝐞𝐫𝐞 𝐝𝐞𝐰 𝐚𝐦𝐢 𝐚𝐦𝐦𝐮𝐫 𝐤𝐚𝐬𝐞 𝐣𝐚𝐛𝐨!!🥺.....😗",
          "লুঙ্গি টা ধর মুতে আসি🙊🙉",
          "──‎ 𝐇𝐮𝐌..? 👉👈",
          "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🐸",
          "কি হলো, মিস টিস করচ্ছো নাকি 🤣",
          "𝐓𝐫𝐮𝐬𝐭 𝐦𝐞 𝐢𝐚𝐦 𝐭𝐨𝐫𝐮 𝐟𝐫𝐨𝐦 𝐤𝐚𝐤𝐚𝐬𝐡𝐢🧃",
          "𝗛𝗲𝘆 𝘅𝗮𝗻 𝗶𝗮𝗺 𝘁𝗼𝗿𝘂 𝗰𝗵𝗮𝗻✨"
        ];

        const reply = replies[Math.floor(Math.random() * replies.length)];

        return message.reply(reply,(err,info)=>{
          if(!err)
            global.GoatBot.onReply.set(info.messageID,{commandName:"baby",author:senderID});
        });
      }

      const prefixes = ["baby ","bot ","bby ","toru ","kakashi "];

      const prefix = prefixes.find(p => raw.startsWith(p));

      if (prefix) {

        const query = raw.replace(prefix,"").trim();

        if (!query) return;

        await sendTyping();

        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);

        const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

        if (!responses || responses.length === 0)
          return message.reply("hmm baby 😚");

        for (const reply of responses) {
          await new Promise(resolve=>{
            message.reply(reply,(err,info)=>{
              if(!err)
                global.GoatBot.onReply.set(info.messageID,{commandName:"baby",author:senderID});
              resolve();
            });
          });
        }

      }

    } catch (err) {
      console.error("❌ Baby onChat error:", err);
    }
  }
};
