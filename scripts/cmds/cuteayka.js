const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "cuteayka",
    version: "4.0.0",
    author: "Hridoy",
    role: 0,
    shortDescription: "Random Ayaka image",
    category: "Image",
    guide: "{pn}",
    cooldown: 5
  },

  onStart: async function ({ api, event }) {

    const links = [
      "https://i.imgur.com/ExdKOOz.png",
      "https://i.imgur.com/ZF6s192.jpeg",
      "https://i.imgur.com/3GvwNBf.jpeg",
      "https://i.imgur.com/uXWLBeC.jpeg",
     "https://i.imgur.com/7Dc9GrN.jpeg",
     "https://i.imgur.com/IaAVMFK.jpeg",
     "https://i.imgur.com/WceNH2z.jpeg",
     "https://i.imgur.com/1XosaEA.jpeg",
         "https://i.imgur.com/uXWLBeC.jpeg",
    "https://i.imgur.com/7Dc9GrN.jpeg",
    "https://i.imgur.com/IaAVMFK.jpeg",
    "https://i.imgur.com/WceNH2z.jpeg",
    "https://i.imgur.com/1XosaEA.jpeg",
    "https://i.imgur.com/M58fVe6.jpeg",
    "https://i.imgur.com/czaXZ3a.jpeg",
    "https://i.imgur.com/xsu6v2I.jpeg",
    "https://i.imgur.com/f17dCCM.jpeg",
    "https://i.imgur.com/opquSuU.jpeg",
    "https://i.imgur.com/U87kL1B.jpeg",
    "https://i.imgur.com/Osa1EEd.jpeg",
    "https://i.imgur.com/38XTSUn.jpeg",
    "https://i.imgur.com/B7mAsZB.jpeg",
    "https://i.imgur.com/2APmfRs.jpeg",
    "https://i.imgur.com/mCUOJ8U.jpeg",
    "https://i.imgur.com/CnN1DxG.jpeg",
    "https://i.imgur.com/onlEme6.jpeg",
    "https://i.imgur.com/OF73muW.jpeg",
    "https://i.imgur.com/UO1sK8I.jpeg",
    "https://i.imgur.com/AlkGMJr.jpeg",
    "https://i.imgur.com/yZy8yvG.jpeg",
    "https://i.imgur.com/wLuwsWH.jpeg",
    "https://i.imgur.com/NoLgneL.jpeg",
    "https://i.imgur.com/wnXPqVv.jpeg",
    "https://i.imgur.com/D4ORkkM.jpeg",
    "https://i.imgur.com/bXZCoXT.jpeg",
    "https://i.imgur.com/ixx7Psr.jpeg",
    "https://i.imgur.com/TWP438b.jpeg",
    "https://i.imgur.com/zEiGsZE.jpeg",
    "https://i.imgur.com/pFbFkvj.jpeg",
    "https://i.imgur.com/U9fPLgz.jpeg",
    "https://i.imgur.com/VjOIoAg.jpeg",
    "https://i.imgur.com/gmYkkFF.jpeg",
    "https://i.imgur.com/4o5MRal.jpeg",
    "https://i.imgur.com/XDGkXfZ.jpeg",
    "https://i.imgur.com/B50Pi6m.jpeg",
      "https://i.imgur.com/BZKVLfn.jpeg",
      "https://i.imgur.com/wSQv7mM.jpeg",
      "https://i.imgur.com/2Ky8mww.jpeg",
      "https://i.imgur.com/4fhxxts.jpeg",
      "https://i.imgur.com/rvFm33m.jpeg",
      "https://i.imgur.com/J2EG5QV.jpeg",
      "https://i.imgur.com/JwkXNeQ.jpeg",
      "https://i.imgur.com/S9AGlH6.jpeg",
      "https://i.imgur.com/L9Jg1pg.jpeg",
      "https://i.imgur.com/urJBEyk.jpeg",
      "https://i.imgur.com/Hpw0D8O.jpeg",
      "https://i.imgur.com/i5hdv5w.jpeg",
      "https://i.imgur.com/O2uymjw.jpeg",
           "https://i.imgur.com/GiSKHaT.jpeg",
           "https://i.imgur.com/dAs2g30.jpeg",
           "https://i.imgur.com/RIhBJhH.jpeg",
           "https://i.imgur.com/pvSpSEb.jpeg",
           "https://i.imgur.com/XUJdz0T.jpeg",
           "https://i.imgur.com/jad2M8w.jpeg",
           "https://i.imgur.com/vbOsMtC.jpeg",
           "https://i.imgur.com/ZTtxhm8.jpeg",
           "https://i.imgur.com/8Qf8hLj.jpeg",
           "https://i.imgur.com/FXGMlHp.jpeg",
           "https://i.imgur.com/jWDw41w.jpeg",
           "https://i.imgur.com/LgvUCju.jpeg",
           "https://i.imgur.com/sdBRGt3.jpeg",
           "https://i.imgur.com/I32E7mo.jpeg",
           "https://i.imgur.com/OBbsiOY.jpeg",
           "https://i.imgur.com/ZlwE7gK.jpeg",
           "https://i.imgur.com/RjTJEia.jpeg",
           "https://i.imgur.com/mihSwWi.jpeg",
           "https://i.imgur.com/XLLJjEM.jpeg",
           "https://i.imgur.com/NkMNc9U.jpeg",
           "https://i.imgur.com/DscSpW9.jpeg",
           "https://i.imgur.com/jA1JB8Z.jpeg",
           "https://i.imgur.com/4744YOK.jpeg",
           "https://i.imgur.com/L7ZmAdP.jpeg",
           "https://i.imgur.com/fnqGUzZ.jpeg",
           "https://i.imgur.com/4r5vG6y.jpeg",
           "https://i.imgur.com/mOZyIBN.jpeg",
           "https://i.imgur.com/5nKPTdH.jpeg",
           "https://i.imgur.com/2DoiyZg.jpeg",
           "https://i.imgur.com/BDvYK5e.jpeg",
           "https://i.imgur.com/JImr4HA.jpeg",
           "https://i.imgur.com/SDYcTdB.jpeg",
           "https://i.imgur.com/GH3rmiF.jpeg",
           "https://i.imgur.com/tUjsJk6.jpeg",
           "https://i.imgur.com/jvjWcZ9.jpeg",
           "https://i.imgur.com/9l5tHki.jpeg",
           "https://i.imgur.com/P4GYTjs.jpeg",
           "https://i.imgur.com/4qXII5h.jpeg",
           "https://i.imgur.com/wix18FM.jpeg",
           "https://i.imgur.com/h6JyuUd.jpeg",
           "https://i.imgur.com/agZEIfN.jpeg",
           "https://i.imgur.com/qQJmQ7X.jpeg",
           "https://i.imgur.com/SJ7tHsd.jpeg",
           "https://i.imgur.com/IWsuHJN.jpeg",
           "https://i.imgur.com/PshaE6A.jpeg",
           "https://i.imgur.com/OvAjaUQ.jpeg",
           "https://i.imgur.com/CW4Id3o.jpeg",
           "https://i.imgur.com/5SWTCJ4.jpeg",
    ];

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const filePath = path.join(cacheDir, `ayaka_${Date.now()}.jpg`);

    try {
      let imgUrl;

      // 🔥 1st priority: API (always works)
      try {
        const apiRes = await axios.get("https://api.waifu.pics/sfw/waifu");
        imgUrl = apiRes.data.url;
      } catch {
        // 🔥 fallback: random link
        imgUrl = links[Math.floor(Math.random() * links.length)];
      }

      // 🔥 download image
      const res = await axios.get(imgUrl, {
        responseType: "arraybuffer",
        timeout: 15000
      });

      fs.writeFileSync(filePath, Buffer.from(res.data));

      await api.sendMessage({
        body: "🌸 Ayaka Photo 💞",
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    } catch (err) {
      console.error("FINAL ERROR:", err);

      // 🔥 LAST fallback (never fails)
      return api.sendMessage({
        body: "🌸 Ayaka Photo 💞",
        attachment: await global.utils.getStreamFromURL("https://picsum.photos/500")
      }, event.threadID, event.messageID);
    }
  }
};
