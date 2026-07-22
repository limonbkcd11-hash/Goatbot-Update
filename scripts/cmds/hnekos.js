const axios = require("axios");

module.exports.config = {
    name: "hnekos",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Hridoy",
    description: "High quality waifu image",
    commandCategory: "Image",
    cooldowns: 5
};

async function fetch() {
    const res = await axios.get(
        "https://api.waifu.im/images?included_tags=ero&is_nsfw=true&order_by=random"
    );

    return res.data?.images?.[0]?.url;
}

module.exports.onStart = async function ({ api, event }) {
    try {
        const url = await fetch();

        const img = await axios.get(url, { responseType: "stream" });

        return api.sendMessage(
            {
                body: "✨ High Quality Waifu",
                attachment: img.data
            },
            event.threadID,
            event.messageID
        );

    } catch (e) {
        return api.sendMessage(
            "❌ Image fetch failed. Try again.",
            event.threadID,
            event.messageID
        );
    }
};
