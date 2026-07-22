module.exports = {
 config: {
 name: "segs",
 author: "BADHON",
 version: "2.0",
 role: 2,
 prefix: false,
 usage: "just type svd to see masala🥵",
 description: "Premium adult content provider",
category: "NSFW",
 aliases: ["segsv", "Svd", "sv"],
 guide: { en: "✦ {pn} just type sv to see masala🥵 " },
 },
 
 onStart: async function({ event, message, usersData, args, getLang, role, api }) {
 try {

 api.setMessageReaction("🤫", event.messageID, (err) => {}, true);
 

 const loadingMsg = await message.reply("📥 2 minutes video is loading... Please wait ⏳");
 

 const videos = [
 "https://files.catbox.moe/e364a5.mp4",
 "https://files.catbox.moe/fywdn5.mp4",
 "https://files.catbox.moe/6zft23.mp4",
 "https://files.catbox.moe/4h8p8w.mp4",
 "https://files.catbox.moe/42f2eb.mp4",
 "https://files.catbox.moe/vzuf5e.mp4",
 "https://files.catbox.moe/1gwfdh.mp4",
 "https://files.catbox.moe/clvyaw.mp4",
 "https://files.catbox.moe/svm13z.mp4",
 "https://files.catbox.moe/tbqr63.mp4",
 "https://files.catbox.moe/b95hy0.mp4",
 "https://files.catbox.moe/ft3x34.mp4",
 "https://files.catbox.moe/3cpc2q.mp4",
 "https://files.catbox.moe/sbuef8.mp4",
 "https://files.catbox.moe/dmacm0.mp4",
 "https://files.catbox.moe/cfvlqh.mp4",
 "https://files.catbox.moe/vp2vw5.mp4",
 "https://files.catbox.moe/vaxzy3.mp4",
 "https://files.catbox.moe/3cpc2q.mp4",
 "https://files.catbox.moe/sbuef8.mp4",
 "https://files.catbox.moe/dmacm0.mp4"
 ];
 

 const randomVideo = videos[Math.floor(Math.random() * videos.length)];
 

 const sendVideo = async () => {
 try {

 if (loadingMsg && loadingMsg.messageID) {
 api.unsendMessage(loadingMsg.messageID);
 }
 

 const form = {
 body: "「 HERE IS YOUR SEXY VIDEO BABY , 🥵 」",
 attachment: await global.utils.getStreamFromURL(randomVideo)
 };
 
 await message.reply(form);
 

 api.setMessageReaction("🥵", event.messageID, (err) => {}, true);
 
 } catch (error) {
 console.error("Error sending video:", error);
 message.reply("An error occurred while sending the video.");
 }
 };
 

 setTimeout(sendVideo, 10000);
 
 } catch (error) {
 console.error("Error in segs command:", error);
 message.reply("An error occurred while processing your request.");
 }
 },
 
 onChat: async function({ event, message, usersData, args, getLang, role, api }) {

 if (role === 1 || role === 2) {
 const command = event.body.toLowerCase();
 

 const aliases = ["segs", "segsv", "svd", "sv", "cornyvid"];
 
 if (aliases.includes(command)) {

 const currentTime = Date.now();
 

 if (!this.cooldowns) this.cooldowns = new Map();
 
 const userID = event.senderID;
 const cooldownTime = 60000; 
 
 if (this.cooldowns.has(userID)) {
 const lastUsage = this.cooldowns.get(userID);
 const timeLeft = cooldownTime - (currentTime - lastUsage);
 
 if (timeLeft > 0) {
 const secondsLeft = Math.ceil(timeLeft / 1000);
 return message.reply(`Please wait ${secondsLeft} seconds before using this command again.`);
 }
 }
 

 this.cooldowns.set(userID, currentTime);
 

 this.onStart({ event, message, usersData, args, getLang, role, api });
 }
 }
 }
};