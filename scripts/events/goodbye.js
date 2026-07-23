const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const fontDir = path.join(process.cwd(), "scripts/cmds/assets/font");

// Safe Font Register
let hasCustomFont = false;
function safeRegisterFont(fileName, options) {
    try {
        const fontPath = path.join(fontDir, fileName);
        if (fs.existsSync(fontPath)) {
            registerFont(fontPath, options);
            hasCustomFont = true;
        }
    } catch (e) {
        console.warn(`[GOODBYE] Font missing: ${fileName}`);
    }
}

safeRegisterFont("NotoSans-Bold.ttf", { family: "NotoSans", weight: "bold" });
safeRegisterFont("BeVietnamPro-Bold.ttf", { family: "BeVietnamPro", weight: "bold" });

const FONT_BOLD = hasCustomFont ? "NotoSans" : "sans-serif";

// Imgur Background Images (তোমার দেয়া লিংক)
const imgurLinks = [
    "https://i.imgur.com/qg0BNBz.jpeg",
    "https://i.imgur.com/ho5TjN8.jpeg",
    "https://i.imgur.com/2GTSpzk.jpeg",
    "https://i.imgur.com/PIfFQcP.jpeg",
    "https://i.imgur.com/494Ttnh.jpeg"
];

async function getRandomImgurImage() {
    if (imgurLinks.length === 0) return null;
    const randomUrl = imgurLinks[Math.floor(Math.random() * imgurLinks.length)];
    try {
        const res = await axios.get(randomUrl, { responseType: "arraybuffer" });
        return await loadImage(Buffer.from(res.data));
    } catch (e) {
        console.warn("[GOODBYE] Imgur image load failed");
        return null;
    }
}

async function createGoodbyeCard(userName, threadName, memberCount, kickerName, userID, kickerID, gcImg) {
    const W = 1200, H = 650;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);

    // Random Imgur Background
    const bgImg = await getRandomImgurImage();
    if (bgImg) {
        ctx.globalAlpha = 0.28;
        ctx.drawImage(bgImg, 0, 0, W, H);
        ctx.globalAlpha = 1;
    }

    // Red Gradient Overlay
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "rgba(185, 28, 28, 0.78)");
    grad.addColorStop(1, "rgba(15, 23, 42, 0.92)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    async function loadProfile(url) {
        try {
            const res = await axios.get(url, { responseType: "arraybuffer" });
            return await loadImage(Buffer.from(res.data));
        } catch { return null; }
    }

    const [userImg, kickerImg, groupImg] = await Promise.all([
        loadProfile(`https://graph.facebook.com/${userID}/picture?width=720&height=720`),
        kickerID ? loadProfile(`https://graph.facebook.com/${kickerID}/picture?width=720&height=720`) : null,
        gcImg ? loadProfile(gcImg) : null
    ]);

    function drawCircle(ctx, img, x, y, r, color) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(x, y, r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.clip();
        if (img) ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
        else {
            ctx.fillStyle = "#1f2937";
            ctx.fill();
        }
        ctx.restore();
    }

    // Avatars
    drawCircle(ctx, userImg, 200, 420, 75, "#ef4444");
    if (groupImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(600, 220, 100, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(groupImg, 500, 120, 200, 200);
        ctx.restore();
    }
    if (kickerImg) drawCircle(ctx, kickerImg, 1000, 150, 55, "#b91c1c");

    // Texts
    ctx.textAlign = "center";
    ctx.fillStyle = "#f3e8ff";
    ctx.font = `bold 62px ${FONT_BOLD}`;
    ctx.fillText("GOODBYE", 600, 430);

    ctx.font = `bold 38px ${FONT_BOLD}`;
    ctx.fillStyle = "#fca5a5";
    ctx.fillText(userName.toUpperCase(), 600, 500);

    ctx.font = `600 28px ${FONT_BOLD}`;
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(threadName, 600, 550);

    ctx.font = `500 24px ${FONT_BOLD}`;
    ctx.fillStyle = "#94a3b8";
    
    const kickerText = kickerName ? `Kicked by ${kickerName}` : "Left the group";
    ctx.fillText(`${kickerText} • Now ${memberCount} members`, 600, 590);

    const tempPath = path.join(__dirname, `goodbye_${Date.now()}.png`);
    await fs.writeFile(tempPath, canvas.toBuffer("image/png"));
    return tempPath;
}

module.exports = {
    config: {
        name: "goodbye",
        version: "2.0",
        author: "Hridoy",
        category: "events",
        description: "Auto Goodbye with Imgur background"
    },

    langs: {
        en: {
            defaultGoodbye: "😢 {userName} has left {threadName}\n{action} • Now {memberCount} members"
        }
    },

    onStart: async ({ threadsData, event, message, usersData, getLang }) => {
        if (event.logMessageType !== "log:unsubscribe") return;

        try {
            const threadData = await threadsData.get(event.threadID);
            
            // Default ON থাকবে (যদি false না করা হয়)
            const sendGoodbye = threadData?.settings?.sendGoodbyeMessage !== false;
            if (!sendGoodbye) return;

            const leftUserID = event.logMessageData?.leftParticipantFbId;
            if (!leftUserID) return;

            const isKick = event.author !== leftUserID;
            const kickerID = isKick ? event.author : null;

            const threadName = threadData.threadName || "this group";
            const memberCount = threadData.members?.length || 1;
            const userName = await usersData.getName(leftUserID);
            const kickerName = kickerID ? await usersData.getName(kickerID) : null;

            let imagePath = null;
            try {
                const gcImg = threadData.imageSrc;
                imagePath = await createGoodbyeCard(userName, threadName, memberCount, kickerName, leftUserID, kickerID, gcImg);
            } catch (e) {
                console.error("Card creation error:", e);
            }

            let msg = threadData.data?.goodbyeMessage || getLang("defaultGoodbye");
            msg = msg
                .replace(/\{userName\}/g, userName)
                .replace(/\{threadName\}/g, threadName)
                .replace(/\{memberCount\}/g, memberCount)
                .replace(/\{action\}/g, isKick ? `Kicked by ${kickerName}` : "Left the group");

            const form = {
                body: msg,
                mentions: [{ tag: userName, id: leftUserID }]
            };

            if (imagePath && fs.existsSync(imagePath)) {
                form.attachment = fs.createReadStream(imagePath);
            }

            await message.send(form);

            if (imagePath) {
                setTimeout(() => fs.unlink(imagePath).catch(() => {}), 8000);
            }
        } catch (err) {
            console.error("[GOODBYE] Error:", err);
        }
    }
};
