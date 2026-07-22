const fs = require("fs-extra");
const path = require("path");
const https = require("https");

// 🔒 anti double trigger lock
const running = new Set();

module.exports = {
  config: {
    name: "prefix",
    version: "15.3",
    author: "Hridoy",
    description: "Full prefix system with random animation + gif (fixed)",
    category: "Utility"
  },

  onStart: async function ({ message, event, api, args }) {

    const key = event.threadID;
    if (running.has(key)) return;
    running.add(key);
    setTimeout(() => running.delete(key), 5000);

    const prefixFile = path.join(__dirname, "prefixData.json");

    if (!fs.existsSync(prefixFile)) {
      fs.writeFileSync(prefixFile, JSON.stringify({}, null, 2));
    }

    const getPrefix = (threadID) => {
      const data = JSON.parse(fs.readFileSync(prefixFile));
      return data[threadID] || global.GoatBot.config.prefix;
    };

    const setPrefix = (threadID, newPrefix) => {
      const data = JSON.parse(fs.readFileSync(prefixFile));
      data[threadID] = newPrefix;
      fs.writeFileSync(prefixFile, JSON.stringify(data, null, 2));
    };

    // ================= SET PREFIX =================
    if (args[0] === "set") {
      const newPrefix = args[1];

      if (!newPrefix) {
        running.delete(key);
        return message.reply("❌ | Example: prefix set !");
      }

      setPrefix(event.threadID, newPrefix);
      global.GoatBot.config.prefix = newPrefix;

      running.delete(key);
      return message.reply(`✅ Prefix changed successfully!\nNew Prefix: ${newPrefix}`);
    }

    const botPrefix = global.GoatBot.config.prefix || "!";
    const groupPrefix = getPrefix(event.threadID);

    const ping = Date.now() - event.timestamp;
    const day = new Date().toLocaleString("en-US", { weekday: "long" });
    const BOTNAME = global.GoatBot.config.nickNameBot || "KakashiBot";

    // ================= LOADING SETS =================
    const loadingSets = [
      [
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▱▱▱▱▱▱▱▱▱ 10%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▱▱▱▱▱▱▱ 30%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▰▰▱▱▱▱▱ 50%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▰▰▰▰▱▱▱ 70%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▰▰▰▰▰▰▱ 90%",
        "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▰▰▰▰▰▰▰ 100%"
      ],

      [
        "𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙋𝙧𝙚𝙛𝙞𝙭...\n[■□□□□□□□□□] 10%",
        "𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙋𝙧𝙚𝙛𝙞𝙭...\n[■■■□□□□□□□] 30%",
        "𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙋𝙧𝙚𝙛𝙞𝙭...\n[■■■■■□□□□□] 50%",
        "𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙋𝙧𝙚𝙛𝙞𝙭...\n[■■■■■■■□□□] 70%",
        "𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙋𝙧𝙚𝙛𝙞𝙭...\n[■■■■■■■■■□] 90%",
        "𝙇𝙤𝙖𝙙𝙞𝙣𝙜 𝙋𝙧𝙚𝙛𝙞𝙭...\n[■■■■■■■■■■] 100%"
      ],

      [
        "𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝙿𝚛𝚎𝚏𝚒𝚡...\n◉□□□□□□□□□ 10%",
        "𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝙿𝚛𝚎𝚏𝚒𝚡...\n◉◉◉□□□□□□□ 30%",
        "𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝙿𝚛𝚎𝚏𝚒𝚡...\n◉◉◉◉◉□□□□□ 50%",
        "𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝙿𝚛𝚎𝚏𝚒𝚡...\n◉◉◉◉◉◉◉□□□ 70%",
        "𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝙿𝚛𝚎𝚏𝚒𝚡...\n◉◉◉◉◉◉◉◉◉□ 90%",
        "𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝙿𝚛𝚎𝚏𝚒𝚡...\n◉◉◉◉◉◉◉◉◉◉ 100%"
      ]
    ];

    // ================= GIFS =================
    const gifs = [
      "https://i.imgur.com/zex8uo7.gif",
      "https://i.imgur.com/4ki8eBI.gif",
      "https://i.imgur.com/AMKQCJc.gif",
      "https://i.imgur.com/rkjO7YV.gif",
      "https://i.imgur.com/SgNPn8E.gif",
      "https://i.imgur.com/u3qB5y2.gif",
      "https://i.imgur.com/KUFxWlF.gif",
      "https://i.imgur.com/FV9krHV.gif",
      "https://i.imgur.com/lFrFMEn.gif",
      "https://i.imgur.com/KrEez4A.gif"
    ];

    // ================= TEXT FRAMES (STYLISH) =================
    const textFrames = [
`╭─❍ ⟣ 𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗡𝗙𝗢 ⟢ ❍─╮

  ⏱️  𝗣𝗶𝗻𝗴     : ${ping}ms
  📅  𝗗𝗮𝘆      : ${day}
  💠  𝗕𝗼𝘁 𝗣𝗿𝗲𝗳𝗶𝘅 : ${botPrefix}
  💬  𝗚𝗿𝗼𝘂𝗽 𝗣𝗿𝗲𝗳𝗶𝘅 : ${groupPrefix}
  🤖  𝗕𝗼𝘁 𝗡𝗮𝗺𝗲  : ${BOTNAME}

╰─❍ ⟣ 𝗧𝗛𝗔𝗡𝗞  𝗬𝗢𝗨 ⟢ ❍─╯`,

`┏━━━━━━━━━━━━━━━━━━━━┓
┃       ✦ 𝙋𝙍𝙀𝙁𝙄𝙓 𝙎𝙏𝘼𝙏𝙐𝙎 ✦        ┃
┣━━━━━━━━━━━━━━━━━━━━┫
┃ ⏱️  𝙋𝙞𝙣𝙜   ➜ ${ping}ms
┃ 📅  𝘿𝙖𝙮    ➜ ${day}
┃ 💠  𝙋𝙧𝙚𝙛𝙞𝙭  ➜ ${botPrefix}
┃ 💬  𝙂𝙧𝙤𝙪𝙥   ➜ ${groupPrefix}
┃ 🤖  𝘽𝙤𝙩     ➜ ${BOTNAME}
┗━━━━━━━━━━━━━━━━━━━━┛`,

`▁ ▂ ▃ ▄  𝐏𝐑𝐄𝐅𝐈𝐗 𝐈𝐍𝐅𝐎  ▄ ▃ ▂ ▁

  ➤ 𝐏𝐢𝐧𝐠         ⋮ ${ping}ms
  ➤ 𝐃𝐚𝐲          ⋮ ${day}
  ➤ 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞     ⋮ ${BOTNAME}
  ➤ 𝐁𝐨𝐭 𝐏𝐫𝐞𝐟𝐢𝐱   ⋮ ${botPrefix}
  ➤ 𝐆𝐫𝐨𝐮𝐩 𝐏𝐫𝐞𝐟𝐢𝐱 ⋮ ${groupPrefix}

▔ ▔ ▔ ▔ ▔ ▔ ▔ ▔ ▔ ▔ ▔ ▔ ▔ ▔ ▔ ▔`,

`  ⟦ 𝙿 𝚁 𝙴 𝙵 𝙸 𝚇   𝚂 𝚃 𝙰 𝚃 𝚄 𝚂 ⟧

  ⌁ 𝙿𝚒𝚗𝚐          » ${ping}ms
  ⌁ 𝙳𝚊𝚢           » ${day}
  ⌁ 𝙿𝚛𝚎𝚏𝚒𝚡        » ${botPrefix}
  ⌁ 𝙶𝚛𝚘𝚞𝚙 𝙿𝚛𝚎𝚏𝚒𝚡  » ${groupPrefix}

  ⟦ 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 ${BOTNAME} ⟧`
    ];

    // ================= RANDOM SELECT =================
    const randomLoadingSet = loadingSets[Math.floor(Math.random() * loadingSets.length)];
    const randomGifUrl = gifs[Math.floor(Math.random() * gifs.length)];
    const randomText = textFrames[Math.floor(Math.random() * textFrames.length)];

    // ================= LOADING =================
    const msg = await message.reply(randomLoadingSet[0]);

    for (let i = 1; i < randomLoadingSet.length; i++) {
      await new Promise(r => setTimeout(r, 1000));
      api.editMessage(randomLoadingSet[i], msg.messageID);
    }

    await new Promise(r => setTimeout(r, 700));
    api.unsendMessage(msg.messageID);

    // ================= CACHE GIF =================
    const cacheFolder = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

    const gifName = path.basename(randomGifUrl);
    const gifPath = path.join(cacheFolder, gifName);

    if (!fs.existsSync(gifPath)) {
      await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(gifPath);
        https.get(randomGifUrl, res => {
          res.pipe(file);
          file.on("finish", () => file.close(resolve));
        }).on("error", reject);
      });
    }

    running.delete(key);

    return api.sendMessage({
      body: randomText,
      attachment: fs.createReadStream(gifPath)
    }, event.threadID);
  },

  onChat: async function ({ event, message, api }) {
    if (!event.body) return;

    const body = event.body.trim().toLowerCase();

    if (body === "prefix") {
      return this.onStart({ message, event, api, args: [] });
    }

    if (body.startsWith("prefix set ")) {
      const args = body.split(" ");
      return this.onStart({ message, event, api, args });
    }

    if (body === ".") {
      return message.reply("🎀>ιт'ѕ ʝυѕт му ρяєƒιχ");
    }
  }
};
