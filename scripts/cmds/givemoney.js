const money = require("../../utils/money");
// ⚠️ path ঠিক করবি: যদি file modules/commands এ থাকে

module.exports = {
config: {
name: "givemoney",
aliases: ["gm", "takemoney"],
version: "2.1",
author: "Hridoy X AI + SYSTEM",
role: 2,
description: "Admin Money Control (JSON DB)",
category: "Admin",
guide: {
en:
"{pn} @mention 5000 → Give money\n" +
"{pn} me 5000 → Add money to yourself\n" +
"takemoney @mention 5000 → Remove money\n" +
"takemoney me 5000 → Remove your money"
}
},

onStart: async function ({ message, event, args, commandName }) {
const { mentions, senderID } = event;

const formatMoney = (num) => {  
  if (!num) return "0";  
  let n = Number(num);  
  const units = ["", "K", "M", "B", "T"];  
  let unit = 0;  
  while (n >= 1000 && unit < units.length - 1) {  
    n /= 1000;  
    unit++;  
  }  
  return n.toFixed(1).replace(/\.0$/, "") + units[unit];  
};  

if (!args[0] || !args[1])  
  return message.reply("⚠️ Usage:\n.givemoney @user 5000\n.givemoney me 5000");  

const amount = parseInt(args[args.length - 1]);  
if (isNaN(amount) || amount <= 0)  
  return message.reply("⚠️ Amount অবশ্যই valid number হতে হবে।");  

const isTake = commandName === "takemoney";  

let targetIDs = [];  

if (args[0].toLowerCase() === "me") {  
  targetIDs.push(senderID);  
}  
else if (Object.keys(mentions).length > 0) {  
  targetIDs = Object.keys(mentions);  
}  
else {  
  return message.reply("⚠️ কাউকে mention করো অথবা 'me' ব্যবহার করো।");  
}  

let msg = "";  

for (const uid of targetIDs) {  
  const name =  
    uid == senderID  
      ? "You"  
      : mentions[uid]?.replace("@", "") || "User";  

  const currentMoney = await money.get(uid);  

  if (isTake) {  
    if (currentMoney < amount)  
      return message.reply(`❌ ${name} এর কাছে যথেষ্ট টাকা নেই!`);  

    await money.subtract(uid, amount);  
  }  
  else {  
    await money.add(uid, amount);  
  }  

  const newBalance = await money.get(uid);  

  msg += isTake  
    ? `💸 ${name} থেকে ${formatMoney(amount)}$ কেটে নেওয়া হয়েছে\n`  
    : `💰 ${name} কে ${formatMoney(amount)}$ দেওয়া হয়েছে\n`;  

  msg += `🏦 নতুন ব্যালেন্স: ${formatMoney(newBalance)}$\n\n`;  
}  

return message.reply("👑 Admin Money Update 👑\n\n" + msg);

}
};