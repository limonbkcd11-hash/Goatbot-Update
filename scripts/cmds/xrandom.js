const axios = require("axios");

module.exports.config = {
	name: "xrandom",
  aliases: ["xr"],
	version: "1.0.0",
	hasPermssion: 2,
	credits: "SIFAT",
	description: "Search & instantly download a random video",
	category: "NSFW",
	usages: "[keyword]",
	cooldowns: 20,
	dependencies: { axios: "" }
};

const BASE = "https://xncdi.vercel.app";

const QUALITY_EMOJI = (q = "") =>
	q.includes("1080") ? "🔵" :
	q.includes("720")  ? "🟢" :
	q.includes("480")  ? "🟡" : "🔴";

const truncate = (str = "", max = 60) => str.length > max ? str.slice(0, max) + "…" : str;
const ln = () => "━".repeat(26);
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

const SORTS = ["relevance", "views", "rating", "date"];

module.exports.onStart = async function ({ event, api, args }) {
	const { threadID, messageID } = event;

	if (!args[0]) {
		return api.sendMessage(
			`🎲 𝗫𝗥𝗮𝗻𝗱𝗼𝗺\n${ln()}\n\n` +
			`📌 Usage: xrandom [keyword]\n\n` +
			`💡 Examples:\n` +
			`  xrandom bangla\n` +
			`  xrandom anime\n` +
			`  xrandom hindi\n\n` +
			`⚡ Instantly picks & downloads\na random video — no list needed!`,
			threadID, messageID
		);
	}

	const query = args.join(" ").trim();

	const loadInfo = await new Promise(r =>
		api.sendMessage(
			`🎲 Finding random "${query}" video...\n⏳ Please wait...`,
			threadID, (e, i) => r(i)
		)
	);

	try {
		const randomSort = rand(SORTS);
		const randomPage = Math.floor(Math.random() * 5) + 1;

		const { data: searchData } = await axios.get(`${BASE}/search`, {
			params: { q: query, page: randomPage, sort: randomSort },
			timeout: 20000,
			headers: { "Referer": "https://www.xnxx.com/", "User-Agent": "Mozilla/5.0" }
		});

		let results = searchData.results || [];

		if (!results.length) {
			const { data: fallback } = await axios.get(`${BASE}/search`, {
				params: { q: query, page: 1, sort: "relevance" },
				timeout: 20000,
				headers: { "Referer": "https://www.xnxx.com/", "User-Agent": "Mozilla/5.0" }
			});
			results = fallback.results || [];
		}

		if (!results.length) {
			return api.editMessage(`❌ No results for "${query}"!\nTry a different keyword.`, loadInfo.messageID);
		}

		const picked = rand(results);
		let videoUrl = picked.url?.trim();
		if (!videoUrl.startsWith("http")) videoUrl = "https://" + videoUrl;
		videoUrl = videoUrl.replace(/^https?:\/\/(www\.)?xnxx\.com/, "https://www.xnxx.com");

		api.editMessage(
			`🎲 Picked: ${truncate(picked.title, 50)}\n` +
			`${QUALITY_EMOJI(picked.quality)}${picked.quality || "?"} │ ⏱ ${picked.duration || "?"} │ 👁 ${picked.views || "?"}\n` +
			`⏳ Extracting source...`,
			loadInfo.messageID
		);

		const { data } = await axios.get(`${BASE}/video-source`, {
			params: { url: videoUrl },
			timeout: 30000,
			headers: { "Referer": "https://www.xnxx.com/", "User-Agent": "Mozilla/5.0" }
		});

		const streamUrl = data.best || data.hq || data.lq;
		const tags = (data.tags || []).filter(t => t !== "Edit tags").slice(0, 5);
		const qualities = data.qualities || {};

		const infoText =
			`✅ 𝗥𝗮𝗻𝗱𝗼𝗺 𝗩𝗶𝗱𝗲𝗼\n${ln()}\n` +
			`🎬 ${truncate(data.title || picked.title, 60)}\n` +
			`👤 ${data.uploader || "Unknown"}\n` +
			`⏱ ${data.duration || picked.duration || "?"} │ ⭐ ${data.rating || picked.rating || "?"} │ ${QUALITY_EMOJI(data.quality)}${data.quality || "?"}\n` +
			(tags.length ? `🏷 ${tags.join(", ")}\n` : "") +
			`🔀 Sort: ${randomSort} │ Page: ${randomPage}\n` +
			`⚡ ${data.elapsed_ms || "?"}ms │ 📦 ${data.source || "live"}\n` +
			(Object.keys(qualities).length
				? `${ln()}\n📊 Qualities: ${Object.keys(qualities).join(" │ ")}\n`
				: "") +
			ln();

		if (!streamUrl) {
			return api.editMessage(infoText + "\n❌ No stream URL found!", loadInfo.messageID);
		}

		try {
			api.editMessage(
				`🎲 Picked: ${truncate(data.title || picked.title, 45)}\n` +
				`${QUALITY_EMOJI(data.quality)}${data.quality || "?"} │ ⏱ ${data.duration || "?"}\n` +
				`📥 Downloading...`,
				loadInfo.messageID
			);

			const stream = (await axios.get(streamUrl, {
				responseType: "stream",
				timeout: 120000,
				headers: { "Referer": "https://www.xnxx.com/", "User-Agent": "Mozilla/5.0" }
			})).data;

			await api.sendMessage({ body: infoText, attachment: stream }, threadID, messageID);
			api.unsendMessage(loadInfo.messageID);

		} catch {
			api.editMessage(infoText + `\n\n🔗 Direct Link:\n${streamUrl}`, loadInfo.messageID);
		}

	} catch (err) {
		const status = err.response?.status;
		api.editMessage(
			status === 404 ? "❌ Video source not found! Try again." :
			status === 429 ? "⏳ Rate limited! Wait a moment." :
			err.code === "ECONNABORTED" ? "⌛ Timeout! Try again." :
			`❌ Error: ${err.message}`,
			loadInfo.messageID
		);
	}
};
