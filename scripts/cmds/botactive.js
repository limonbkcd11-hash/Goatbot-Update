module.exports = {
	config: {
		name: "botActive",
		version: "1.0",
		author: "Hridoy",
		description: "Notify all groups when bot starts"
	},

	onLoad: async function ({ api }) {
		try {
			// Bot ready হওয়ার জন্য ৫ সেকেন্ড অপেক্ষা
			setTimeout(async () => {
				const threads = await api.getThreadList(100, null, ["INBOX"]);

				for (const thread of threads) {
					if (!thread.isGroup) continue;

					api.sendMessage(
						"🤖 Bot is now actived.\n\n📖 Type .help to see commands.",
						thread.threadID
					);

					// Facebook rate limit এড়াতে
					await new Promise(resolve => setTimeout(resolve, 1000));
				}

				console.log("[BOT ACTIVE] Message sent to all groups.");
			}, 5000);

		} catch (err) {
			console.error("[BOT ACTIVE ERROR]", err);
		}
	}
};
