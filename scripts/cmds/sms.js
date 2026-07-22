const axios = require("axios");

module.exports = {
  config: {
    name: "sms",
    version: "1.2.0",
    author: "Azadx69x (edited by you)",
    countDown: 15,
    role: 2, // 👈 only bot admin
    shortDescription: { en: "API call (BD)" },
    category: "Utility",
    guide: { en: ".sms bom 01xxxxxxxxx" }
  },

  onStart: async function ({ event, message, args }) {
    const sub = args[0];
    const number = args[1];

    if (sub !== "bom") {
      return message.reply("Usage:\n)sms bom 01xxxxxxxxx");
    }

    if (!number || !/^01[0-9]{9}$/.test(number)) {
      return message.reply("📵 BD নাম্বার দিন\nউদাহরণ: )sms bom 01xxxxxxxxx");
    }

    await message.reply(`📡 Sending request...\n📩 Target: ${number}`);

    try {
      const url = `https://shadowx-sms-bomber.onrender.com/smsb?num=${number}`;
      const res = await axios.get(url, { timeout: 15000 });
      const data = res.data;

      if (!data || data.success !== true) {
        return message.reply("❌ API response unsuccessful");
      }

      return message.reply(
        `✅ Request accepted\n` +
        `🆔 Attack ID: ${data.attack_id || "N/A"}\n` +
        `ℹ️ Message: ${data.message || "No message"}`
      );

    } catch (e) {
      return message.reply("❌ API unreachable / blocked");
    }
  }
};