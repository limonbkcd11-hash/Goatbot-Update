const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "girlanime",
    version: "1.0.2",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: "Random Anime Pic",
    longDescription: "Send random anime picture from list",
    category: "Image",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, "randomanime.jpg");

    try {
      fs.ensureDirSync(cacheDir); 

      const imageLinks = [  
        "https://i.imgur.com/qHuv5H8.jpg",  
        "https://i.imgur.com/atYmQt0.jpg",  
        "https://i.imgur.com/Kuz4Owe.jpg",  
        "https://i.imgur.com/L9u9Si8.jpg",  
        "https://i.imgur.com/2oGBtMi.jpg",  
        "https://i.imgur.com/MWihsUp.jpg",  
        "https://i.imgur.com/dPDFYxJ.jpg",  
        "https://i.imgur.com/AiuPHQK.jpg",  
        "https://i.imgur.com/6jKbMGx.jpg",  
        "https://i.imgur.com/H0oXAje.jpg",  
        "https://i.imgur.com/kKKwXkX.jpg",  
        "https://i.imgur.com/F5CLGkl.jpg",  
        "https://i.imgur.com/HKm2LKH.jpg",  
        "https://i.imgur.com/egaTOK5.jpg",  
        "https://i.imgur.com/vLGyXHX.jpg",  
        "https://i.imgur.com/HqJuhTj.jpg",  
        "https://i.imgur.com/VE6KEwT.jpg",  
        "https://i.imgur.com/JLC36Uu.jpg",  
        "https://i.imgur.com/qqt3KI1.jpg",  
        "https://i.imgur.com/yImrkax.jpg",  
        "https://i.imgur.com/sLzPtky.jpg",  
        "https://i.imgur.com/vfCigSS.jpg",  
        "https://i.imgur.com/WYVQRp1.jpg",  
        "https://i.imgur.com/Y1djOm5.jpg",  
        "https://i.imgur.com/e0mPXD9.jpg"  
      ];  

      const randomLink = imageLinks[Math.floor(Math.random() * imageLinks.length)];  

      // Added Headers to mimic a real browser request to prevent Imgur from blocking it
      const response = await axios({  
        url: randomLink,  
        method: "GET",  
        responseType: "stream",
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });  

      const writer = fs.createWriteStream(filePath);  
      response.data.pipe(writer);  

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await message.reply({  
        body: "🌸 𝗚𝗶𝗿𝗹 𝗔𝗻𝗶𝗺𝗲 𝗣𝗶𝗰 🌸",  
        attachment: fs.createReadStream(filePath)  
      });  

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);  
      }

    } catch (error) {  
      // This prints the actual system error in your terminal console
      console.error("--- COMMAND ERROR LOG ---");
      console.error(error.message || error);
      console.error("-------------------------");
      
      message.reply(`❌ Image process failed! Reason: ${error.message || "Unknown error"}`);  
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
};
