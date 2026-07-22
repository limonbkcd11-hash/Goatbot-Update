module.exports = {
  config: {
    name: "nsv",
    version: "2.1",
    author: "Hridoy ✦ NSV",
    countDown: 5,
    role: 0,
    shortDescription: "Naruto Shippuden Verse Guide",
    longDescription: "Naruto Shippuden Verse (NSV) সম্পূর্ণ গাইড",
    category: "Utility"
  },

  onStart: async function ({ message, event }) {
    const menuText = `
╔═══◈ ⛩️ 𝗡𝗦𝗩 𝗚𝗨𝗜𝗗𝗘 ⛩️◈═══╗
┃  Naruto Shippuden Verse
╚════════════════════╝

🔹 নিচের যেকোনো একটি নাম্বার রিপ্লাই করুন 🔹

➊ নিয়মাবলী (Rules)
➋ র‍্যাঙ্কিং সিস্টেম (Ranking)
➌ বিস্তারিত তথ্য (Details)
➍ অফিসিয়াল FB গ্রুপ

✦ শুধু নাম্বার রিপ্লাই করুন (1–4)
`;

    const sentMsg = await message.reply(menuText);

    global.GoatBot.onReply.set(sentMsg.messageID, {
      commandName: "nsv",
      author: event.senderID,
      type: "menu"
    });
  },

  onReply: async function ({ message, event, Reply }) {

    if (event.senderID !== Reply.author)
      return message.reply("⚠️ শুধু কমান্ড ব্যবহারকারীই রিপ্লাই করতে পারবে।");

    const choice = event.body.trim().toLowerCase();

    let title = "";
    let content = "";

    // ===== RULES =====
    if (choice === "1" || choice === "১") {
      title = "⚠️ 𝗡𝗦𝗩 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 𝗥𝗨𝗟𝗘𝗦 ⚠️";
      content = `
"শৃঙ্খলাই আমাদের শক্তি, সম্মানই আমাদের পথ"

⚠️ NSV নিয়মাবলী (সকল সদস্যের জন্য বাধ্যতামূলক):
Nickname সেট করা বাধ্যতামূলক —
মেম্বারদের nickname হবে:
Name (Village) Rank

1.🔸 সম্মান প্রদর্শন করুন — সিনিয়র, অফিসার ও সকল সদস্যের প্রতি শ্রদ্ধাশীল হোন।
2.🔸 অপমান / গালি / অশ্লীলতা নিষিদ্ধ।
3.🔸 Jiraiya-স্টাইল বা কু-চরিত্রের আচরণ নিষিদ্ধ।
4.🔸 ধর্ম, রাজনীতি ও ব্যক্তিগত বিশ্বাস নিয়ে আলোচনা নয়।
5.🔸 যৌন ইঙ্গিতপূর্ণ বা হ্যারাসিং ব্যবহার নিষিদ্ধ।
6.🔸 নারীদের প্রতি সর্বোচ্চ সম্মান বজায় রাখতে হবে।
7.🔸 অনুমতি ছাড়া লিংক/প্রোমোশন নয়।
8.🔸 18+ কনটেন্ট নিষিদ্ধ।
9.🔸 স্প্যাম বা অযথা তর্ক নয়।
10.🔸 “Text Off” হলে মেসেজ নয়।
11.🔸 অতিরিক্ত Unsent নয়।
12.🔸 Village সেটিংস শুধু Supreme/Kage পরিবর্তন করতে পারবে।
13.🔸 ফেক আইডি নিষিদ্ধ।
14.🔸 বাইরের বিষয় নিয়ে বিতর্ক নয়।
15.🔸 Admin/Kage সিদ্ধান্ত চূড়ান্ত।
16.🔸 সমস্যায় Admin/Kage এর সাথে যোগাযোগ করুন।

⚔️ শাস্তির ধরণ:
১মবার: সতর্কবার্তা
২য়বার: নিষেধাজ্ঞা
৩য়বার: সাময়িক ব্যান
৪র্থবার: স্থায়ী বহিষ্কার

"NSV-তে শৃঙ্খলা মানেই শক্তি।"
`;
    }

    // ===== RANKING =====
    else if (choice === "2" || choice === "২") {
      title = "🌀 𝗡𝗦𝗩 𝗡𝗜𝗡𝗝𝗔 𝗥𝗔𝗡𝗞𝗜𝗡𝗚 🌀";
      content = `
TOP LEADERS-
Supreme Shinobi 🥇⚜️
Supreme Assistant 🥈🎗️
Grand Shinobi 🔮✨
External Elite Shinobi 🌟⚜️

VILLAGE LEADERS🏯
Village Kage 👑
Kage Assistant 🛡️
Interaction Captain 🔰

SHINOBI FORCES🥷
Entertainment Officers ✨
Police Force 👮
Elite Jōnin 🖤
Jōnin 🤍
Chūnin ❤️
Genin 💜
Academy Student 🩵
`;
    }

    // ===== DETAILS =====
    else if (choice === "3" || choice === "৩") {
      title = "🌌 𝗡𝗦𝗩 : অ্যানিমে জগতের নতুন অধ্যায় 🌌";
      content = `
NSV হলো একটি পূর্ণাঙ্গ Anime Universe।

🔥 Features:
• Village System
• Rank Progression
• Events & Tournament
• RP System

Genin থেকে কিংবদন্তি হওয়ার যাত্রা শুরু করো।
`;
    }

    // ===== FB GROUP =====
    else if (choice === "4" || choice === "৪") {
      title = "🔗 𝗡𝗦𝗩 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗚𝗥𝗢𝗨𝗣";
      content = `
অফিসিয়াল Facebook গ্রুপে যোগ দিন 👇
আপনার শিনোবি যাত্রা শুরু করুন ⚔️
`;
    }

    else {
      return message.reply("❌ ভুল অপশন!\n১, ২, ৩ অথবা ৪ রিপ্লাই করুন।");
    }

    const finalText = `
━━━━━━━━━━━━━━━━━━
${title}
━━━━━━━━━━━━━━━━━━
${content}
━━━━━━━━━━━━━━━━━━

🔗 𝗡𝗦𝗩 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗙𝗕 𝗚𝗥𝗢𝗨𝗣
https://facebook.com/groups/586145137775514/

━━━━━━━━━━━━━━━━━━
⛩️ 𝗡𝗦𝗩 • শৃঙ্খলাই শক্তি ⛩️
`;

    await message.reply(finalText);

    global.GoatBot.onReply.delete(event.messageReply.messageID);
  }
};