const { getTime, drive } = global.utils;
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
	config: {
		name: "leave",
		version: "2.0",
		author: "Hridoy",  //credit change korle tor ma re cdmu raja condom lagai 🐍 
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			leaveType1: "tự rời",
			leaveType2: "bị kick",
			defaultLeaveMessage: "{userName} đã {type} khỏi nhóm"
		},
		en: {
			session1: "morning",
			session2: "noon",
			session3: "afternoon",
			session4: "evening",
			leaveType1: "left",
			leaveType2: "was kicked from",
			defaultLeaveMessage: "💔 {userName} {type} the group.\n\n🌸 We'll miss you! Take care and stay safe ✨"
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType == "log:unsubscribe")
			return async function () {
				const { threadID } = event;
				const threadData = await threadsData.get(threadID);
				if (!threadData.settings.sendLeaveMessage)
					return;

				const { leftParticipantFbId } = event.logMessageData;
				if (leftParticipantFbId == api.getCurrentUserID())
					return;

				const hours = getTime("HH");
				const threadName = threadData.threadName;
				const userName = await usersData.getName(leftParticipantFbId);
				const isKicked = leftParticipantFbId != event.author;

				let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;
				const session = hours <= 10 ? getLang("session1") :
					hours <= 12 ? getLang("session2") :
						hours <= 18 ? getLang("session3") : getLang("session4");

				leaveMessage = leaveMessage
					.replace(/\{userName\}/g, userName)
					.replace(/\{type\}/g, isKicked ? getLang("leaveType2") : getLang("leaveType1"))
					.replace(/\{time\}/g, hours)
					.replace(/\{session\}/g, session)
					.replace(/\{threadName\}/g, threadName);

				const cacheDir = path.join(__dirname, "cache");
				let cachePath = null;

				try {
					await fs.ensureDir(cacheDir);

					// Register fonts with Unicode support
					try {
						const fontPaths = [
							{ path: 'C:\\Windows\\Fonts\\seguisb.ttf', family: 'Segoe' },
							{ path: 'C:\\Windows\\Fonts\\segoeui.ttf', family: 'Segoe' },
							{ path: 'C:\\Windows\\Fonts\\arialuni.ttf', family: 'ArialUni' },
							{ path: 'C:\\Windows\\Fonts\\msyh.ttc', family: 'MSYahei' },
							{ path: '/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf', family: 'Noto' },
							{ path: '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', family: 'DejaVu' }
						];

						for (const font of fontPaths) {
							try {
								if (fs.existsSync(font.path)) {
									registerFont(font.path, { family: font.family });
									break;
								}
							} catch (e) {
								continue;
							}
						}
					} catch (fontErr) {
						console.log("Font registration error:", fontErr.message);
					}

					const threadInfo = await api.getThreadInfo(threadID);
					const memberCount = threadInfo.participantIDs.length;

					const canvas = createCanvas(1000, 600);
					const ctx = canvas.getContext('2d');

					// Background system with random Imgur image
					const backgroundList = [
						"https://i.imgur.com/ho5TjN8.jpeg",
						"https://i.imgur.com/PIfFQcP.jpeg",
						"https://i.imgur.com/2GTSpzk.jpeg",
						"https://i.imgur.com/494Ttnh.jpeg",
						"https://i.imgur.com/qg0BNBz.jpeg"
					];

					let bgImage = null;
					const randomBgUrl = backgroundList[Math.floor(Math.random() * backgroundList.length)];

					try {
						const bgResponse = await axios.get(randomBgUrl, { 
							responseType: 'arraybuffer',
							timeout: 8000 
						});
						bgImage = await loadImage(Buffer.from(bgResponse.data));
					} catch (bgErr) {
						console.log("Background load failed, using fallback");
						// Fallback gradient
						const fallbackGrad = ctx.createLinearGradient(0, 0, 1000, 600);
						fallbackGrad.addColorStop(0, '#2a2a3a');
						fallbackGrad.addColorStop(1, '#1a1a2e');
						ctx.fillStyle = fallbackGrad;
						ctx.fillRect(0, 0, 1000, 600);
					}

					if (bgImage) {
						ctx.drawImage(bgImage, 0, 0, 1000, 600);
					}

					// Glass overlay
					ctx.fillStyle = 'rgba(20, 20, 40, 0.68)';
					ctx.fillRect(0, 0, 1000, 600);

					// Subtle noise
					ctx.globalAlpha = 0.06;
					for (let i = 0; i < 800; i++) {
						ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
						ctx.fillRect(Math.random() * 1000, Math.random() * 600, 1, 1);
					}
					ctx.globalAlpha = 1.0;

					// Main premium glass card
					const cardX = 80;
					const cardY = 90;
					const cardW = 840;
					const cardH = 420;
					const radius = 28;

					// Shadow for card
					ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
					ctx.shadowBlur = 32;
					ctx.shadowOffsetX = 6;
					ctx.shadowOffsetY = 10;

					ctx.fillStyle = 'rgba(255, 255, 255, 0.085)';
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
					ctx.lineWidth = 4;

					// Rounded rectangle
					ctx.beginPath();
					ctx.moveTo(cardX + radius, cardY);
					ctx.lineTo(cardX + cardW - radius, cardY);
					ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius);
					ctx.lineTo(cardX + cardW, cardY + cardH - radius);
					ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH);
					ctx.lineTo(cardX + radius, cardY + cardH);
					ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - radius);
					ctx.lineTo(cardX, cardY + radius);
					ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
					ctx.closePath();
					ctx.fill();
					ctx.stroke();

					ctx.shadowBlur = 0;
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;

					// Inner highlight
					ctx.fillStyle = 'rgba(255, 255, 255, 0.11)';
					ctx.beginPath();
					ctx.moveTo(cardX + 15, cardY + 15);
					ctx.lineTo(cardX + cardW - 15, cardY + 15);
					ctx.quadraticCurveTo(cardX + cardW - 8, cardY + 15, cardX + cardW - 8, cardY + 35);
					ctx.lineTo(cardX + 15, cardY + 35);
					ctx.closePath();
					ctx.fill();

					// Avatar section
					const hexSize = 125;
					const hexX = 240;
					const hexY = 290;

					let avatarLoaded = false;
					try {
						const avatarUrl = `https://arshi-facebook-pp.vercel.app/api/pp?uid=${leftParticipantFbId}`;
						const avatarResponse = await axios.get(avatarUrl, { 
							responseType: 'arraybuffer',
							timeout: 7000 
						});
						const avatar = await loadImage(Buffer.from(avatarResponse.data));
						avatarLoaded = true;

						// Hexagon clip
						ctx.save();
						ctx.beginPath();
						for (let i = 0; i < 6; i++) {
							const angle = (Math.PI / 3) * i + (Math.PI / 6);
							const x = hexX + hexSize * Math.cos(angle);
							const y = hexY + hexSize * Math.sin(angle);
							if (i === 0) ctx.moveTo(x, y);
							else ctx.lineTo(x, y);
						}
						ctx.closePath();
						ctx.clip();

						ctx.drawImage(avatar, hexX - hexSize * 1.05, hexY - hexSize * 1.05, hexSize * 2.1, hexSize * 2.1);
						ctx.restore();

					} catch (avatarErr) {
						console.log("Avatar load failed");
						ctx.save();
						ctx.beginPath();
						for (let i = 0; i < 6; i++) {
							const angle = (Math.PI / 3) * i + (Math.PI / 6);
							const x = hexX + hexSize * Math.cos(angle);
							const y = hexY + hexSize * Math.sin(angle);
							if (i === 0) ctx.moveTo(x, y);
							else ctx.lineTo(x, y);
						}
						ctx.closePath();
						ctx.clip();
						ctx.fillStyle = '#334455';
						ctx.fillRect(hexX - hexSize, hexY - hexSize, hexSize * 2, hexSize * 2);
						ctx.restore();
					}

					// Hexagon border (reduced glow)
					ctx.shadowColor = '#8899cc';
					ctx.shadowBlur = 14;
					ctx.strokeStyle = '#aabbff';
					ctx.lineWidth = 6;
					ctx.beginPath();
					for (let i = 0; i < 6; i++) {
						const angle = (Math.PI / 3) * i + (Math.PI / 6);
						const x = hexX + hexSize * Math.cos(angle);
						const y = hexY + hexSize * Math.sin(angle);
						if (i === 0) ctx.moveTo(x, y);
						else ctx.lineTo(x, y);
					}
					ctx.closePath();
					ctx.stroke();

					ctx.shadowBlur = 6;
					ctx.strokeStyle = 'rgba(255,255,255,0.45)';
					ctx.lineWidth = 2.5;
					ctx.beginPath();
					for (let i = 0; i < 6; i++) {
						const angle = (Math.PI / 3) * i + (Math.PI / 6);
						const x = hexX + (hexSize + 12) * Math.cos(angle);
						const y = hexY + (hexSize + 12) * Math.sin(angle);
						if (i === 0) ctx.moveTo(x, y);
						else ctx.lineTo(x, y);
					}
					ctx.closePath();
					ctx.stroke();
					ctx.shadowBlur = 0;

					// GOODBYE text
					ctx.shadowColor = '#e0e8ff';
					ctx.shadowBlur = 12;
					ctx.font = 'bold 68px Segoe, Noto, ArialUni, MSYahei, DejaVu, sans-serif';
					ctx.fillStyle = '#e0e8ff';
					ctx.textAlign = 'left';
					ctx.fillText('GOODBYE', 460, 175);
					ctx.shadowBlur = 0;

					// Divider
					ctx.strokeStyle = 'rgba(160, 180, 255, 0.35)';
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(460, 195);
					ctx.lineTo(880, 195);
					ctx.stroke();

					// Username
					let displayName = userName || "Unknown User";
					ctx.font = 'bold 43px Segoe, Noto, ArialUni, MSYahei, DejaVu, sans-serif';
					const maxNameWidth = 420;
					if (ctx.measureText(displayName).width > maxNameWidth) {
						while (ctx.measureText(displayName + '...').width > maxNameWidth && displayName.length > 3) {
							displayName = displayName.slice(0, -1);
						}
						displayName += '...';
					}

					ctx.shadowColor = '#a0b0ff';
					ctx.shadowBlur = 10;
					ctx.fillStyle = '#ffffff';
					ctx.fillText(displayName, 460, 265);
					ctx.shadowBlur = 0;

					// Leave type
					ctx.font = '500 24px Segoe, Noto, ArialUni, MSYahei, DejaVu, sans-serif';
					ctx.fillStyle = isKicked ? '#ff8a8a' : '#9ce8ff';
					ctx.fillText(isKicked ? 'KICKED FROM GROUP' : 'LEFT THE GROUP', 460, 300);

					// Remaining members
					const memBoxX = 460;
					const memBoxY = 340;
					ctx.fillStyle = 'rgba(255,255,255,0.09)';
					ctx.strokeStyle = 'rgba(160, 190, 255, 0.3)';
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.roundRect(memBoxX, memBoxY, 210, 72, 14);
					ctx.fill();
					ctx.stroke();

					ctx.font = 'bold 13px Segoe, Noto, ArialUni, MSYahei, DejaVu, sans-serif';
					ctx.fillStyle = '#b0c0ff';
					ctx.fillText('REMAINING MEMBERS', memBoxX + 18, memBoxY + 26);

					ctx.font = 'bold 29px Segoe, Noto, ArialUni, MSYahei, DejaVu, sans-serif';
					ctx.fillStyle = '#ffffff';
					ctx.fillText(`👥 ${memberCount}`, memBoxX + 22, memBoxY + 57);

					// Footer + Credit
					ctx.font = '500 21px Segoe, Noto, ArialUni, MSYahei, DejaVu, sans-serif';
					const footerGrad = ctx.createLinearGradient(460, 460, 820, 460);
					footerGrad.addColorStop(0, '#c0d0ff');
					footerGrad.addColorStop(1, '#a0b0ff');
					ctx.fillStyle = footerGrad;
					ctx.fillText("We'll miss you! Take care 💔", 460, 475);

					// Small credit at bottom
					ctx.font = '400 13px Segoe, Noto, ArialUni, MSYahei, DejaVu, sans-serif';
					ctx.fillStyle = 'rgba(180, 190, 255, 0.6)';
					ctx.textAlign = 'right';
					ctx.fillText("Credit: HR ID OY", 880, 555);

					// Save to cache
					cachePath = path.join(cacheDir, `leave_\( {leftParticipantFbId}_ \){Date.now()}.png`);
					const buffer = canvas.toBuffer('image/png');
					await fs.writeFile(cachePath, buffer);

					await message.reply({
						body: leaveMessage,
						attachment: fs.createReadStream(cachePath)
					});

				} catch (error) {
					console.error("Error generating leave card:", error);
					await message.reply(leaveMessage);
				} finally {
					if (cachePath && fs.existsSync(cachePath)) {
						try {
							await fs.unlink(cachePath);
						} catch (cleanupErr) {
							console.error("Cache cleanup error:", cleanupErr.message);
						}
					}
				}
			};
	}
};
