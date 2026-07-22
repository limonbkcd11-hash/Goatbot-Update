const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "aniwaifu",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Hridoy",
  description: "Random NSFW waifu/trap/neko/blowjob pic",
  commandCategory: "NSFW",
  usages: "aniwaifu [waifu/trap/neko/blowjob] (optional)",
  cooldowns: 5
};

module.exports.onStart = async function({ api, event, args }) {
  // Available NSFW categories we want to use
  const categories = ["waifu", "trap", "neko", "blowjob"];
  
  // If user gave argument → use that, else pick random from our list
  let type = args[0] ? args[0].toLowerCase() : categories[Math.floor(Math.random() * categories.length)];

  // Check if chosen type is valid
  if (!categories.includes(type)) {
    return api.sendMessage(
      `Invalid category! Available: ${categories.join(", ")}\nRandomly selecting one...`,
      event.threadID
    );
    // You can also just force random here instead of error
    // type = categories[Math.floor(Math.random() * categories.length)];
  }

  try {  
    // Fetch random image from API  
    const res = await axios.get(`https://api.waifu.pics/nsfw/${type}`);  
    const imgUrl = res.data.url;  

    if (!imgUrl) throw new Error("No image URL received");

    // Download to temp file  
    const cacheDir = path.join(__dirname, "cache");  
    await fs.ensureDir(cacheDir);  
    const imgPath = path.join(cacheDir, `aniwaifu_\( {type}_ \){Date.now()}.jpg`); // unique name better
    
    const writer = fs.createWriteStream(imgPath);
    const imgRes = await axios.get(imgUrl, { responseType: 'stream' });
    imgRes.data.pipe(writer);  

    await new Promise((resolve, reject) => {  
      writer.on('finish', resolve);  
      writer.on('error', reject);  
    });  

    // Send image  
    api.sendMessage({ 
      body: `Random NSFW **${type}** pic! 😈`, 
      attachment: fs.createReadStream(imgPath) 
    }, event.threadID, () => fs.unlinkSync(imgPath));  

  } catch (err) {  
    console.error(err);
    api.sendMessage(`Error hoise: ${err.message || err}\nTry abar ekbar!`, event.threadID);  
  }
};
