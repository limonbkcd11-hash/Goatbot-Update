const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "bear",
    version: "1.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Random bear image" },
    longDescription: { en: "Sends a random bear image" },
    category: "Image",
    guide: { en: "+bear" }
  },

  onStart: async function({ message }) {
    const imgUrl = "https://placebear.com/600/600";
    const filePath = path.join(__dirname, "cache/bear.jpg");
    const file = fs.createWriteStream(filePath);

    https.get(imgUrl, res => {
      res.pipe(file);
      file.on("finish", () => {
        message.reply({
          body: "Here's your Bear image 🐻",
          attachment: fs.createReadStream(filePath)
        });
      });
    }).on("error", () => {
      message.reply("âŒ ð—™ð—®ð—¶ð—¹ð—²ð—± ð˜ð—¼ ð—´ð—²ð˜ ð—¯ð—²ð—®ð—¿ ð—¶ð—ºð—®ð—´ð—².");
    });
  }
};
