const { createCanvas } = require("canvas");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");

module.exports = {
config: {
name: "up2",
aliases: ["upt2", "uptime2"],
version: "5.0",
author: "SiFu X Upgrade",
role: 0,
countDown: 5,
category: "System",
guide: { en: "{pn}" }
},

onStart: async function ({ api, event }) {

const uptimeBot = process.uptime();
const formatTime = sec => {
const d = Math.floor(sec / 86400);
const h = Math.floor((sec % 86400) / 3600);
const m = Math.floor((sec % 3600) / 60);
const s = Math.floor(sec % 60);
return `${d}d ${h}h ${m}m ${s}s`;
};

// ===== SYSTEM DATA =====
const totalMem = os.totalmem() / 1024 / 1024 / 1024;
const freeMem = os.freemem() / 1024 / 1024 / 1024;
const usedMem = totalMem - freeMem;
const ramPercent = (usedMem / totalMem) * 100;

const cpuModel = os.cpus()[0].model.split('@')[0].trim();
const cores = os.cpus().length;
const ping = Date.now() - event.timestamp;
const nodeVer = process.version;

// ===== SMART STATUS =====
let status = "OPTIMAL";
let statusColor = "#22c55e";

if (ramPercent > 80 || ping > 300) {
status = "CRITICAL";
statusColor = "#ef4444";
} else if (ramPercent > 60 || ping > 150) {
status = "WARNING";
statusColor = "#facc15";
}

// ===== CANVAS =====
const width = 950;
const height = 550;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Background Gradient
const bg = ctx.createLinearGradient(0, 0, width, height);
bg.addColorStop(0, "#0f0c29");
bg.addColorStop(0.5, "#302b63");
bg.addColorStop(1, "#24243e");
ctx.fillStyle = bg;
ctx.fillRect(0, 0, width, height);

// Glow Card
ctx.save();
ctx.shadowColor = "#00f2ff";
ctx.shadowBlur = 50;
ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
ctx.fillRect(60, 60, width - 120, height - 120);
ctx.restore();

// ===== HEADER =====
ctx.fillStyle = "#00f2ff";
ctx.font = "bold 32px sans-serif";
ctx.fillText("⚡ ADVANCED SYSTEM MATRIX ⚡", 100, 120);

ctx.fillStyle = "rgba(255,255,255,0.6)";
ctx.font = "14px sans-serif";
ctx.fillText("Next-Gen Real-Time Monitoring Dashboard", 105, 145);

// ===== LEFT INFO =====
const info = [
`BOT UPTIME : ${formatTime(uptimeBot)}`,
`PING : ${ping} ms`,
`CPU : ${cpuModel}`,
`CORES : ${cores}`,
`NODE : ${nodeVer}`,
`PLATFORM : ${os.platform()} (${os.arch()})`
];

info.forEach((text, i) => {
ctx.fillStyle = "#38bdf8";
ctx.font = "bold 15px sans-serif";
ctx.fillText(text, 110, 200 + (i * 45));
});

// ===== RAM BAR =====
const barX = 560;
const barY = 230;
const barW = 300;
const barH = 30;

ctx.fillStyle = "#00f2ff";
ctx.font = "bold 15px sans-serif";
ctx.fillText(`RAM USAGE (${ramPercent.toFixed(1)}%)`, barX, barY - 20);

ctx.fillStyle = "rgba(255,255,255,0.1)";
ctx.fillRect(barX, barY, barW, barH);

const ramGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
ramGrad.addColorStop(0, "#00f2ff");
ramGrad.addColorStop(1, "#9333ea");
ctx.fillStyle = ramGrad;
ctx.fillRect(barX, barY, barW * (ramPercent / 100), barH);

ctx.fillStyle = "#ffffff";
ctx.font = "13px sans-serif";
ctx.fillText(`${usedMem.toFixed(2)}GB / ${totalMem.toFixed(2)}GB`, barX, barY + 50);

// ===== STATUS CIRCLE =====
const centerX = 720;
const centerY = 400;

ctx.beginPath();
ctx.arc(centerX, centerY, 70, 0, Math.PI * 2);
ctx.strokeStyle = "rgba(255,255,255,0.1)";
ctx.lineWidth = 15;
ctx.stroke();

ctx.beginPath();
ctx.arc(centerX, centerY, 70, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * (ramPercent / 100)));
ctx.strokeStyle = statusColor;
ctx.lineWidth = 15;
ctx.lineCap = "round";
ctx.stroke();

ctx.fillStyle = "#ffffff";
ctx.textAlign = "center";
ctx.font = "bold 22px sans-serif";
ctx.fillText(status, centerX, centerY + 8);

// ===== FOOTER =====
ctx.textAlign = "left";
ctx.fillStyle = "rgba(255,255,255,0.4)";
ctx.font = "12px sans-serif";
ctx.fillText("⚙ Ultra Monitoring Engine by Kakashi", 110, height - 70);

// ===== SAVE & SEND =====
const tempPath = path.join(__dirname, "upt2.png");
const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(tempPath, buffer);

await api.sendMessage(
{
attachment: fs.createReadStream(tempPath)
},
event.threadID,
() => fs.unlinkSync(tempPath)
);

}
};
