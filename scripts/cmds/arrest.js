const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
	config: {
		name: "arrest",
		aliases: ["jail"],
		version: "1.0",
		author: "Hridoy",
		countDown: 5,
		role: 0,
		shortDescription: "Arrest someone",
		longDescription: "Create arrest image using mention or reply",
		category: "Tag Fun",
		guide: {
			en: "{pn} @mention or reply"
		}
	},

	onStart: async function ({ event, message }) {
		try {
			let targetID;

			if (Object.keys(event.mentions || {}).length > 0)
				targetID = Object.keys(event.mentions)[0];
			else if (event.messageReply)
				targetID = event.messageReply.senderID;
			else
				return message.reply("❌ | Mention someone or reply to a message.");

			const imgPath = await createArrestImage(event.senderID, targetID);

			await message.reply({
				body: "🚔 | You are under arrest!",
				attachment: fs.createReadStream(imgPath)
			});

			setTimeout(() => {
				if (fs.existsSync(imgPath))
					fs.unlinkSync(imgPath);
			}, 5000);

		} catch (err) {
			console.error(err);
			message.reply(`❌ | ${err.message}`);
		}
	}
};

async function createArrestImage(user1, user2) {
	const cacheDir = path.join(__dirname, "cache");
	await fs.ensureDir(cacheDir);

	const output = path.join(cacheDir, `arrest_${Date.now()}.png`);

	const canvas = createCanvas(500, 500);
	const ctx = canvas.getContext("2d");

	const bg = await loadImage("https://i.imgur.com/ep1gG3r.png");

	const av1 = await loadImage(
		`https://graph.facebook.com/${user1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
	);

	const av2 = await loadImage(
		`https://graph.facebook.com/${user2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
	);

	ctx.drawImage(bg, 0, 0, 500, 500);

	drawCircleImage(ctx, av1, 375, 9, 100);
	drawCircleImage(ctx, av2, 160, 92, 100);

	const buffer = canvas.toBuffer("image/png");
	fs.writeFileSync(output, buffer);

	return output;
}

function drawCircleImage(ctx, img, x, y, size) {
	ctx.save();
	ctx.beginPath();
	ctx.arc(
		x + size / 2,
		y + size / 2,
		size / 2,
		0,
		Math.PI * 2
	);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(img, x, y, size, size);
	ctx.restore();
}