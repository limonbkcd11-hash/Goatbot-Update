const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "prayerTimer",
  version: "2.0-fixed",
  role: 0,
  author: "Hridoy",
  description: "নামাজ টাইমে ভিডিও + Random Dua সহ মেসেজ যাবে (No Duplicate)",
  category: "Utility",
  countDown: 5,
};

// 🔐 Credit Protection
if (module.exports.config.author !== "Hridoy") {
  console.log("❌ Credit changed! File stopped.");
  return;
}

module.exports.onLoad = async function ({ api }) {

  // 🔥 24h format use (IMPORTANT FIX)
  const prayerTimes = {
    "05:00": "🕌 ফজরের নামাজের সময় হয়েছে",
    "13:15": "🕌 যোহরের নামাজের সময় হয়েছে",
    "16:30": "🕌 আসরের নামাজের সময় হয়েছে",
    "18:15": "🕌 মাগরিবের নামাজের সময় হয়েছে",
    "20:00": "🕌 এশার নামাজের সময় হয়েছে"
  };

  const duas = [
    "🤲 اللّهُمَّ اغْفِرْ لِي وَارْحَمْنِي\nহে আল্লাহ, আমাকে ক্ষমা করুন ও দয়া করুন",
    "🤲 رَبِّ زِدْنِي عِلْمًا\nহে আমার রব, আমার জ্ঞান বৃদ্ধি করুন",
    "🤲 اللّهُمَّ اهْدِنِي الصِّرَاطَ الْمُسْتَقِيمَ\nহে আল্লাহ, আমাকে সরল পথে পরিচালিত করুন",
    "🤲 رَبَّنَا تَقَبَّلْ مِنَّا\nহে আমাদের রব, আমাদের আমল কবুল করুন",
    "🤲 اللّهُمَّ ارْزُقْنِي حَلَالًا طَيِّبًا\nহে আল্লাহ, আমাকে হালাল রিযিক দান করুন"
  ];

  let lastSent = ""; // 🔥 main fix

  console.log("🕌 Prayer Timer Loaded (No Duplicate)...");

  const checkPrayer = async () => {

    const now = moment().tz("Asia/Dhaka").format("HH:mm");

    // 🔥 Only run if new time (main fix)
    if (prayerTimes[now] && lastSent !== now) {

      lastSent = now;

      const timeNow = moment().tz("Asia/Dhaka").format("hh:mm A");
      const dateNow = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");

      const randomDua = duas[Math.floor(Math.random() * duas.length)];

      const finalMsg =
`━━━━━━━━━━━━━━━━━━
${prayerTimes[now]}
🕒 সময়: ${timeNow}
📅 তারিখ: ${dateNow}
━━━━━━━━━━━━━━━━━━

📿 দোয়া:
${randomDua}

◢◤━━━━━━━━━━━━━━━━◥◣
🤖 ʙᴏᴛ ᴏᴡɴᴇʀ:ʜʀ ɪᴅ ᴏʏ
🤲 সবাই নামাজ আদায় করুন
◥◣━━━━━━━━━━━━━━━━◢◤`;

      try {
        const allThreads = await api.getThreadList(100, null, ["INBOX"]);
        const groupThreads = allThreads.filter(t => t.isGroup);

        const cacheDir = path.join(__dirname, "cache");
        const filePath = path.join(cacheDir, "azan.mp4");

        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir);
        }

        // 🎥 download only once
        if (!fs.existsSync(filePath)) {
          const res = await axios({
            url: "https://files.catbox.moe/gr8zqw.mp4",
            method: "GET",
            responseType: "stream"
          });

          await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);
            res.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
          });
        }

        for (const thread of groupThreads) {
          await api.sendMessage({
            body: finalMsg,
            attachment: fs.createReadStream(filePath)
          }, thread.threadID);
        }

        console.log("✅ নামাজ + দোয়া + আজান পাঠানো হয়েছে");

      } catch (err) {
        console.error("❌ Prayer Timer Error:", err);
      }
    }

    // 🔄 reset everyday
    if (moment().tz("Asia/Dhaka").format("HH:mm") === "00:00") {
      lastSent = "";
    }
  };

  setInterval(checkPrayer, 15000); // fast but safe
};

module.exports.onStart = () => {};
