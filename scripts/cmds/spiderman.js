const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "spiderman",
    version: "3.2.0",
    author: "Hridoy",//author cng korle Tor ma re cdmu raja condom lagai 🐍 
    role: 0,
    category: "Tag Fun"
  },

  onStart: async function ({ message, event }) {
    try {
      const mention = Object.keys(event.mentions || []);
      let user1, user2;

      if (mention.length === 0) {
        if (event.type === "message_reply") {
          user1 = event.senderID;
          user2 = event.messageReply.senderID;
        } else {
          return message.reply("❌ Tag or reply someone.");
        }
      } else if (mention.length === 1) {
        user1 = event.senderID;
        user2 = mention[0];
      } else {
        user1 = mention[0];
        user2 = mention[1];
      }

      const file = await createMeme(user1, user2);

      return message.reply(
        {
          body: "🕷️ Spiderman meme generated!",
          attachment: fs.createReadStream(file)
        },
        () => fs.removeSync(file)
      );

    } catch (err) {
      console.error("MAIN ERROR:", err);
      return message.reply("❌ Meme generation failed (check logs).");
    }
  }
};

// ---------------- SAFE FETCH (NO BLIND FAIL) ----------------

async function safeLoadImage(url, label) {
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!res.data || res.data.length < 1000) {
      throw new Error(label + " empty/invalid buffer");
    }

    return await loadImage(Buffer.from(res.data));

  } catch (e) {
    throw new Error(label + " failed: " + e.message);
  }
}

// ---------------- AVATAR ----------------

async function getAvatar(id) {
  const fb = `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

  try {
    return await safeLoadImage(fb, "FB avatar");
  } catch (e) {
    const fallback = `https://api.dicebear.com/7.x/avataaars/png?seed=${id}`;
    return await safeLoadImage(fallback, "Fallback avatar");
  }
}

// ---------------- MEME ENGINE ----------------

async function createMeme(one, two) {
  const cache = path.join(__dirname, "cache");
  if (!fs.existsSync(cache)) fs.mkdirSync(cache);

  const out = path.join(cache, `spiderman_${Date.now()}.png`);

  const bgUrl = "https://i.imgur.com/68pVeTt.jpeg";

  const [av1, av2, bg] = await Promise.all([
    getAvatar(one),
    getAvatar(two),
    safeLoadImage(bgUrl, "Background")
  ]);

  const canvas = createCanvas(1440, 1080);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(bg, 0, 0, 1440, 1080);

  const drawCircle = (img, x, y, size) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x, y, size, size);
    ctx.restore();
  };

  drawCircle(av1, 325, 110, 170);
  drawCircle(av2, 1000, 95, 170);

  const buffer = canvas.toBuffer("image/png");

  fs.writeFileSync(out, buffer);

  return out;
}
