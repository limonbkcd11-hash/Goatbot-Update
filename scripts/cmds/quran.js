const axios = require("axios");

module.exports = {
  config: {
    name: "quran",
    aliases: ["surah"],
    version: "2.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: "Full Surah Arabic + Bangla with name",
    longDescription: "Send full Surah: name, number, Arabic first, then Bangla translation",
    category: "Utility",
    guide: {
      en: "{pn}quran <surahNumber>"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      let surahNo = parseInt(args[0]);
      if (!surahNo || isNaN(surahNo) || surahNo < 1 || surahNo > 114) {
        surahNo = Math.floor(Math.random() * 114) + 1; // random surah
      }

      const url = `https://alquran-api.pages.dev/api/quran/surah/${surahNo}?lang=bn`;
      const res = await axios.get(url);
      const data = res.data;

      if (!data || !data.verses) return api.sendMessage("❌ | No data found.", event.threadID);

      // Header: Surah name + number
      let header = `📖 সূরা: ${data.surahName} (#${data.surahNo})\n\n`;

      // Arabic full text
      let arabicText = "";
      data.verses.forEach((ayah) => {
        arabicText += `${ayah.text}\n`;
      });

      // Bangla translation
      let banglaText = "";
      data.verses.forEach((ayah) => {
        banglaText += `${ayah.translation}\n`;
      });

      // Combine all
      const fullText = `${header}🕌 Arabic:\n${arabicText}\n📝 Bangla Translation:\n${banglaText}`;

      // Split message in chunks to avoid limit
      const chunkSize = 1800;
      for (let i = 0; i < fullText.length; i += chunkSize) {
        await api.sendMessage(fullText.substring(i, i + chunkSize), event.threadID);
      }

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ | Error fetching Surah", event.threadID);
    }
  }
};
