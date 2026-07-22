const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../data/bot.json");

module.exports = {
  config: {
    name: "top2",
    version: "3.0",
    author: "Hridoy",
    category: "Game",
    shortDescription: { en: "Money leaderboard" },
    guide: { en: "{pn}" },
    role: 0,
    countDown: 5
  },

  onStart: async function ({ message, usersData }) {

    let db;

    try {
      db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    } catch (e) {
      return message.reply("⚠️ Database error.");
    }

    if (!db.users) {
      return message.reply("⚠️ No users found.");
    }

    let users = [];

    for (const uid in db.users) {

      const money = Number(db.users[uid]?.money || 0);

      let name = "Unknown User";

      try {
        const fetchedName = await usersData.getName(uid);

        // 🔥 FIX: prevent object issue
        if (typeof fetchedName === "string") {
          name = fetchedName;
        } else if (fetchedName?.name) {
          name = fetchedName.name;
        } else {
          name = String(fetchedName);
        }

      } catch {
        name = "Unknown User";
      }

      users.push({
        uid: String(uid),
        name,
        money
      });
    }

    users.sort((a, b) => b.money - a.money);

    let msg = `🏆 MONEY LEADERBOARD 🏆\n━━━━━━━━━━━━━━\n\n`;

    const top = Math.min(10, users.length);

    for (let i = 0; i < top; i++) {
      const u = users[i];

      let rank =
        i === 0 ? "🥇 King" :
        i === 1 ? "🥈 Queen" :
        i === 2 ? "🥉 Elite" :
        `${i + 1}. Member`;

      msg += `${rank}: ${u.name}\n`;
      msg += `🆔 ${u.uid}\n`;
      msg += `💰 $${u.money.toLocaleString()}\n\n`;
    }

    return message.reply(msg);
  }
};