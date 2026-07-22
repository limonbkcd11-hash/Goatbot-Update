const axios = require("axios");

module.exports.config = {
    name: "maid",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Hridoy (fixed by ChatGPT)",
    description: "Random maid anime image",
    commandCategory: "Image",
    usages: ".maid",
    cooldowns: 5
};

async function fetchMaid(retry = 0) {
    try {
        const res = await axios.get(
            "https://api.waifu.im/images?included_tags=maid&is_nsfw=All&order_by=random",
            { timeout: 15000 }
        );

        return res.data?.items?.[0]?.url;
    } catch (err) {
        if (err.response && err.response.status === 429 && retry < 3) {
            await new Promise(r => setTimeout(r, 2000 * (retry + 1)));
            return fetchMaid(retry + 1);
        }
        throw err;
    }
}

module.exports.onStart = async function ({ api, event }) {
    try {
        const url = await fetchMaid();

        if (!url) {
            return api.sendMessage(
                "❌ Maid image পাওয়া যায়নি, আবার চেষ্টা করো",
                event.threadID,
                event.messageID
            );
        }

        const img = await axios.get(url, {
            responseType: "stream"
        });

        return api.sendMessage(
            {
                body: "💮 Maid Image",
                attachment: img.data
            },
            event.threadID,
            event.messageID
        );

    } catch (e) {
        return api.sendMessage(
            `❌ Error: ${e.message || "Failed to fetch"}`,
            event.threadID,
            event.messageID
        );
    }
};