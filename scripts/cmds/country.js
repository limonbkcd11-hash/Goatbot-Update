const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "country",
    aliases: ["cty"],
    version: "3.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: "Country info with flag",
    longDescription: "Get full country info + flag image",
    category: "AI",
    guide: {
      en: "{pn}country <name>"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const query = args.join(" ");
      if (!query)
        return api.sendMessage("❌ | Enter a country name", event.threadID);

      const res = await axios.get(`https://restcountries.com/v3.1/name/${query}`);
      const data = res.data[0];

      // File path
      const filePath = path.join(__dirname, "cache", `flag_${Date.now()}.png`);

      // download flag
      const img = await axios.get(data.flags.png, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

      // extra data
      const currencies = data.currencies
        ? Object.values(data.currencies).map(c => `${c.name} (${c.symbol})`).join(", ")
        : "N/A";

      const languages = data.languages
        ? Object.values(data.languages).join(", ")
        : "N/A";

      const msg = `🌍 𝗖𝗢𝗨𝗡𝗧𝗥𝗬 𝗗𝗘𝗧𝗔𝗜𝗟𝗦

📛 Name: ${data.name.official}
🏳️ Capital: ${data.capital ? data.capital[0] : "N/A"}
🌐 Region: ${data.region} (${data.subregion || "N/A"})
👥 Population: ${data.population.toLocaleString()}
📏 Area: ${data.area.toLocaleString()} km²

💰 Currency: ${currencies}
🗣️ Languages: ${languages}

⏰ Timezones: ${data.timezones.join(", ")}
🚗 Driving Side: ${data.car?.side || "N/A"}

🌎 Map: ${data.maps.googleMaps}`;

      // send with image
      await api.sendMessage(
        {
          body: msg,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID
      );

      // delete file after send
      fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ | Country not found", event.threadID);
    }
  }
};
