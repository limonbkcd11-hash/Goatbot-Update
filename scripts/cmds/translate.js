const axios = require("axios");

module.exports = {
  config: {
    name: "translate",
    aliases: ["tns", "tn"],
    version: "2.0.0",
    author: "Hridoy",
    role: 0,
    shortDescription: "Translate text (reply + direct)",
    category: "Utility",
    guide: 
      "{pn} <lang> (reply message)\n" +
      "{pn} <text> <lang>\n" +
      "Example:\n" +
      "tr bn (reply)\n" +
      "tr hello bn",
    cooldown: 3
  },

  onStart: async function ({ message, event, args }) {
    try {
      let text = "";
      let lang = "";

      // 🔥 CASE 1: Reply system
      if (event.messageReply && event.messageReply.body) {
        text = event.messageReply.body;
        lang = args[0];

        if (!lang)
          return message.reply("❌ Language dao (bn/en/hi)");
      }

      // 🔥 CASE 2: Direct system
      else {
        if (args.length < 2)
          return message.reply("❌ Use:\ntr hello bn");

        lang = args[args.length - 1]; // last word = lang
        text = args.slice(0, -1).join(" "); // baki gula text
      }

      // 🔥 Translate API
      const res = await axios.get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`
      );

      const translated = res.data[0].map(i => i[0]).join("");

      return message.reply(
        `🌐 ${lang.toUpperCase()} Translation:\n\n${translated}`
      );

    } catch (err) {
      console.error(err);
      return message.reply("⚠️ Translate fail hoise... abar try koro 😅");
    }
  }
};
