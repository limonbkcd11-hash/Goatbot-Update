const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "4k",
		aliases: ["upscale"],
		version: "1.5",
		author: "SIFAT",
		countDown: 15,
		role: 0,
		shortDescription: "AI Image Upscaler",
		longDescription: "Upscale image to 4K using AI API",
		category: "AI",
		guide: "{pn} reply to an image"
	},

	onStart: async function ({ event, message, api }) {
		const { messageReply, type, messageID } = event;

		// Validate image reply
		if (
			type !== "message_reply" ||
			!messageReply ||
			!messageReply.attachments ||
			messageReply.attachments.length === 0 ||
			messageReply.attachments[0].type !== "photo"
		) {
			return message.reply(
`╭━━━〔 🖼️ 4K UPSCALER 〕━━━╮
┃ ⚠️ Reply to an image first
┃ to upscale it to 4K
╰━━━━━━━━━━━━━━━━━━━━━━━╯`
			);
		}

		const imageUrl = messageReply.attachments[0].url;

		const cacheDir = path.join(__dirname, "cache");
		await fs.ensureDir(cacheDir);

		const filePath = path.join(
			cacheDir,
			`upscale_${Date.now()}.png`
		);

		try {
			// ⏳ reaction on start
			await api.setMessageReaction("⏳", messageID, () => {}, true);

			const configURL =
				"https://raw.githubusercontent.com/MYB-SIFU/SIFATChudtese/refs/heads/main/sifatapichudtese.json";

			const configRes = await axios.get(configURL, {
				timeout: 10000
			});

			if (!configRes.data || !configRes.data["4k"]) {
				throw new Error("API config missing");
			}

			const apiURL = `${configRes.data["4k"]}/api/upscale`;

			const res = await axios.post(
				apiURL,
				{ imageUrl },
				{
					responseType: "arraybuffer",
					timeout: 300000
				}
			);

			await fs.writeFile(filePath, Buffer.from(res.data));

			// ✅ reaction on success
			await api.setMessageReaction("✅", messageID, () => {}, true);

			// send image
			await message.reply({
				body: "✨ Here's your image baby 😘✨",
				attachment: fs.createReadStream(filePath)
			});

		} catch (err) {
			console.error("4K UPSCALE ERROR:", err);

			let errorMsg =
`╭━━━〔 ❌ ERROR 〕━━━╮
┃ Upscale failed
┃ Try again later
╰━━━━━━━━━━━━━━━╯`;

			if (err.code === "ECONNABORTED") {
				errorMsg =
`╭━━━〔 ⏱️ TIMEOUT 〕━━━╮
┃ Server took too long
┃ Please try again
╰━━━━━━━━━━━━━━━╯`;
			} else if (err.response) {
				errorMsg =
`╭━━━〔 ⚠️ API ERROR 〕━━━╮
┃ ${err.response.status} ${err.response.statusText}
╰━━━━━━━━━━━━━━━╯`;
			}

			await api.setMessageReaction("❌", messageID, () => {}, true);
			await message.reply(errorMsg);
		} finally {
			setTimeout(async () => {
				try {
					if (await fs.pathExists(filePath)) {
						await fs.remove(filePath);
					}
				} catch {}
			}, 5000);
		}
	}
};
