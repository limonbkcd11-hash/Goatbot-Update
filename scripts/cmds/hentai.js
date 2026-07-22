const A = require("axios");
const F = require("fs");
const P = require("path");

const J = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports = {
  config: {
    name: "hentai",
    version: "0.0.1",
    author: "ArYAN",
    countDown: 15,
    role: 0,
    category: "NSFW"
  },

  onStart: async function ({ api: a, event: e }) {
    const { threadID: t, messageID: m } = e;
    
    a.setMessageReaction("⏳", m, () => {}, true);

    try {
      const rJ = await A.get(J);
      const b = rJ.data.api;

      const res = await A.get(`${b}/hentai`);
      const data = res.data.result;

      if (!data || data.length === 0) throw new Error();

      const v = data[Math.floor(Math.random() * data.length)];

      const cp = P.join(__dirname, "cache", `h_${Date.now()}.mp4`);
      const cd = P.join(__dirname, "cache");
      if (!F.existsSync(cd)) F.mkdirSync(cd);

      const s = await A.get(v.video, { responseType: "arraybuffer" });
      F.writeFileSync(cp, Buffer.from(s.data));

      a.setMessageReaction("✅", m, () => {}, true);

      await a.sendMessage({
        body: `• Title: ${v.title}\n• Category: ${v.category}\n• Views: ${v.view}`,
        attachment: F.createReadStream(cp)
      }, t, () => {
        if (F.existsSync(cp)) F.unlinkSync(cp);
      }, m);

    } catch (err) {
      a.setMessageReaction("❌", m, () => {}, true);
    }
  }
};