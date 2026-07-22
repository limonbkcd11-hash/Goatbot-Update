const fs = require("fs-extra");
const axios = require("axios");
const Canvas = require("canvas");
const path = require("path");

module.exports = {
  config: {
    name: "antioutNotify",
    version: "3.0",
    author: "Hridoy Edit",
    category: "events"
  },

  onEvent: async function ({ event, api }) {

    if (event.logMessageType !== "log:unsubscribe") return;

    const userID = event.logMessageData.leftParticipantFbId;
    const threadID = event.threadID;

    // Bot নিজে leave করলে ignore
    if (userID == api.getCurrentUserID()) return;

    try {

      // 1️⃣ Get user name
      const userInfo = await api.getUserInfo(userID);
      const userName = userInfo[userID]?.name || "Unknown User";

      // 2️⃣ Profile picture
      const profileURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const profileBuffer = (await axios.get(profileURL, {
        responseType: "arraybuffer"
      })).data;

      // 3️⃣ Frame image
      const frameURL = "https://i.postimg.cc/BQ5bdybC/retouch-2025100422414510.jpg";
      const frameBuffer = (await axios.get(frameURL, {
        responseType: "arraybuffer"
      })).data;

      // 4️⃣ Canvas setup
      const base = await Canvas.loadImage(frameBuffer);
      const avatar = await Canvas.loadImage(profileBuffer);

      const canvas = Canvas.createCanvas(base.width, base.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

      // 5️⃣ Circular Avatar
      const size = 170;
      const x = 190;
      const y = 150;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, x, y, size, size);
      ctx.restore();

      // 6️⃣ Stylish Text
      ctx.font = "bold 40px Sans";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText(userName, 420, 300);

      // 7️⃣ Save file
      const cachePath = path.join(__dirname, "cache");
      if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

      const imgPath = path.join(cachePath, `goodbye_${userID}.png`);
      fs.writeFileSync(imgPath, canvas.toBuffer());

      // 8️⃣ Send image
      api.sendMessage(
        {
          body: `👋 Goodbye ${userName}!`,
          attachment: fs.createReadStream(imgPath)
        },
        threadID,
        () => fs.unlinkSync(imgPath)
      );

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Goodbye image তৈরি করতে সমস্যা হয়েছে!", threadID);
    }
  }
};
