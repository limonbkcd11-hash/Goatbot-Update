const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "bblur",
    version: "1.0.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: "Random Anime Pic",
    longDescription: "Send random anime picture from list",
    category: "Image",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    try {

      const imageLinks = [
        "https://i.postimg.cc/QdzSzcM1/image.jpg",
        "https://i.postimg.cc/QCSJJTPB/ros.jpg",
        "https://i.postimg.cc/3xkF2WZR/Cybergot-Cute-anime-pics-Dark-anime-Anime-monochrome.jpg",
        "https://i.postimg.cc/63XVscx2/Icon.jpg",
        "https://i.postimg.cc/D0YbzdHc/11.jpg",
        "https://i.postimg.cc/nLt9MLRN/12.jpg",
        "https://i.postimg.cc/2601H7kf/zod-ac.jpg",
        "https://i.postimg.cc/g0drmTrW/13.jpg",
        "https://i.postimg.cc/CKN51sff/Pin-on-icons.jpg",
        "https://i.postimg.cc/pr9LsNcD/14.jpg",
        "https://i.postimg.cc/VLCNM8Cw/anime-avatar.jpg",
        "https://i.postimg.cc/Z5my5RD2/15.jpg",
        "https://i.postimg.cc/XqFpVSKn/https-youtube-com-channel-UC3l3cgr-BNj-W5n7de68os-Fnw.jpg",
        "https://i.postimg.cc/dQd1ZFdY/Draincore-Icon-Aesthetic.jpg",
        "https://i.postimg.cc/zXFGpk02/B-L-A-C-K-P-I-N-K-balasultan-krulus-anime-gothic-edits-dp-profile-insta.jpg",
        "https://i.postimg.cc/MGvZ6Jxg/16.jpg",
        "https://i.postimg.cc/76zxz15V/Bbbb.jpg",
        "https://i.postimg.cc/Wp6VP1gh/image.jpg",
        "https://i.postimg.cc/pTfwxs9g/17.jpg",
        "https://i.postimg.cc/ZnjXv0xH/18.jpg",
        "https://i.postimg.cc/vZ4CDYg7/image.jpg",
        "https://i.postimg.cc/PfK74p1z/19.jpg",
        "https://i.postimg.cc/mrQXFtb9/Icon.jpg",
        "https://i.postimg.cc/9MbLJKwF/20.jpg"
      ];

      const randomLink = imageLinks[Math.floor(Math.random() * imageLinks.length)];

      const filePath = path.join(__dirname, "cache", "randomanime.jpg");
      const writer = fs.createWriteStream(filePath);

      const response = await axios({
        url: randomLink,
        method: "GET",
        responseType: "stream"
      });

      response.data.pipe(writer);

      writer.on("finish", async () => {
        await message.reply({
          body: "🌸 𝗔𝗻𝗶𝗺𝗲 𝗣𝗶𝗰 🌸",
          attachment: fs.createReadStream(filePath)
        });
        fs.unlinkSync(filePath);
      });

      writer.on("error", () => {
        message.reply("❌ Image send failed!");
      });

    } catch (error) {
      message.reply("❌ Something went wrong!");
    }
  }
};