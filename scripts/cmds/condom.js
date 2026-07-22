const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "condom",
		version: "2.0",
		author: "Hridoy",
		countDown: 5,
		role: 0,
		shortDescription: "Funny condom meme",
		category: "Tag Fun",
		guide: {
			en: "{pn} @mention OR reply"
		}
	},

	onStart: async function ({ event, message }) {
		try {
			let uid;

			if (Object.keys(event.mentions || {}).length > 0) {
				uid = Object.keys(event.mentions)[0];
			} else if (event.messageReply) {
				uid = event.messageReply.senderID;
			} else {
				return message.reply("❌ | Mention or reply someone.");
			}

			const file = await buildImage(uid);

			return message.reply({
				body: "😂 Ops Crazy Condom Fail!",
				attachment: fs.createReadStream(file)
			});

		} catch (err) {
			console.log("ERROR:", err);
			return message.reply("❌ Failed to create image.");
		}
	}
};

async function buildImage(uid) {
	const cache = path.join(__dirname, "cache");
	await fs.ensureDir(cache);

	const output = path.join(cache, `condom_${uid}_${Date.now()}.png`);

	// avatar download
	const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	const avatarRes = await axios.get(avatarURL, { responseType: "arraybuffer" });

	const avatarPath = path.join(cache, `av_${uid}.png`);
	fs.writeFileSync(avatarPath, avatarRes.data);

	// canvas setup
	const canvas = createCanvas(512, 512);
	const ctx = canvas.getContext("2d");

	// background
	const bg = await loadImage("https://i.imgur.com/cLEixM0.jpg");

	// avatar
	const avatar = await loadImage(avatarPath);

	ctx.drawImage(bg, 0, 0, 512, 512);

	// circle avatar
	ctx.save();
	ctx.beginPath();
	ctx.arc(256 + 131.5, 258 + 131.5, 131.5, 0, Math.PI * 2);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(avatar, 256, 258, 263, 263);
	ctx.restore();

	const buffer = canvas.toBuffer("image/png");
	fs.writeFileSync(output, buffer);

	fs.unlinkSync(avatarPath);

	return output;
}