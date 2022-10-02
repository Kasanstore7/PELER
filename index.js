"use strict";
const { default: makeWASocket, useSingleFileAuthState, downloadContentFromMessage } = require("@adiwajshing/baileys")
const { exec, spawn } = require("child_process");
const { color, bgcolor } = require('./lib/color')
const { getBuffer, fetchJson, fetchText, getRandom, getGroupAdmins, runtime, sleep, reSize, makeid } = require("./lib/myfunc");

// Apinya
const fs = require("fs");
const axios = require("axios");
const chalk = require('chalk');
const api = require("caliph-api");
const hikki = require("hikki-me");
const qs = require("querystring");
const ffmpeg = require("fluent-ffmpeg");
const speed = require("performance-now");
const moment = require("moment-timezone");
const java_script = require("javascript-obfuscator");

// Database
let setting = JSON.parse(fs.readFileSync('./config.json'));
let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'));
let balanceDB = JSON.parse(fs.readFileSync("./db/balance.json"));
let mess = JSON.parse(fs.readFileSync('./database/message.json'));
let antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
let set_done = JSON.parse(fs.readFileSync('./database/set_done.json'));
let pendaftar = JSON.parse(fs.readFileSync('./database/pengguna.json'));
let db_menfes = JSON.parse(fs.readFileSync('./database/menfess.json'));
let set_proses = JSON.parse(fs.readFileSync('./database/set_proses.json'));
let db_respon_list = JSON.parse(fs.readFileSync('./database/respon_list.json'));
let commund = JSON.parse(fs.readFileSync('./database/dashboard/datacmd.json'));
let hitbot = JSON.parse(fs.readFileSync('./database/dashboard/userhit.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/set_left.json'));
let set_welcome_group = JSON.parse(fs.readFileSync('./database/set_welcome.json'));

// Response
const { stalkff, stalkml } = require("./lib/stalker");
const blnc = require("./db/balance");
const _sewa = require("./lib/sewa");
const { ngazap } = require('./storage/virus/bug_bot_wa')
const { addCmd, AddHituser } = require('./lib/hitbot.js')
const { isSetLeft, addSetLeft, removeSetLeft, changeSetLeft, getTextSetLeft } = require('./lib/setleft');
const { isSetDone, addSetDone, removeSetDone, changeSetDone, getTextSetDone } = require('./lib/setdone');
const { addAfkUser, checkAfkUser, getAfkReason, getAfkTime, getAfkId, getAfkPosition } = require("./lib/afk");
const { isSetProses, addSetProses, removeSetProses, changeSetProses, getTextSetProses } = require('./lib/setproses');
const { isSetWelcome, changeSetWelcome, addSetWelcome, removeSetWelcome, getTextSetWelcome } = require("./lib/setwelcome.js");
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./lib/respon-list');


const Exif = require("./lib/exif")
const exif = new Exif()
moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = async(conn, msg, m, setting, store, welcome, _afk, left) => {
try {
let { ownerNumber, botName, ownerName } = setting
let { allmenu } = require('./help')

const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg
if (msg.isBaileys) return
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
const content = JSON.stringify(msg.message)
const from = msg.key.remoteJid
const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
const toJSON = j => JSON.stringify(j, null,'\t')
const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const isOwner = ownerNumber == sender ? true : ["6283805685278@s.whatsapp.net","6283805685278@s.whatsapp.net"].includes(sender) ? true : false
const pushname = msg.pushName
const body = chats.startsWith(prefix) ? chats : ''
const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const isCommand = body.startsWith(prefix);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate
const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.id : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = groupAdmins.includes(sender)
const participants = isGroup ? await groupMetadata.participants : ''
const isUser = pendaftar.includes(sender)
const isAntiLink = antilink.includes(from) ? true : false
const isDeveloper = ["6283805685278@s.whatsapp.net"].includes(sender) ? true
const isAfkOn = checkAfkUser(sender, _afk)
const isWelcome = isGroup ? welcome.includes(from) ? true : false : false
const isLeft = left.includes(from) ? true : false
const quoted = msg.quoted ? msg.quoted : msg
const isSewa = _sewa.checkSewaGroup(from, sewa)

const depositPath = "./db/deposit/"

const isUrl = (url) => {return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))}
function jsonformat(string) {return JSON.stringify(string, null, 2)}
function mentions(teks, mems = [], id) {
if (id == null || id == undefined || id == false) {
let res = conn.sendMessage(from, { text: teks, mentions: mems })
return res } else { let res = conn.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
return res}}

const pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
}
const reply = (teks) => {conn.sendMessage(from, { text: teks }, { quoted: msg })}
const textImg = (teks) => {return conn.sendMessage(from, { text: teks, jpegThumbnail: fs.readFileSync(setting.pathimg) }, { quoted: msg })}
const sendMess = (hehe, teks) => {conn.sendMessage(hehe, { text, teks })}
const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `${jam} WIB`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;BOT-LEXXY,;;;\nFN:${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': fs.readFileSync(setting.pathimg)}}}
function parseMention(text = '') {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}
const sendContact = (jid, numbers, name, quoted, mn) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'END:VCARD'
return conn.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
}

const doc = { 
key: {
fromMe: false, 
participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "" } : {}) 
},
"message": {
"documentMessage": {
"url": "https://mmg.whatsapp.net/d/f/Aj85sbZCtNtq1cJ6JupaBUTKfgrl2zXRXGvVNWAbFnsp.enc",
"mimetype": "application/octet-stream",
"fileSha256": "TSSZu8gDEAPhp8vjdtJS/DXIECzjrSh3rmcoHN76M9k=",
"fileLength": "64455",
"pageCount": 1,
"mediaKey": "P32GszzU5piUZ5HKluLD5h/TZzubVJ7lCAd1PIz3Qb0=",
"fileName": `NeoBot•MD${ngazap(prefix)}`,
"fileEncSha256": "ybdZlRjhY+aXtytT0G2HHN4iKWCFisG2W69AVPLg5yk="
}}}

const isImage = (type == 'imageMessage')
const isVideo = (type == 'videoMessage')
const isSticker = (type == 'stickerMessage')
const isQuotedMsg = (type == 'extendedTextMessage')
const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false 

const sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
let buttonMessage = {
text,
footer,
buttons,
headerType: 2,
...options
}
conn.sendMessage(jid, buttonMessage, { quoted, ...options })
}

const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
mention != undefined ? mention.push(mentionByReply) : []
const mentionUser = mention != undefined ? mention.filter(n => n) : []

const isEmoji = (emo) => {
let emoji_ranges = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
let regexEmoji = new RegExp(emoji_ranges, 'gi');
return emo.match(regexEmoji)
}

function toRupiah(angka) {
var balancenyeini = '';
var angkarev = angka.toString().split('').reverse().join('');
for (var i = 0; i < angkarev.length; i++)
if (i % 3 == 0) balancenyeini += angkarev.substr(i, 3) + '.';
return '' + balancenyeini.split('', balancenyeini.length - 1).reverse().join('');
}

async function downloadAndSaveMediaMessage (type_file, path_file) {
if (type_file === 'image') {
var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]) }
fs.writeFileSync(path_file, buffer)
return path_file } 
else if (type_file === 'video') {
var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
fs.writeFileSync(path_file, buffer)
return path_file
} else if (type_file === 'sticker') {
var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
fs.writeFileSync(path_file, buffer)
return path_file
} else if (type_file === 'audio') {
var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
fs.writeFileSync(path_file, buffer)
return path_file}
}

// Anti Link
let handler = async (m, { conn, command, text }) => {
await conn.sendMessage(m.chat, { delete: m.key })
}
handler.customPrefix = /chat.whatsapp.com/i
handler.command = new RegExp	
if (isGroup && isAntiLink && isBotGroupAdmins){
if (chats.match(/(https:\/\/chat.whatsapp.com)/gi)) {
if (!isBotGroupAdmins) return reply('Untung bot bukan admin')
if (isOwner) return reply('Untung lu owner :v')
if (isGroupAdmins) return reply('Admin grup mah bebas ygy')
reply(`*「 GROUP LINK DETECTOR 」*\n\nSepertinya kamu mengirimkan link grup, maaf kamu akan di kick`)
conn.groupParticipantsUpdate(from, [sender], "remove")
}
}
	
// Response Addlist
if (!isCmd && isGroup && isAlreadyResponList(from, chats, db_respon_list)) {
var get_data_respon = getDataResponList(from, chats, db_respon_list)
if (get_data_respon.isImage === false) {
conn.sendMessage(from, { text: sendResponList(from, chats, db_respon_list) }, {
quoted: msg
})
} else {
conn.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
quoted: msg
})
}
}

// Auto Registrasi
if (isCmd && !isUser) {
pendaftar.push(sender)
fs.writeFileSync('./database/pengguna.json', JSON.stringify(pendaftar, null, 2))
}

const cekUser = (satu, dua) => { 
let x1 = false
Object.keys(db_menfes).forEach((i) => {
if (db_menfes[i].id == dua){x1 = i}})
if (x1 !== false) {
if (satu == "id"){ return db_menfes[x1].id } 
if (satu == "status"){ return db_menfes[x1].status } 
if (satu == "teman"){ return db_menfes[x1].teman } 
if (satu == "gender"){ return db_menfes[x1].gender }
}
if (x1 == false) { return null } 
}

const setUser = (satu, dua, tiga) => { 
let x1 = false
Object.keys(db_menfes).forEach((i) => {
if (db_menfes[i].id == dua){x1 = i}})
if (x1 !== false) {
if (satu == "±id"){ db_menfes[x1].id = tiga
fs.writeFileSync('./database/pengguna.json', JSON.stringify(db_menfes))} 
if (satu == "±status"){ db_menfes[x1].status = tiga
fs.writeFileSync('./database/pengguna.json', JSON.stringify(db_menfes))} 
if (satu == "±teman"){ db_menfes[x1].teman = tiga
fs.writeFileSync('./database/pengguna.json', JSON.stringify(db_menfes))} 
if (satu == "±gender"){ db_menfes[x1].gender = tiga 
fs.writeFileSync('./database/pengguna.json', JSON.stringify(db_menfes))} 
} 
if (x1 == false) { return null }}

let teman = []
Object.keys(db_menfes).forEach((i) => {
if (db_menfes[i].teman == false){
if (db_menfes[i].id !== sender){
teman.push(db_menfes[i].id)
}}})

const pasangan = teman[Math.floor(Math.random() * (teman.length))]


//Auto Block Nomor Luar Negeri
if (sender.startsWith('212')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('91')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('92')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('90')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('54')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('55')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('40')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('94')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('60')) {
return conn.updateBlockStatus(sender, 'block')
}
                // Response Deposit Button
                if (isButton === "payment_gopay") {
                  if (!fs.existsSync(depositPath + sender.split("@")[0] + ".json")) {
                    var deposit_object = {
                      ID: require("crypto").randomBytes(5).toString("hex").toUpperCase(),
                      session: "amount",
                      date: new Date().toLocaleDateString("ID", { timeZone: "Asia/Jakarta"}),
                      number: sender,
                      payment: "GOPAY",
                      data: {
                        amount_deposit: ""
                      }
                    }
                    fs.writeFileSync(depositPath + sender.split("@")[0] + ".json", JSON.stringify(deposit_object, null, 2))
                    reply("Oke kak, mau deposit berapa?\n\nContoh: 50000")
                 } else {
                   reply("Proses Deposit kamu masih ada yang belum terselesaikan")
                 }
               } else if (isButton === "payment_dana") {
                 if (!fs.existsSync(depositPath + sender.split("@")[0] + ".json")) {
                   var deposit_object = {
                      ID: require("crypto").randomBytes(5).toString("hex").toUpperCase(),
                      session: "amount",
                      date: new Date().toLocaleDateString("ID", { timeZone: "Asia/Jakarta"}),
                      number: sender,
                      payment: "DANA",
                      data: {
                        amount_deposit: ""
                      }
                    }
                    fs.writeFileSync(depositPath + sender.split("@")[0] + ".json", JSON.stringify(deposit_object, null, 2))
                    reply("Oke kak, mau deposit berapa?\n\nContoh: 50000")
                  } else {
                    reply("Proses Deposit kamu masih ada yang belum terselesaikan")
                  }
               }

               if (fs.existsSync(depositPath + sender.split("@")[0] + ".json")) {
                 if (!chats.startsWith(prefix) && !msg.key.fromMe) {
                   let data_deposit = JSON.parse(fs.readFileSync(depositPath + sender.split("@")[0] + ".json"))
                   if (data_deposit.session === "amount") {
                     if (isNaN(chats)) return reply("Masukan hanya angka ya")
                     data_deposit.data.amount_deposit = Number(chats);
                     if (data_deposit.data.amount_deposit < 10000) return reply(`Minimal Rp 10.000`)
                     data_deposit.session = "konfirmasi_deposit";
                     fs.writeFileSync(depositPath + sender.split("@")[0] + ".json", JSON.stringify(data_deposit, null, 3));
                     reply(`📝 *DEPOSIT-USER* 📝

*ID:* ${data_deposit.ID}
*Nomer:* ${data_deposit.number.split('@')[0]}
*Payment:* ${data_deposit.payment}
*Jumlah Deposit:* Rp ${toRupiah(data_deposit.data.amount_deposit)}
*Pajak:* Rp 2.500
*Total Pembayaran:* Rp ${toRupiah(data_deposit.data.amount_deposit+2500)}

Apakah data tersebut sudah benar? akan gagal apabila terdapat kesalahan input.

_Ketik Y untuk melanjutkan, N untuk membatalkan_`)
                   } else if (data_deposit.session === "konfirmasi_deposit") {
                     if (chats.toLowerCase() === "y") {
                       if (data_deposit.payment === "GOPAY") {
                         reply(`💎 *PAYMENT-GOPAY* 💎

*Nomer:* ${setting.payment.gopay.nomer}
*AN:* ${setting.payment.gopay.atas_nama}

_Silahkan transfer dengan no yang sudah tertera, Jika sudah harap kirim bukti poto dengan caption *#bukti* untuk di acc oleh admin_`)
                       } else if (data_deposit.payment === "DANA") {
                         reply(`💎 *PAYMENT-DANA* 💎

*Nomer:* ${setting.payment.dana.nomer}
*AN:* ${setting.payment.dana.atas_nama}

_Silahkan transfer dengan no yang sudah tertera, Jika sudah harap kirim bukti poto dengan caption *#bukti* untuk di acc oleh admin_`)
                       }
                     } else if (chats.toLowerCase() === "n") {
                       reply(`Baik kak, Deposit Dengan ID : ${data_deposit.ID} dibatalkan 😊`)
                       fs.unlinkSync(depositPath + sender.split('@')[0] + '.json')
                     }
                   }
                 }
               }

               // Accept / Reject Deposit
               if (isButton === "acc_deposit") {
                 let data_deposit = JSON.parse(fs.readFileSync(depositPath + msg.message.buttonsResponseMessage.contextInfo.quotedMessage.buttonsMessage.imageMessage.caption.split('wa.me/')[1].split('*Payment:*')[0].trim() + '.json'))
                 blnc.addBalance(data_deposit.number, data_deposit.data.amount_deposit, balanceDB)
                 var text_sukses = `*DEPOSIT-SUKSES*

*ID:* ${data_deposit.ID}
*Nomer:* wa.me/${data_deposit.number.split('@')[0]}
*Payment:* ${data_deposit.payment}
*Tanggal:* ${data_deposit.date.split(' ')[0]}
*Jumlah Depo:* Rp ${toRupiah(data_deposit.data.amount_deposit)}`
                 reply(text_sukses)
                 conn.sendMessage(data_deposit.number, { text: `${text_sukses}\n\n_Depositmu telah dikonfirmasi oleh admin, silahkan cek saldo dengan cara *#me*_`})
                 fs.unlinkSync(depositPath + data_deposit.number.split('@')[0] + ".json")
               } else if (isButton === "reject_deposit") {
                 let data_deposit = JSON.parse(fs.readFileSync(depositPath + msg.message.buttonsResponseMessage.contextInfo.quotedMessage.buttonsMessage.imageMessage.caption.split('wa.me/')[1].split('*Payment:*')[0].trim() + '.json'))
                 reply(`Sukses Reject Deposit dengan ID : ${data_deposit.ID}`)
                 conn.sendMessage(data_deposit.number, { text: `Maaf Deposit Dengan ID : ${data_deposit.ID} DiReject, Silahkan hubungin Owner\n\nwa.me/${ownerNumber.split('@')[0]}`})
                 fs.unlinkSync(depositPath + data_deposit.number.split('@')[0] + ".json")
               }

 // Function for AFK
if (isGroup && !isBaileys && !fromMe) {
if (mentioned.length !== 0) {
for (let ment of mentioned) {
if (checkAfkUser(ment, _afk)) {
const getId = afk.getAfkId(ment, _afk)
const getReason = afk.getAfkReason(getId, _afk)
const getTime = Date.now() - afk.getAfkTime(getId, _afk)
const heheh = ms(getTime)
await reply(`@${ment.split('@')[0]} sedang afk\n\n*Alasan :* ${getReason}\n*Sejak :* ${heheh.hours} Jam, ${heheh.minutes} Menit, ${heheh.seconds} Detik lalu`)
}}}

if (checkAfkUser(sender, _afk)) {
_afk.splice(getAfkPosition(sender, _afk), 1)
fs.writeFileSync('./database/afk.json', JSON.stringify(_afk, null, 2))
await mentions(`@${sender.split('@')[0]} telah kembali`, [sender], true)
}}

let addHit = (sender, command) => {
hitbot.push({
"id": sender,
"command": command
})
fs.writeFileSync('./database/dashboard/userhit.json', JSON.stringify(hitbot))
}

// Sewa
_sewa.expiredCheck(conn, sewa)

// Console Logs
if (isCmd && !fromMe) {console.log("[" + chalk.green(" CMD ") + "]" + chalk.yellow("=") + "[ " + chalk.green(`${pushname}`) + " ]" + chalk.yellow("=") + "[ " + chalk.green(`${prefix+command}`) + " ]" + chalk.yellow("=") + "[ " + chalk.green(`${jam}`) + " ]"  )}

let teks_menu =`▻►▻►▻►▻►▻►▻►▻►▻►
╭───[ *${setting.botName}* ]
│• Library : *Baileys-MD*.
│•️ Waktu : ${tanggal}
│• Jam : ${jam}
│• Creator : ${ownerName}
│• Bot Name : ${botName}
│• Pengguna : ${pendaftar.length}
╰─────────────────
▻►▻►▻►▻►▻►▻►▻►▻►
╭───[ *INFO USER* ]
│• Name : ${pushname}
│• Tag : @${sender.split("@")[0]}
│• Saldo : Rp${toRupiah(blnc.checkBalance(sender, balanceDB))}
╰─────────────────
${allmenu(prefix)}
▻►▻►▻►▻►▻►▻►▻►▻►
╭───[ *THANKS TO* ]
│ ≻ _@Adiwajshing_
│ ≻ _@Anabot_
│ ≻ _@MYpartner_
│ ≻ _@MyOrtu__
│ ≻ _@MyGod_
╰─────────────────
▻►▻►▻►▻►▻►▻►▻►▻►
_*Runtime Bot :*_
${runtime(process.uptime())}
▻►▻►▻►▻►▻►▻►▻►▻►`

// INI CASE NYA
switch(command) {
case 'menu':{
let anu_pc = await store.chats.all().filter(v => v.id.endsWith('.net')).map(v => v)

let ini_timestampp = speed()
let ini_latensii = speed() - ini_timestampp
let button_menu = [
{ buttonId: `${prefix}owner`, buttonText: { displayText: 'owner' }, type: 1 },
{ buttonId: `${prefix}ping`, buttonText: { displayText: 'speed' }, type: 1 },
{ buttonId: `${prefix}gc_wa`, buttonText: { displayText: 'group' }, type: 1 }
]
const ini_message_Menu = {
image: await reSize(setting.pathimg, 300, 200),
caption: teks_menu,
footer: setting.footer,
buttons: button_menu,
headerType: 4
}
const sendMsg = await conn.sendMessage(from, ini_message_Menu, { quoted: fkontak })
}
break
case 'grupwa':
case 'groupwa':
case 'gc_wa':{
reply('https://chat.whatsapp.com/GeWPLmclHaF0GymCcJxz\n\n*Join Grub OFC bot !!*\n\n_*ADMIN READY :*_\n_Moga Betah')
}
break
case 'listgc': {
let anu = await store.chats.all().filter(v => v.id.endsWith('@g.us')).map(v => v.id)
let teks = `     「 List Group Chat 」\n\nTotal List Group Bot : ${anu.length}`
for (let i of anu) {
 let metadata = await conn.groupMetadata(i)
 if (metadata.owner === "undefined") {
var loldd = false
 } else {
var loldd = metadata.owner
 }
 teks += `\n\nName : ${metadata.subject ? metadata.subject : "undefined"}\nOwner : ${loldd ? '@' + loldd.split("@")[0] : "undefined"}\nID : ${metadata.id ? metadata.id : "undefined"}\nDibuat : ${metadata.creation ? moment(metadata.creation * 1000).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss') : "undefined"}\nMember : ${metadata.participants.length ? metadata.participants.length : "undefined"}`
}
reply(teks)
}
break
case 'listpc': {
let anu = await store.chats.all().filter(v => v.id.endsWith('.net')).map(v => v)
let teks = `     「 List Personal Chat 」\n\nTotal Chat Pribadi : ${anu.length}`
for (let i of anu) {
 teks += `\n\nProfile : @${i.id.split('@')[0]}\nChat : ${i.unreadCount}\nLastchat : ${moment(i.conversationTimestamp * 1000).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss")}`
}
reply(teks)
}
break
case 'sc':case 'script':
reply('*MAU SCRIPT BOT?*\n*_Chat Wa_*\nWa.me/6283805685278\n*Harga Rp.35.000*\n\n_Owner Juga Ready Jadibot Tinggal Scan Harga Rp50.000 Permanen_')
break
case 'source_code':let text_source =`━━━[ *SOURCE-CODE* ]━━━
• _Pengembang : SaxiaBotz [Mrcl]_
• _Whatsapp : 083805685278_
• _Youtube : Mamlas ga ada yg subrek_
• _Script Bot : .sc_
━━━━━━━━━━━━━━━━━━━`
reply(text_source)
break
case 'hit_global':{
var res = await fetchJson(`https://api.countapi.xyz/hit/Lexxy/visits`)
reply(`*HIT GLOBAL ${res.value}*`)
}
break
case 'nama_lu':
reply(pushname)
break
case 'nomor_hp_lu':
reply(sender.split("@")[0])
break
case 'cekuser':{
reply(`${pendaftar.length}`)
}
break
case 'rules':
let text_rules =`━━━「 *RULES-BOT* 」━━━

1. Jangan Spam/Mengeksploitasi Bot
Sanksi: *❎ WARN/SOFT BLOCK*

2. Dilarang Tlpn/Vc Bot
Sanksi: *❎ SOFT BLOCK*

3. Dilarang Culik Bot Ke Grup Kecuali Atas Izin Owner.
Sanksi: *Di pukul owner*

Jika sudah dipahami rules-nya, silakan ketik *#menu* untuk memulai!
Segala kebijakan dan ketentuan *${botName}* di pegang oleh owner dan segala perubahan kebijakan, sewaktu waktu owner berhak mencabut, atau memblokir user(*﹏*)

© Created by ${ownerName}`
reply(text_rules)
break
case 'owner': case 'dev':
sendContact(from, setting.contactOwner, ownerName, msg)
break
case 'tes':{
let ini_tes_text = `*STATUS : BOT ONLINE*\n_${runtime(process.uptime())}_`
reply(ini_tes_text)
}
break
case 'igstalk':{
if (!q) return reply(`_Contoh_\n${prefix+command} username`)
api.search.igstalk(q).then(res => {
if (res.message) return reply(res.message)

let x = res.profile
let z = res.data
let ini_cp_stalkig =`*INSTAGRAM-STALK*
url : ${z.url}
fullname : ${z.fullname}
private : ${z.private}
verified : ${z.verified}
followers : ${z.follower}
following : ${z.following}
connect_fb : ${z.conneted_fb}
timeline : ${z.timeline}
bio : ${z.bio}`
conn.sendMessage(from, { image: { url: x.high }, caption: ini_cp_stalkig}, { quoted: msg})
});
}
break
case "githubstalk":{
if (!q) return reply(`Contoh :\n${prefix+command} Lexxy24`)
reply(mess.wait)
var nama = q
var git = await fetchJson(`https://api.github.com/users/${nama}`)
if (git.message) return reply(git.message)

var tbGit = await getBuffer(git.avatar_url)
let textGitthub =`*STALK-GITHUB*
id : ${git.id}
login : ${git.login}
html_url : ${git.html_url}
type : ${git.type}
admin : ${git.admin}
name : ${git.name}
location : ${git.location}
bio : ${git.bio}
public_repos : ${git.public_repos}
followers : ${git.followers}
following : ${git.following}
created : ${git.created_at}
updated : ${git.updated_at}`
conn.sendMessage(from, { image: tbGit, caption: textGitthub }, {quoted:msg})
}
break
case 'npmstalk':{
if (!q) return reply(`_Contoh :_\n${prefix+command} @adiwajshing/baileys`)
var x = await fetchJson(`https://api.popcat.xyz/npm?q=${q}`)
if (x.error) return reply(x.error)
var npm_text =`*NPM STALKER*
name : ${x.name}
version : ${x.version}
description : ${x.description}
author : ${x.author}
author_email : ${x.author_email}
last_published : ${x.last_published}
maintainers : ${x.maintainers}
repository : ${x.repository}

keywords : ${x.keywords}`
reply(npm_text)
}
break
case 'ffstalk':{
if (!q) return reply(`Contoh :\n${prefix+command} 239814337`)
api.search.freefireid(q).then(x=>{
reply(`*nickname :* ${x.result}`)
if (x.message) return reply(x.message)
})
}
break 
case 'mlstalk':
if (!q) return reply(`Contoh :\n${prefix+command} 109088431|2558\n\njika tidak ada balasan bot mungkin id/server salah !!.`)
let myID = q.split('|')[0] ? q.split('|')[0] : q 
let mySER = q.split('|')[1] ? q.split('|')[1] : ''
if (mySER.length <1) return reply(`Harus di isi semua!!\n_Contoh_\n${prefix+command} 109088431|2558`)
const yy = await hikki.game.nickNameMobileLegends(myID, mySER)
reply(`${yy.userName}`)
break
case 'tiktoknowm':
case 'tiktok':{
if (!q) return reply('masukkan link nya')
let p = await api.downloader.tiktok(q)
let nih_cptiktok = ` *TIKTOK DOWNLOADER BY CRIZZY-BOT*

• *Creator:* Lexxy Official
• *Title:* ${p.title}
• *Author:* ${p.author}

Thanks You
`
let buttons_tiktok = [{buttonId: `${prefix}tiktokmp3 ${q}`, buttonText: {displayText: '♫ Audio'}, type: 1}]
let buttonMessage = {
video: { url: p.nowm },
caption: nih_cptiktok,
title: 'TIKTOK DOWNLOADER',
footer: 'Press The Button Below',
buttons: buttons_tiktok,
headerType: 5 }
conn.sendMessage(from, buttonMessage, { quoted: msg })
}
break
case 'tiktokmp3': 
case 'tiktokaudio': {
if (!q) return reply('masukkan link nya')
let aud = await api.downloader.tiktok(q)
let cap_tt = ` *TIKTOK AUDIO*

• *Creator:* Lexxy Official
• *Title:* ${aud.title}
• *Author:* ${aud.author}

Thanks You
`
conn.sendMessage(from, { image: { url: aud.thumbnail }, caption: cap_tt}, { quoted:msg })
conn.sendMessage(from, { audio: { url: aud.audio }, mimetype: 'audio/mpeg', fileName: `${aud.title}.mp3` }, { quoted: msg })
}
break
case 'ytmp4':
case 'ini_videonya':{
if (!q) return reply(`_Contoh_\n${prefix+command} https://youtu.be/PdJnRZRbveE`)
let yt4 = await fetchJson(`https://api-yogipw.herokuapp.com/api/download/ytmp4?url=${q}`)
if (yt4.message) return reply(yt4.message)
let x4 = yt4.result
let text_mp4 = `*YOUTUBE DOWNLOADER*\n\n*≻ Title :* ${x4.title}\n*≻ Views :* ${x4.views}\n*≻ Published :* ${x4.published}\n*≻ Channel : ${x4.channel}*\n*≻ Url Source :* ${q.split(" ")[0]}\n\n_Sedang Mengirim Media..._`
conn.sendMessage(from, { image: { url: x4.thumb }, caption: text_mp4 }, { quoted: msg })
conn.sendMessage(from, { video: { url: x4.url }, caption: 'done!' }, { quoted: msg })
}
break
case 'ytmp3':
case 'ini_musiknya':{
if (!q) return reply(`_Contoh_\n${prefix+command} https://youtu.be/PdJnRZRbveE`)
let yt3 = await fetchJson(`https://api-yogipw.herokuapp.com/api/download/ytmp3?url=${q}`)
if (yt3.message) return reply(yt3.message)
let x3 = yt3.result
let text_mp3 = `*YOUTUBE DOWNLOADER*\n\n*≻ Title :* ${x3.title}\n*≻ Views :* ${x3.views}\n*≻ Published :* ${x3.published}\n*≻ Channel : ${x3.channel}*\n*≻ Url Source :* ${q.split(" ")[0]}\n\n_Sedang Mengirim Media..._`
conn.sendMessage(from, { image: { url: x3.thumb }, caption: text_mp3 }, { quoted: msg })
conn.sendMessage(from, { audio: { url: x3.url }, mimetype: 'audio/mpeg', fileName: `${x3.title}.mp3` }, { quoted:msg })
}
break
case 'nulis':
if (!q) return reply(`Yang Mau Di Tulis Apaan?\n\nContoh :\n${prefix+command} Hello`)
reply(mess.wait)
var tulisan = q
var splitText = tulisan.replace(/(\S+\s*){1,9}/g, '$&\n')
var fixHeight = splitText.split('\n').slice(0, 31).join('\n')
spawn('convert', ['./storage/nulis/buku/buku_sebelum.jpg','-font','./storage/nulis/font/Indie-Flower.ttf','-size','960x1280','-pointsize','23','-interline-spacing','2','-annotate','+128+129',fixHeight,'./storage/nulis/buku/buku_sesudah.jpg'])
.on('error', () => reply('error'))
.on('exit', () => {
conn.sendMessage(from, { image: fs.readFileSync('./storage/nulis/buku/buku_sesudah.jpg')}, {quoted: msg, caption: `Jangan Malas Kak...`})
})
break
case 'play':
if (!q) return reply(`Contoh :\n${prefix+command} preset angel baby`)
let play_nyaa = await fetchJson(`https://api-yogipw.herokuapp.com/api/yt/search?query=${q}`)
let play_link = pickRandom(play_nyaa.result)
let text_play =`*YOUTUBE PLAY*\nTitle : ${play_link.title}\nTimestamp : ${play_link.timestamp}\nDi Upload : ${play_link.ago}\nAuthor : ${play_link.author.name}`
let button_play = [
{ buttonId: `${prefix}ini_musiknya ${play_link.url}`, buttonText: { displayText: "Musik" }, type: 1 },
{ buttonId: `${prefix}ini_videonya ${play_link.url}`, buttonText: { displayText: "Video" }, type: 1 }
]
const ini_message_Play = {
image: await getBuffer(play_link.thumbnail),
caption: text_play,
footer: 'pilih media di bawah ini.',
buttons: button_play,
headerType: 4
}
const sendPlay = await conn.sendMessage(from, ini_message_Play, { quoted: msg })
break
case 'mediafire':
if (!q) return reply(`Contoh :\n${prefix+command} https://www.mediafire.com/file/4jzmc4boquizy0n/HAPUS_CONFIG_FF_MAX.7z/file`)
let { mediafireDl } = require('./lib/mediafire')
let link_nya = q
const result_mediafire = await mediafireDl(link_nya)
let text_mediafire = `*MEDIAFIRE DOWNLOAD*	
Judul : ${result_mediafire[0].nama}
Type : ${result_mediafire[0].mime}
Size : ${result_mediafire[0].size}
Link : ${result_mediafire[0].link}
			
_Sedang Mengirim file._`
reply(text_mediafire)
conn.sendMessage(from, { document : { url : result_mediafire[0].link}, fileName : result_mediafire[0].nama, mimetype: result_mediafire[0].mime }, { quoted : msg }) 
break
case 'gitclone':
if (!q) return reply('Linknya Mana?')
reply(mess.wait)
let res_git = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
let [, user, repo] = q.match(res_git) || []
repo = repo.replace(/.git$/, '')
let ini_url = `https://api.github.com/repos/${user}/${repo}/zipball`
let filename = (await fetch(ini_url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
conn.sendMessage(from, { document: { url: ini_url }, fileName: filename+'.zip', mimetype: 'application/zip' }, { quoted: msg })
break
case 'simi':
if (!q) return reply(`*Contoh* : ${prefix+command} halo`)
fetchJson(`https://api.simsimi.net/v2/?text=${q}&lc=id`)
.then(balas_simi => {reply(balas_simi.success)})
break
case 'tes':
case 'runtime':
let respon_nya = `Runtime : ${runtime(process.uptime())}`
reply(respon_nya)
break
case 'ping':
let ini_timestamp = speed()
let ini_latensi = speed() - ini_timestamp
let text_ping = `Kecepatan Respon ${ini_latensi.toFixed(4)} _Second_`
reply(text_ping)
break
case 'obfus':
case 'obfuscator':
if (!q) return reply(`Kode Js Nya?`)
let ini_kode_jsnya = q
let result_obfus = java_script.obfuscate(`${ini_kode_jsnya}`,
{compact: false, controlFlowFlattening: true, controlFlowFlatteningThreshold: 1, numbersToExpressions: true, simplify: true, stringArrayShuffle: true, splitStrings: true, stringArrayThreshold: 1 });
reply(result_obfus.getObfuscatedCode())
break
case 'tambah':
case 'tambah_kan':
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* tanda *angka*\n\n_Contoh_\n\n${prefix+command} 2 + 2`)
var nilai_one = Number(q.split(" ")[0])
var nilai_two = Number(q.split(" ")[1])
reply(`${nilai_one + nilai_two}`)
break
case 'kurang':
case 'kurang_kan':
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* tanda *angka*\n\n_Contoh_\n\n${prefix+command} 2 + 2`)
var nilai_one = Number(q.split(" ")[0])
var nilai_two = Number(q.split(" ")[1])
reply(`${nilai_one - nilai_two}`)
break
case 'kali':
case 'kali_kan':
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* tanda *angka*\n\n_Contoh_\n\n${prefix+command} 2 + 2`)
var nilai_one = Number(q.split(" ")[0])
var nilai_two = Number(q.split(" ")[1])
reply(`${nilai_one * nilai_two}`)
break
case 'bagi':
case 'bagi_kan':
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* tanda *angka*\n\n_Contoh_\n\n${prefix+command} 2 + 2`)
var nilai_one = Number(q.split(" ")[0])
var nilai_two = Number(q.split(" ")[1])
reply(`${nilai_one / nilai_two}`)
break
case 'translate':
if (!q) return reply(`_Contoh_\n${prefix+command} hai`)
let translate_res = await fetchJson(`https://api-yogipw.herokuapp.com/api/translate?kata=${q}`)
let text_translate =`*TRANSLATE*
*to :* ${translate_res.result.to}
*text :* ${translate_res.result.text}
*typo :* ${translate_res.result.typo}
*from :* ${translate_res.result.from}`
reply(text_translate)
break
case 'cuaca':
if (!q) return reply(`_Contoh_\n${prefix+command} palembang`)
let api_cuaca = '18d044eb8e1c06eaf7c5a27bb138694c'
let unit_cuaca = 'metric'
let nama_kota = q
let cuaca = await fetchJson(`http://api.openweathermap.org/data/2.5/weather?q=${nama_kota}&units=${unit_cuaca}&appid=${api_cuaca}`)
let text_cuaca =`*INFO CUACA*
Nama: ${cuaca.name + "," + cuaca.sys.country}
Longitude: ${cuaca.coord.lon}
Latitude: ${cuaca.coord.lat}
Suhu: ${cuaca.main.temp + " C"}
Angin: ${cuaca.wind.speed + " m/s"}
Kelembaban: ${cuaca.main.humidity + "%"}
Cuaca: ${cuaca.weather[0].main}
Keterangan: ${cuaca.weather[0].description}
Udara: ${cuaca.main.pressure + " HPa"}`
reply(text_cuaca)
break
case 'infogempa':{
let res_gempa = await fetchJson(`https://api-yogipw.herokuapp.com/api/info/gempa`)
let ini_gempa = res_gempa.result
let teks =`*INFO-GEMPA*\n\n`
for (let x of ini_gempa){
teks +=`tanggal : ${x.result.tanggal}\nkoordinat : ${x.result.koordinat}\ngetaran : ${x.result.getaran}\nkedalaman : ${x.result.kedalaman}\nskala : ${x.result.skala}\n\n`
}
reply(teks)
}
break
case 'kodepos':{
if (!q) return reply(`_Contoh_\n${prefix+command} jakarta`)
let ini_kotanya = q
let res_kodepos = await fetchJson(`https://api-yogipw.herokuapp.com/api/info/kodepos?kota=${ini_kotanya}`)
let ini_kodepost = res_kodepos.result.data
let teks =`*KODEPOS*\n\n`
for (let x of ini_kodepost){
teks +=`province : ${x.province}\ncity : ${x.city}\nsubdistrict : ${x.subdistrict}\nurban : ${x.urban}\npostalcode : ${x.postalcode}\n\n`
}
reply(teks)
}
break
case 'covidworld':
let res_covid = await fetchJson(`https://api-yogipw.herokuapp.com/api/info/covidworld`)
let text_covid =`*COVID-WORLD*
totalCases : ${res_covid.result.totalCases}
recovered : ${res_covid.result.recovered}
deaths : ${res_covid.result.deaths}
activeCases : ${res_covid.result.activeCases}
closedCases : ${res_covid.result.closedCases}
lastUpdate : ${res_covid.result.lastUpdate}`
reply(text_covid)
break
case 'ssweb':
if (!q) return reply(`_Contoh_\n${prefix+command} https://www.google.co.uk/`)
let ss_link_nya = await fetchJson(`https://botcahx-rest-api.herokuapp.com/api/tools/ssweb?link=${q}`)
if (ss_link_nya.message) return reply('[!] url tidak di temukan.')
conn.sendMessage(from, { image: ss_link_nya, caption: 'done!' }, { quoted: msg })
break
case 'styletext':{
if (!q) return reply(`_Contoh_\n${prefix+command} Lexxy`)
let style_res = await fetchJson(`https://botcahx-rest-api.herokuapp.com/api/tools/styletext?text=${q}`)
let ini_style = style_res.result
let teks =`*STYLE-TEXT*\n\n`
for (let x of ini_style){
teks +=`result : ${x.result}\n\n`
}
reply(teks)
}
break
case 'tts':
if (!q) return reply(`_Contoh_\n${prefix+command} hallo`)
let tts_res = await fetchJson(`https://botcahx-rest-api.herokuapp.com/api/soundoftext?text=${q}&lang=id-ID`)
conn.sendMessage(from, {audio: { url: tts_res.result }, mimetype:'audio/mpeg', ptt:true }, {quoted:msg})
break
case 'toimg':
if (!isQuotedSticker) return reply(`Reply stikernya!`)
var stream = await downloadContentFromMessage(msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
var buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
var rand1 = 'temp/'+getRandom('.webp')
var rand2 = 'temp/'+getRandom('.png')
fs.writeFileSync(`./${rand1}`, buffer)
if (isQuotedSticker && msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated !== true) {
reply(mess.wait)
exec(`ffmpeg -i ./${rand1} ./${rand2}`, (err) => {
fs.unlinkSync(`./${rand1}`)
if (err) return reply(mess.error.api)
conn.sendMessage(from, {caption: `*Sticker Convert To Image!*`, image: fs.readFileSync(`./${rand2}`) }, { quoted: fkontak })
fs.unlinkSync(`./${rand2}`)
})
} else {
reply(mess.wait)
webp2mp4File(`./${rand1}`).then(async(data) => {
fs.unlinkSync(`./${rand1}`)
conn.sendMessage(from, {caption: `*Sticker Convert To Video!*`, video: await getBuffer(data.data) }, { quoted: fkontak })
})
}
break
case 'sticker': case 's':
if (isImage || isQuotedImage) {
var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
var buffer = Buffer.from([])
for await(const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }
reply(mess.wait)
var rand1 = 'temp/sticker/'+getRandom('.jpg')
var rand2 = 'temp/sticker/'+getRandom('.webp')
fs.writeFileSync(`./${rand1}`, buffer)
ffmpeg(`./${rand1}`)
.on("error", console.error)
.on("end", () => {
exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
conn.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
fs.unlinkSync(`./${rand1}`)
fs.unlinkSync(`./${rand2}`)})}).addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"]).toFormat('webp').save(`${rand2}`)
} else if (isVideo || isQuotedVideo) {
var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
var buffer = Buffer.from([])
for await(const chunk of stream) { buffer = Buffer.concat([buffer, chunk])}
var rand1 = 'temp/sticker/'+getRandom('.mp4')
var rand2 = 'temp/sticker/'+getRandom('.webp')
fs.writeFileSync(`./${rand1}`, buffer)
ffmpeg(`./${rand1}`)
.on("error", console.error)
.on("end", () => {
exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
conn.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
fs.unlinkSync(`./${rand1}`)
fs.unlinkSync(`./${rand2}`)})}).addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"]).toFormat('webp').save(`${rand2}`)
} else {
reply(`Kirim gambar/vidio dengan caption ${prefix+command} atau balas gambar/vidio yang sudah dikirim\nNote : Maximal vidio 10 detik!`)
}
break
case 'broadcast': case 'bc':
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Kirim perintah ${prefix+command} teks`)
let data_orang = await store.chats.all()
let data_teks = `${q}\n© broadcast ${botName}`
for (let i of data_orang) { 
conn.sendMessage(i.id, { text: data_teks })
await sleep(1000)
}
reply(`Sukses mengirim pesan siaran kepada ${data.length} chat`)
break
case 'unblock':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Contoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "unblock") // Unblock user
reply('Sukses Unblock Nomor')
}
break
case 'block':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Contoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "block") // Block user
reply('Sukses Block Nomor')
}
break
case 'creategc':
if (!isOwner) return reply(mess.OnlyOwner)
if (!q) return reply(`*Example :*\n${prefix+command} namagroup`)
var nama_nya = q
let cret = await conn.groupCreate(nama_nya, [])
let response = await conn.groupInviteCode(cret.id)
var teks_creategc = `  「 *Create Group* 」

_*▸ Name : ${cret.subject}*_
_*▸ Owner : @${cret.owner.split("@")[0]}*_
_*▸ Time : ${moment(cret.creation * 1000).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss")} WIB*_

*Link Create Group* :
https://chat.whatsapp.com/${response}
`
reply(teks_creategc)
break
case 'linkgrup': case 'linkgc':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
var url = await conn.groupInviteCode(from).catch(() => reply(mess.error.api))
url = 'https://chat.whatsapp.com/'+url
reply(url)
break
case 'setbiobot':
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
let ini_biobot = q.split(' ')[0] ? q.split(' ')[0] : ''
if (ini_biobot.length <1) return reply(`_Contoh_\n${prefix+command} text`)
conn.setStatus(ini_biobot)
reply('*Sukses mengganti bio bot ✓*')
break
case 'setpp': case 'setppbot':
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (isImage || isQuotedImage) {
var media = await downloadAndSaveMediaMessage('image', 'ppbot.jpeg')
if (args[1] == '\'panjang\'') {
var { img } = await generateProfilePicture(media)
await conn.query({ tag: 'iq', attrs: { to: botNumber, type:'set', xmlns: 'w:profile:picture' },
content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }] })
fs.unlinkSync(media)
reply(`Sukses`)
} else {
var data = await conn.updateProfilePicture(botNumber, { url: media })
fs.unlinkSync(media)
reply(`Sukses`)
}
} else {
reply(`Kirim/balas gambar dengan caption ${prefix+command} untuk mengubah foto profil bot`)
}
break
case 'setnamegc':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *text*\n\n_Contoh_\n\n${prefix+command} Support ${ownerName}`)
await conn.groupUpdateSubject(from, q)
.then( res => {
reply(`Sukses`)
}).catch(() => reply(mess.error.api))
break
case 'setdesc':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *text*\n\n_Contoh_\n\n${prefix+command} New Description by ${ownerName}`)
await conn.groupUpdateDescription(from, q)
.then( res => {
reply(`Sukses`)
}).catch(() => reply(mess.error.api))
break
case 'setppgrup': case 'setppgc':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (isImage || isQuotedImage) {
var media = await downloadAndSaveMediaMessage('image', `ppgc${from}.jpeg`)
if (args[1] == '\'panjang\'') {
var { img } = await generateProfilePicture(media)
await conn.query({ tag: 'iq', attrs: { to: from, type:'set', xmlns: 'w:profile:picture' },
content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }] })
fs.unlinkSync(media)
reply(`Sukses`)
} else {
var data = await conn.updateProfilePicture(from, { url: media })
fs.unlinkSync(media)
reply(`Sukses`)
}
} else {
reply(`Kirim/balas gambar dengan caption ${prefix+command} untuk mengubah foto profil bot`)
}
break
case 'open':
case 'buka_grup':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
conn.groupSettingUpdate(from, 'not_announcement')
reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
break
case 'close':
case 'tutup_grup':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
conn.groupSettingUpdate(from, 'announcement')
reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
break
case 'welcome':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!args[0]) return conn.sendMessage(from, { text: "[ *FITUR WELCOME* ]\n\nPilih di bawah ini", footer: 'klik button..', buttons: [{buttonId: `${prefix + command} on`, buttonText: {displayText: 'ON'}, type: 1}, {buttonId: `${prefix + command} off`, buttonText: {displayText: 'OFF'}, type: 1}],headerType: 1 })
if (args[0] == "on") {
if (isWelcome) return reply(`Welcome sudah aktif`)
welcome.push(from)
fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome, null, 2))
reply(`Sukses mengaktifkan welcome di grup ini`)
}
if (args[0] == "off") {
if (!isWelcome) return reply(`Welcome sudah dimatikan`)
var posi = welcome.indexOf(from)
welcome.splice(posi, 1)
fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome, null, 2))
reply(`Sukses menonaktifkan welcome di grup ini`)
}
break
case 'left':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!args[0]) return conn.sendMessage(from, { text: "[ *FITUR LEFT* ]\n\nPilih di bawah ini", footer: 'klik button..', buttons: [{buttonId: `${prefix + command} on`, buttonText: {displayText: 'ON'}, type: 1}, {buttonId: `${prefix + command} off`, buttonText: {displayText: 'OFF'}, type: 1}],headerType: 1 })
if (args[0] == "on") {
if (isLeft) return reply(`Left sudah aktif`)
left.push(from)
fs.writeFileSync('./database/left.json', JSON.stringify(welcome, null, 2))
reply(`Sukses mengaktifkan left di grup ini`)
}
if (args[0] == "off") {
if (!isLeft) return reply(`Left sudah dimatikan`)
var posi = welcome.indexOf(from)
left.splice(posi, 1)
fs.writeFileSync('./database/left.json', JSON.stringify(welcome, null, 2))
reply(`Sukses menonaktifkan left di grup ini`)
}
break
case 'grup': case 'group':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (isAntiLink) return reply(`antilink sudah aktif`)
if (!args[0]) return conn.sendMessage(from, { text: "[ *GROUP SETTING* ]\n\npilih buka atau tutup", footer: `Group : ${groupName}`, buttons: [{buttonId: `${prefix+command} y`, buttonText: {displayText: 'Open ✅'}, type: 1}, {buttonId: `${prefix+command} n`, buttonText: {displayText: 'Close ❌'}, type: 1}],headerType: 1 })
if (args[0] == "y") {
conn.groupSettingUpdate(from, 'not_announcement')
reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
}
if (args[0] == "n") {
conn.groupSettingUpdate(from, 'announcement')
reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
}
break
case 'delete':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isQuotedMsg) return reply(`Balas chat dari bot yang ingin dihapus`)
if (!quotedMsg.fromMe) return reply(`Hanya bisa menghapus chat dari bot`)
conn.sendMessage(from, { delete: { fromMe: true, id: quotedMsg.id, remoteJid: from }})
break
case 'add':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (groupMembers.length == 257) return reply(`Anda tidak dapat menambah peserta, karena Grup sudah penuh!`)
var mems = []
groupMembers.map( i => mems.push(i.id) )
var number;
if (args.length > 1) {
number = q.replace(/[^0-9]/gi, '')+"@s.whatsapp.net"
var cek = await conn.onWhatsApp(number)
if (cek.length == 0) return reply(`Masukkan nomer yang valid dan terdaftar di WhatsApp`)
if (mems.includes(number)) return reply(`Nomer tersebut sudah berada didalam grup!`)
conn.groupParticipantsUpdate(from, [number], "add")
.then( res => reply(jsonformat(res)))
.catch((err) => reply(jsonformat(err)))
} else if (isQuotedMsg) {
number = quotedMsg.sender
var cek = await conn.onWhatsApp(number)
if (cek.length == 0) return reply(`Peserta tersebut sudah tidak terdaftar di WhatsApp`)
if (mems.includes(number)) return reply(`Nomer tersebut sudah berada didalam grup!`)
conn.groupParticipantsUpdate(from, [number], "add")
.then( res => reply(jsonformat(res)))
.catch((err) => reply(jsonformat(err)))
} else {
reply(`Kirim perintah ${prefix+command} nomer atau balas pesan orang yang ingin dimasukkan`)
}
break
case 'kick':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
var number;
if (mentionUser.length !== 0) {
number = mentionUser[0]
conn.groupParticipantsUpdate(from, [number], "remove")
.then( res => reply(jsonformat(res)))
.catch((err) => reply(jsonformat(err)))
} else if (isQuotedMsg) {
number = quotedMsg.sender
conn.groupParticipantsUpdate(from, [number], "remove")
.then( res => reply(jsonformat(res)))
.catch((err) => reply(jsonformat(err)))
} else {
reply(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
}
break
case 'promote':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (mentionUser.length !== 0) {
conn.groupParticipantsUpdate(from, [mentionUser[0]], "promote")
.then( res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai admin`, [mentionUser[0]], true) })
.catch(() => reply(mess.error.api))
} else if (isQuotedMsg) {
conn.groupParticipantsUpdate(from, [quotedMsg.sender], "promote")
.then( res => { mentions(`Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai admin`, [quotedMsg.sender], true) })
.catch(() => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan member yang ingin dijadikan admin`)
}
break
case 'demote':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (mentionUser.length !== 0) {
conn.groupParticipantsUpdate(from, [mentionUser[0]], "demote")
.then( res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai member biasa`, [mentionUser[0]], true) })
.catch(() => reply(mess.error.api))
} else if (isQuotedMsg) {
conn.groupParticipantsUpdate(from, [quotedMsg.sender], "demote")
.then( res => { mentions(`Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai member biasa`, [quotedMsg.sender], true) })
.catch(() => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan admin yang ingin dijadikan member biasa`)
}
break
case 'leave':
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!isGroup) return reply(mess.OnlyGrup)
conn.groupLeave(from)
reply('bye')
break
case 'revoke':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
await conn.groupRevokeInvite(from)
.then( res => {
reply(`Sukses menyetel tautan undangan grup ini`)
}).catch(() => reply(mess.error.api))
break
case 'tagall':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Teks?`)
let teks_tagall = `══✪〘 *👥 Tag All* 〙✪══\n\n${q ? q : ''}\n`
for (let mem of participants) {
teks_tagall += `➲ @${mem.id.split('@')[0]}\n`
}
conn.sendMessage(from, { text: teks_tagall, mentions: participants.map(a => a.id) }, { quoted: msg })
break
case 'hidetag':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
let mem = [];
groupMembers.map( i => mem.push(i.id) )
conn.sendMessage(from, { text: q ? q : '', mentions: mem })
break
case 'mysesi':case 'sendsesi':case 'session':
if (!isOwner) return reply(mess.OnlyOwner)
let ini_nama_sessionya = 'session'
var anumu = await fs.readFileSync(`./${ini_nama_sessionya}.json`)
conn.sendMessage(from, { document: anumu, mimetype: 'document/application', fileName: 'session.json'}, {quoted: msg } )
reply(`*Note :*\n_Session Bot Bersifat Untuk Pribadi Dari Owner Maupun Bot, Tidak Untuk User Bot Ataupun Pengguna Bot._`)
reply(`_Sedang Mengirim Document_\n_Nama Session : ${setting.sessionName}.json_\n_Mohon Tunggu Sebentar..._`)
break
case 'antilink':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (isAntiLink) return reply(`antilink sudah aktif`)
if (!args[0]) return conn.sendMessage(from, { text: "[ *ANTILINK* ]\n\npilih on atau off", footer: 'setting antilink.', buttons: [{buttonId: `${prefix+command} on`, buttonText: {displayText: 'on'}, type: 1}, {buttonId: `${prefix+command} off`, buttonText: {displayText: 'off'}, type: 1}],headerType: 1 })
if (args[0] == "on") {
if (isAntiLink) return reply(`antilink sudah aktif`)
antilink.push(from)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfull Activate Antilink In This Group')}
if (args[0] == "off") {
if (!isAntiLink) return reply(`antilink telah mati`)
let anu = antilink.indexOf(from)
antilink.splice(anu, 1)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfull Disabling Antilink In This Group')
}
break
case 'cekitem': case 'list':
if (!isGroup) return reply(mess.OnlyGrup)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Belum ada list message yang terdaftar di group ini`)
var arr_rows = [];
for (let x of db_respon_list) {
if (x.id === from) {
arr_rows.push({
title: x.key,
rowId: x.key
})
}
}
var listMsg = {
text: `Hi @${sender.split("@")[0]}`,
buttonText: 'Click Here!',
footer: `*List From ${groupName}*\n\n⏳ ${jam}\n📆 ${tanggal}`,
mentions: [sender],
sections: [{
title: groupName, rows: arr_rows
}]
}
conn.sendMessage(from, listMsg)
break
case 'additem': case 'addlist':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
var args1 = q.split("@")[0]
var args2 = q.split("@")[1]
if (!q.includes("@")) return reply(`Gunakan dengan cara ${prefix+command} *key@response*\n\n_Contoh_\n\n${prefix+command} tes@apa`)
if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
if (isImage || isQuotedImage) {
let media = await downloadAndSaveMediaMessage('image', `./media/${sender}`)
const fd = new FormData();
fd.append('file', fs.readFileSync(media), '.tmp', '.jpg')
fetch('https://telegra.ph/upload', {
method: 'POST',
body: fd
}).then(res => res.json())
.then((json) => {
addResponList(from, args1, args2, true, `https://telegra.ph${json[0].src}`, db_respon_list)
reply(`Berhasil menambah List menu *${args1}*`)
if (fs.existsSync(media)) fs.unlinkSync(media)
})
} else {
addResponList(from, args1, args2, false, '-', db_respon_list)
reply(`Berhasil menambah List menu : *${args1}*`)
}
break
case 'delitem': case 'dellist':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *key*\n\n_Contoh_\n\n${prefix+command} hello`)
if (!isAlreadyResponList(from, q, db_respon_list)) return reply(`List respon dengan key *${q}* tidak ada di database!`)
delResponList(from, q, db_respon_list)
reply(`Sukses delete list message dengan key *${q}*`)
break
case 'p': case 'proses':
if (!isGroup) return ('Hanya Dapat Digunakan Gi Group')
if (!isOwner && !isGroupAdmins) return ('Hanya Bisa Digunakan Oleh Admin')
if (!isQuotedMsg) return ('Reply Pesanannya!')
let proses = `「 *TRANSAKSI PENDING* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Pending\`\`\`\n\n📝 Catatan :\n${quotedMsg.chats}\n\nPesanan @${quotedMsg.sender.split("@")[0]} sedang di proses!`
const getTextP = getTextSetProses(from, set_proses);
if (getTextP !== undefined) {
mentions(getTextP.replace('pesan', quotedMsg.chats).replace('nama', quotedMsg.sender.split("@")[0]).replace('jam', jam).replace('tanggal', tanggal), [quotedMsg.sender], true)
} else {
mentions(proses, [quotedMsg.sender], true)
}
break
case 'd': case 'done':
if (!isGroup) return ('Hanya Dapat Digunakan Gi Group')
if (!isOwner && !isGroupAdmins) return ('Hanya Bisa Digunakan Oleh Admin')
if (!isQuotedMsg) return ('Reply Pesanannya!')
let sukses = `「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Berhasil\`\`\`\n\nTerimakasih @${quotedMsg.sender.split("@")[0]} Next Order ya🙏`
const getTextD = getTextSetDone(from, set_done);
if (getTextD !== undefined) {
mentions(getTextD.replace('pesan', quotedMsg.chats).replace('nama', quotedMsg.sender.split("@")[0]).replace('jam', jam).replace('tanggal', tanggal), [quotedMsg.sender], true);
} else {
mentions(sukses, [quotedMsg.sender], true)
}
break
case 'setproses': case 'setp':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_p*\n\n_Contoh_\n\n${prefix+command} pesanan @pesan, tag orang @nama`)
if (isSetProses(from, set_proses)) return reply(`Set proses already active`)
addSetProses(q, from, set_proses)
reply(`Successfully set proses!`)
break
case 'changeproses': case 'changep':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_p*\n\n_Contoh_\n\n${prefix+command} pesanan @pesan, tag orang @nama`)
if (isSetProses(from, set_proses)) {
changeSetProses(q, from, set_proses)
reply(`Sukses change set proses teks!`)
} else {
addSetProses(q, from, set_proses)
reply(`Sukses change set proses teks!`)
}
break
case 'delsetproses': case 'delsetp':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isSetProses(from, set_proses)) return reply(`Belum ada set proses di sini..`)
removeSetProses(from, set_proses)
reply(`Sukses delete set proses`)
break
case 'setdone': case 'setd':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_done*\n\n_Contoh_\n\n${prefix+command} pesanan @pesan, tag orang @nama\n\nList Opts : tanggal/jam`)
if (isSetDone(from, set_done)) return reply(`Set done already active`)
addSetDone(q, from, set_done)
reply(`Successfully set done!`)
break
case 'changedone': case 'changed':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_done*\n\n_Contoh_\n\n${prefix+command} pesanan @pesan, tag orang @nama\n\nList Opts : tanggal/jam`)
if (isSetDone(from, set_done)) {
changeSetDone(q, from, set_done)
reply(`Sukses change set done teks!`)
} else {
addSetDone(q, from, set_done)
reply(`Sukses change set done teks!`)
}
break
case 'delsetdone': case 'delsetd':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isSetDone(from, set_done)) return reply(`Belum ada set done di sini..`)
removeSetDone(from, set_done)
reply(`Sukses delete set done`)
break
case 'kal': case 'kalkulator':
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* tanda *angka*\n\n_Contoh_\n\n${prefix+command} 2 2`)
const sections = [
{ title: "PILIH OBJECT", rows: [ 
{title: "Tambah", rowId: `${prefix}tambah_kan ${q.split(" ")[0]} ${q.split(" ")[1]}`, description: "di tambah (+)"},
{title: "Kurang", rowId: `${prefix}kurang_kan ${q.split(" ")[0]} ${q.split(" ")[1]}`, description: "di kurang (-)"},
{title: "Kali", rowId: `${prefix}kali_kan ${q.split(" ")[0]} ${q.split(" ")[1]}`, description: "di kali (×)"},
{title: "Bagi", rowId: `${prefix}bagi_kan ${q.split(" ")[0]} ${q.split(" ")[1]}`, description: "di bagi (÷)"}
]}]
const listMessage = {
text: `Hallo ${pushname} ${ucapanWaktu}`,
footer: "® kalkulator ( + - ÷ × )",
title: "[ *Hitung Otomatis* ]",
buttonText: "pilih_disini",
mentions: ownerNumber, sections}
conn.sendMessage(from, listMessage)
break
case 'id':{
reply(from)
}
break
//BAILEYS MENU
case 'afk':
if (!isGroup) return reply(mess.OnlyGrup)
if (isAfkOn) return reply('AFK sudah diaktifkan sebelumnya')
if (body.slice(100)) return reply('Alasanlu kepanjangan')
let reason = body.slice(5) ? body.slice(5) : 'Nothing.'
addAfkUser(sender, Date.now(), reason, _afk)
reply(`@${sender.split('@')[0]} sedang afk\nAlasan : ${reason}`)
break
case 'react':
if (!q) return reply(`_Contoh_\n${prefix+command} 😊`)
let ini_reaction = q.split(' ')[0] ? q.split(' ')[0] : ''
if (ini_reaction.length <1) return reply(`_Contoh_\n${prefix+command} 😊`)
const ini_react = { react: { text: ini_reaction, key: msg.key}}
conn.sendMessage(from, ini_react)
break
case 'fitnah':
if (!isGroup) return reply(mess.OnlyGrup)
if (!q) return reply(`Kirim perintah *${prefix+command}* @tag|pesantarget|pesanbot`)

var org = q.split('|')[0] ? q.split('|')[0] : q
var target = q.split('|')[1] ? q.split('|')[1] : q
var bot = q.split('|')[2] ? q.split('|')[2] : ''

if (bot.length <1) return reply(`Kirim perintah *${prefix+command}* @tag|pesantarget|pesanbot`)

if (!org.startsWith('@')) return reply('Tag orangnya')
if (!target) return reply(`Masukkan pesan target!`)
if (!bot) return reply(`Masukkan pesan bot!`)
var mens = parseMention(target)
var msg1 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { extemdedTextMessage: { text: `${target}`, contextInfo: { mentionedJid: mens }}}}
var msg2 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { conversation: `${target}` }}
conn.sendMessage(from, { text: bot, mentions: mentioned }, { quoted: mens.length > 2 ? msg1 : msg2 })
break
case 'towame':
reply(`http://wa.me/${sender.split('@')[0]}`)
break
case 'fakehidetag':
if (!isGroup) return reply(mess.OnlyGrup)
if (args.length < 2) return reply(`Kirim perintah *${prefix+command}* @tag|teks`)
var org = q.split("|")[0]
var teks = q.split("|")[1];
if (!org.startsWith('@')) return reply('Tag orangnya')
var mem2 = []
groupMembers.map( i => mem2.push(i.id) )
var mens = parseMention(target)
var msg1 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { extemdedTextMessage: { text: `${prefix}hidetag ${teks}`, contextInfo: { mentionedJid: mens }}}}
var msg2 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { conversation: `${prefix}hidetag ${teks}` }}
conn.sendMessage(from, { text: teks ? teks : '', mentions: mem2 }, { quoted: mens.length > 2 ? msg1 : msg2 })
break
case 'join':{
 if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Kirim perintah ${prefix+command} _linkgrup_`)
var ini_urrrl = q.split('https://chat.whatsapp.com/')[1]
var data = await conn.groupAcceptInvite(ini_urrrl)
reply(jsonformat(data))
}
break
//BUG KHUSUS WAR
case 'buggc':
case 'jadibot':
case 'ampas1':
case 'ampas2':
case 'spam':
case 'senbug':
case 'bugvip':
case 'bugpoll':
case 'bugtag':
case 'catalog':
case 'docu':
case 'docu':
case 'docu':
case 'daca':
case 'troli':
case 'troli2':
case 'bugstik':
case 'buglokasi':
if (!isDeveloper) return reply('Khusus Developer Bot.')
reply('Fitur belom jadi')
break
case 'bug':
case 'bugfc':
case 'bugpc':
case 'sendbug':{
if (isGroup) return reply('Khusus Chat Pribadi')
if (!isDeveloper) return reply('Khusus Developer Bot.')
if (!q) return reply(`Contoh:\n${prefix+command} 628xxx`)
let ini_nomor_hpnya = q
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(7000)
reply(`*Sukses mengirim bug for close ke nomor* :\nhttp://Wa.me/${ini_nomor_hpnya}`)
}
break
case 'daftar':if (cekTeman("id", sender)) return reply('kamu sudah terdaftar di database bot silahkan ketik #menu untuk melihat list menu bot')
if (!args[0]) return conn.sendMessage(from, { text: "━━━「 *VERIFICATION* 」━━━\n\nSilahkan Pilih Gender Anda", footer: 'klik button di bawah.', buttons: [{buttonId: `${prefix+command} aku_pria`, buttonText: {displayText: 'pria️'}, type: 1},{buttonId: `${prefix+command} aku_wanita`, buttonText: {displayText: 'wanita'}, type: 1}],headerType: 1 }, {quoted:fkontak})
if (args[0] == "aku_pria") {
pendaftar.push({id: sender, nama: pushname, gender: "Pria"})
fs.writeFileSync('./database/pengguna.json', JSON.stringify(pendaftar, null, 2))
reply(`━━━「 *YOUR-INFO* 」━━━\n• *Status* : Sukses\n• *ID* : ${sender.split("@")[0]}\n• *User* : Free\n• *Gender* : Pria\n• *Nama* : ${pushname}\n• *Teman* : false\n• *Total User* : ${pendaftar.length}\n\n*Note* : Silahkan gunakan fitur ${prefix}menu untuk melihat apa saya fungsi bot ini.`)
}
if (args[0] == "aku_wanita") {
pendaftar.push({id: sender, nama: pushname, gender: "Wanita"})
fs.writeFileSync('./database/pengguna.json', JSON.stringify(pendaftar, null, 2))
reply(`━━━「 *YOUR-INFO* 」━━━\n• *Status* : Sukses\n• *ID* : ${sender.split("@")[0]}\n• *User* : Free\n• *Gender* : Wanita\n• *Nama* : ${pushname}\n• *Teman* : false\n• *Total User* : ${pendaftar.length}\n\n*Note* : Silahkan gunakan fitur ${prefix}menu untuk melihat apa saya fungsi bot ini.`)
}
break
case 'confes':case 'confess':{
if (isGroup) return reply("Gunakan bot ini di pesan pribadi:3")
let nomor_temanh = q.split("|")[0] ? q.split("|")[0] : q
let ini_nama_kamu = q.split("|")[1] ? q.split("|")[1] : q
let pesan_temanh = q.split("|")[2] ? q.split("|")[2] : ''
let nomor_pengirimnyah = sender.split("@")[0]
if (pesan_temanh.length <1) return reply(`Harus di isi semua !!\nex : ${prefix+command} 62857xxx|nama|hallo`)
if (!q) return reply(`Format Fitur Confes / Kirim pesan rahasia ke seseorang Lewat bot\n\n_Example_\n${prefix+command} wa|pengirim|pesan\n\n_Contoh_\n${prefix+command} 6285789004732|crush|hello\n\n*Note :*\nBerawal dari 628xxx Tanpa Spasi`)
conn.sendMessage(`${nomor_temanh}@s.whatsapp.net`, { text: `━━━[ *PESAN-RAHASIA* ]━━━\n_Hi ada confess nih buat kamu_\n\n*dari :* ${ini_nama_kamu}\n*pesan :* ${pesan_temanh}\n\n_Pesan ini di tulis oleh seseorang,_\n_bot hanya menyampaikan saja._\n━━━━━━━━━━━━━━━━`, footer: 'klik button untuk membalas pesan', buttons: [{buttonId: `${prefix}balas_confes ${nomor_pengirimnyah}@s.whatsapp.net|${nomor_temanh}@s.whatsapp.net`, buttonText: {displayText: 'balas✍️'}, type: 1}],headerType: 1 }, {quoted: msg})
reply('Sukses mengirimkan pesan ke dia.')
}
break
case 'balas_confes':{
let pengirim_menh = q.split("|")[0]
let penerima_menh = q.split("|")[1]
db_menfes.push({id: penerima_menh, teman: pengirim_menh })
fs.writeFileSync('./database/menfess.json', JSON.stringify(db_menfes))
reply('Silahkan Masukan pesan yang ingin di balas ke dia.')
}
break
case 'menfes': case 'menfess':{
if (isGroup) return reply("Gunakan bot ini di pesan pribadi:3")
if (!q) return reply(`Format Fitur Menfes / Kirim pesan rahasia ke seseorang Lewat bot\n\n_Example_\n${prefix+command} wa|pengirim|pesan\n\n_Contoh_\n${prefix+command} 6285789004732|bot|hai\n\nnote : Berawal dari 628xxx`)
let nomor_teman = q.split('|')[0] ? q.split('|')[0] : q
let nama_pengirim = q.split('|')[1] ? q.split('|')[1] : q
let pesan_teman = q.split('|')[2] ? q.split('|')[2] : ''
if (pesan_teman.length <1) return reply(`Harus di isi semua !!\nex : ${prefix+command} 62857xxx|nama|hallo`)
let nomor_pengirimnya = sender.split("@")[0]
let text_menfess = `_Hi ada menfess nih buat kamu_\n\n*Dari :* ${nama_pengirim}\n*Pesan :* ${pesan_teman}\n\n_Pesan ini di tulis oleh seseorang,_\n_bot hanya menyampaikan saja._`
let button_menfes = [{ buttonId: `${prefix}balas_menfes ${nomor_pengirimnya}@s.whatsapp.net|${nomor_teman}@s.whatsapp.net`, buttonText: { displayText: "Balas✍️" }, type: 1 }]
const ini_mess_menfess = { image: await reSize(fs.readFileSync("./temp/mecon.jpg"), 300, 200), caption: text_menfess, footer: 'klik button untuk membalas pesan', buttons: button_menfes, headerType: 4 }
const sendMsg = await conn.sendMessage(`${nomor_teman}@s.whatsapp.net`, ini_mess_menfess, { quoted: msg })
reply(`*Sukses Mengirimkan Pesan Menfess*\n*Nomor :* ${nomor_teman}\n*Pesan :* ${pesan_teman}`)
}
break
case 'balas_menfes':
let pengirim_men = q.split("|")[0]
let penerima_men = q.split("|")[1]
db_menfes.push({id: penerima_men, teman: pengirim_men })
fs.writeFileSync('./database/menfess.json', JSON.stringify(db_menfes))
reply('Silahkan Masukan pesan yang ingin di balas ke dia.')
break
case 'jadian': {
if (!isGroup) return reply(mess.OnlyGrup)
let member = participants.map(u => u.id)
let orang = member[Math.floor(Math.random() * member.length)]
let jodoh = member[Math.floor(Math.random() * member.length)]
let jawab = `Ciee yang Jadian💖 Jangan lupa pajak jadiannya🐤

@${orang.split('@')[0]} ❤️ @${jodoh.split('@')[0]}`
let menst = [orang, jodoh]
let buttons = [
{ buttonId: prefix+'jadian', buttonText: { displayText: 'JADIAN' }, type: 1 }
]
await sendButtonText(from, buttons, jawab, setting.footer, msg, {mentions: menst})
}
break
case 'jodohku': {
if (!isGroup) return reply(mess.OnlyGrup)
let member = participants.map(u => u.id)
let me = sender
let jodoh = member[Math.floor(Math.random() * member.length)]
let jawab = `👫Jodoh mu adalah

@${me.split('@')[0]} ❤️ @${jodoh.split('@')[0]}`
let ments = [me, jodoh]
let buttons = [
{ buttonId: prefix+'jodohku', buttonText: { displayText: 'JODOHKU' }, type: 1 }
]
await sendButtonText(from, buttons, jawab, setting.footer, msg, {mentions: ments})
}
break
case "tinyurl":{
if (!q) return reply(`*Contoh :*\n${prefix+command} http://google.com`)
let tinyurl = await fetchJson(`https://api-yogipw.herokuapp.com/api/short/tinyurl?url=${q}`)
conn.sendMessage(from, {text: `Link Original : ${q}\nLink Shortlink : ${tinyurl.result}`, quoted: msg })
}
break
case "isgd":{
if (!q) return reply(`*Contoh :*\n${prefix+command} http://google.com`)
let isgd = await fetchJson(`https://api-yogipw.herokuapp.com/api/short/isgd?url=${q}`)
conn.sendMessage(from, {text: `Link Original : ${q}\nLink Shortlink : ${isgd.result.link}`, quoted: msg })
}
break
case "cuttly":{
if (!q) return reply(`*Contoh :*\n${prefix+command} http://google.com`)
let cuttly = await fetchJson(`https://api-yogipw.herokuapp.com/api/short/cuttly?url=${q}`)
conn.sendMessage(from, {text: `Link Original : ${q}\nLink Shortlink : ${cuttly.result.link}`, quoted: msg })
}
break
case 'apakah':
if (!q) return reply(`Penggunaan ${prefix+command} text\n\nContoh : ${prefix+command} saya wibu`)
var MyLord = body.slice(8)
var apa = ['Iya', 'Tidak', 'Bisa Jadi', 'Betul']
var kah = apa[Math.floor(Math.random() * apa.length)]
conn.sendMessage(from, { text: `Pertanyaan : Apakah ${MyLord}\nJawaban : ${kah}` }, { quoted: msg })
break
case 'bisakah':
if (!q) return reply(`Penggunaan ${prefix+command} text\n\nContoh : ${prefix+command} saya wibu`)
var MyLord = body.slice(9)
var bisa = ['Bisa','Gak Bisa','Gak Bisa Ajg Aaokawpk','TENTU PASTI KAMU BISA!!!!']
var ga = bisa[Math.floor(Math.random() * bisa.length)]
conn.sendMessage(from, { text: `Pertanyaan : ${MyLord}\nJawaban : ${ga}` }, { quoted: msg })
break
case 'siapakah':
if (!q) return reply(`Penggunaan ${prefix+command} text\n\nContoh : ${prefix+command} pencipta wibu`)
var MyLord = body.slice(10)
var bisaa = ['Mungkin Bang Lexxy:d','Mungkin Kamu Yak?','Tanya Pak Aji','Tanya Google','Liat YouTube','Download Shoope','Mungkin Termux']
var gaa = bisaa[Math.floor(Math.random() * bisaa.length)]
conn.sendMessage(from, { text: `Pertanyaan : ${MyLord}\nJawaban : ${gaa}` }, { quoted: msg })
break
case 'bagaimanakah':
if (!q) return reply(`Penggunaan ${prefix+command} text\n\nContoh : ${prefix+command} saya wibu`)
var MyLord = body.slice(14)
var gimana = ['Gak Gimana2', 'Sulit Itu Bro', 'Maaf Bot Tidak Bisa Menjawab', 'Coba Deh Cari Di Gugel','astaghfirallah Beneran???','Pusing ah','Owhh Begitu:(','Yang Sabar Ya Bos:(','Gimana yeee']
var ya = gimana[Math.floor(Math.random() * gimana.length)]
conn.sendMessage(from, { text: `Pertanyaan : ${MyLord}\nJawaban : ${ya}` }, { quoted: msg })
break
case 'rate':
if (!q) return reply(`Penggunaan ${prefix+command} text\n\nContoh : ${prefix+command} Gambar aku`)
var MyLord = body.slice(6)
var ra = ['5', '10', '15' ,'20', '25','30','35','40','45','50','55','60','65','70','75','80','85','90','100']
var te = ra[Math.floor(Math.random() * ra.length)]
conn.sendMessage(from, { text: `Rate : ${MyLord}\nJawaban : *${te}%*` }, { quoted: msg })
break
case 'saldo':
case 'me': 
case 'infome':
reply(`「 *USER-INFO* 」
*Nomer :* wa.me/${sender.split('@')[0]}
*Saldo :* Rp${toRupiah(blnc.checkBalance(sender, balanceDB))}`)
break
case 'deposit': case 'depo':
if (isGroup) return reply("Gunakan bot ini di pesan pribadi:3")
var buttonMessage_dep = {
text: `Hallo Kak ☺️, Ingin melakukan deposit?, Silahkan Pilih Payment yang tersedia di bawah ini 👇🏻`,
footer: conn.user.name,
buttons: [
{ buttonId: 'payment_dana', buttonText: {displayText: 'Dana'}, type: 1}
],
headerType: 1
}
conn.sendMessage(from, buttonMessage_dep)
break
case 'bukti':
if (!fs.existsSync(depositPath + sender.split("@")[0] + ".json")) return reply("Sepertinya kamu belum melakukan deposit")
if (!isImage && !isQuotedImage) return reply(`Kirim gambar dengan caption *#bukti* atau tag gambar yang sudah dikirim dengan caption *#bukti*`)

await conn.downloadAndSaveMediaMessage(msg, "image", `./db/bukti/${sender.split('@')[0]}.jpg`)

let data_depo = JSON.parse(fs.readFileSync(depositPath + sender.split("@")[0] + ".json"))
let caption_bukti =`「 *INFO-DEPOSIT* 」

*ID:* ${data_depo.ID}
*Nomer:* wa.me/${data_depo.number.split('@')[0]}
*Payment:* ${data_depo.payment}
*Tanggal:* ${data_depo.date.split(' ')[0]}
*Jumlah Deposit:* Rp${toRupiah(data_depo.data.amount_deposit)}
*Pajak:* Rp 2.500
*Total Pembayaran:* Rp${toRupiah(data_depo.data.amount_deposit+2500)}

_Ada yang deposit nih kak, coba dicek, jika sudah masuk konfirmasi dengan klik button *Accept*_`
                   
let bukti_button = [
{ buttonId: 'acc_deposit', buttonText: {displayText: 'Accept'}, type: 1},
{ buttonId: 'reject_deposit', buttonText: {displayText: 'Reject'}, type: 1}
]
let bukti_bayar = {
image: fs.readFileSync(`./db/bukti/${sender.split('@')[0]}.jpg`),
caption: caption_bukti,
title: 'bukti pembayaran',
footer: 'Press The Button Below',
buttons: bukti_button,
headerType: 5 
}
conn.sendMessage(`${setting.contactOwner}@s.whatsapp.net`, bukti_bayar, { quoted: msg })
reply(`Mohon tunggu ya kak, sampai di acc oleh owner ☺️`)
if (fs.existsSync(`./db/bukti/${sender.split('@')[0]}.jpg`)) fs.unlinkSync(`./db/bukti/${sender.split('@')[0]}.jpg`)
break
case 'data':
var rows = [
{
title: "info akun",
rowId: "#cekakun",
description: "Menampilkan info akun apigames.id"
},
{
title: "koneksi unipin",
rowId: "#koneksi_unipin",
description: "Menampilkan data koneksi UNIPIN-ID"
}
]
var listMsg = {
text: `List Data Server apigames.id\nSilahkan pilih salah satu!`,
buttonText: "Pilih Disini",
sections: [ { title: "host : apigames.id", rows } ]
}
conn.sendMessage(from, listMsg, {quoted:fkontak})
break
case 'done_tranksaksi':{
let pesan_donenya = q.split('|')[0]
let harga_produknya = q.split('|')[1]
let orang_belinya = q.split('|')[2]
blnc.lessBalance(`${orang_belinya}@s.whatsapp.net`, Number(harga_produknya), balanceDB)
conn.sendMessage(`${orang_belinya}@s.whatsapp.net`, {text: pesan_donenya })
conn.sendMessage(`${orang_belinya}@s.whatsapp.net`, {text: `Sisa Saldo kamu : Rp${toRupiah(blnc.checkBalance(sender, balanceDB))}` })
}
break
case 'gagal_tranksaksi':{
let pesan_gagalnya = q.split('|')[0]
let orang_belinya = q.split('|')[1]
conn.sendMessage(`${orang_belinya}@s.whatsapp.net`, {text: pesan_gagalnya })
}
break
case 'topupff':{
if (isGroup) return reply("Gunakan bot ini di pesan pribadi:3")
if (!q) return reply(`*_Format Topup Diamond FF_*\n\n_Example_\n${prefix+command} idff\n\n_Contoh_\n${prefix+command} 239814337\n\n*Note :*\nkesalahan input id tujuan bukan tanggung jawab admin!.`)
let x = await api.search.freefireid(q)
let id_tujuan = q.split('.')[0] ? q.split('.')[0] : ''
if (id_tujuan.length <1) return reply(`*_Format Topup Diamond FF_*\n\n_Example_\n${prefix+command} idff\n\n_Contoh_\n${prefix+command} 239814337\n\n*Note :*\nkesalahan input id tujuan bukan tanggung jawab admin!.`)
var rows = [
{title: "Produk FFS5", rowId: `${prefix}ntf_proses FFPS5.${id_tujuan}.1200.${sender.split('@')[0]}`, description: "5 Diamond 💎 Harga => Rp1.200"},
{title: "Produk FFS12", rowId: `${prefix}ntf_proses FFPS12.${id_tujuan}.2200.${sender.split('@')[0]}`, description: "12 Diamond 💎 Harga => Rp2.200"},
{title: "Produk FFS20", rowId: `${prefix}ntf_proses FFPS20.${id_tujuan}.3150.${sender.split('@')[0]}`, description: "20 Diamond 💎 Harga => Rp3.150"},
{title: "Produk FFS50", rowId: `${prefix}ntf_proses FFPS50.${id_tujuan}.7000.${sender.split('@')[0]}`, description: "50 Diamond 💎 Harga => Rp7.000"},
{title: "Produk FFS70", rowId: `${prefix}ntf_proses FFPS70.${id_tujuan}.9300.${sender.split('@')[0]}`, description: "70 Diamond 💎 Harga => Rp9.300"},
{title: "Produk FFS140", rowId: `${prefix}ntf_proses FFPS140.${id_tujuan}.18100.${sender.split('@')[0]}`, description: "140 Diamond 💎 Harga => Rp18.100"},
{title: "Produk FFS355", rowId: `${prefix}ntf_proses FFPS355.${id_tujuan}.46000.${sender.split('@')[0]}`, description: "355 Diamond 💎 Harga => Rp46.000"},
{title: "Produk FFS720", rowId: `${prefix}ntf_proses FFPS720.${id_tujuan}.92000.${sender.split('@')[0]}`, description: "720 Diamond 💎 Harga => Rp92.000"}
]
var listMsg = {
text: `_*Jika nicknamenya tidak terdeteksi silahkan ketik ulang lagi !!*_\n*_nickname : ${x.result}_*\n*Topup Diamond Free Fire*\n_Silahkan pilih salah satu!_`,
buttonText: "Touch me senpai",
sections: [ { title: "FF SUPER PROMO TERBATAS", rows } ]
}
conn.sendMessage(from, listMsg, {quoted:fkontak})
}
break
case 'topupml':{
if (isGroup) return reply("Gunakan bot ini di pesan pribadi:3")
if (!q) return reply(`*_Format Topup Diamond ML_*\n\n_Example_\n${prefix+command} id+zone\n\n_Contoh_\n${prefix+command} 7383670688944\n\n*Note :*\nkesalahan input id tujuan bukan tanggung jawab admin!.`)

let id_tujuan = q.split('.')[0] ? q.split('.')[0] : ''

if (id_tujuan.length <1) return reply(`*_Format Topup Diamond FF_*\n\n_Example_\n${prefix+command} idff\n\n_Contoh_\n${prefix+command} 239814337\n\n*Note :*\nkesalahan input id tujuan bukan tanggung jawab admin!.`)
var rows = [
{title: "Produk MLP5", rowId: `${prefix}ntf_proses MLP5.${id_tujuan}.3000.${sender.split('@')[0]}`, description: "5 Diamond 💎 Harga => Rp3.000"},
{title: "Produk MLP12", rowId: `${prefix}ntf_proses MLP12.${id_tujuan}.5000.${sender.split('@')[0]}`, description: "12 Diamond 💎 Harga => Rp5.000"},
{title: "Produk MLP19", rowId: `${prefix}ntf_proses MLP19.${id_tujuan}.7000.${sender.split('@')[0]}`, description: "19 Diamond 💎 Harga => Rp7.000"},
{title: "Produk MLP28", rowId: `${prefix}ntf_proses MLP28.${id_tujuan}.10000.${sender.split('@')[0]}`, description: "28 Diamond 💎 Harga => Rp10.000"},
{title: "Produk MLP36", rowId: `${prefix}ntf_proses MLP36.${id_tujuan}.12000.${sender.split('@')[0]}`, description: "36 Diamond 💎 Harga => Rp12.000"},
{title: "Produk MLP44", rowId: `${prefix}ntf_proses MLP44.${id_tujuan}.14000.${sender.split('@')[0]}`, description: "44 Diamond 💎 Harga => Rp14.000"},
{title: "Produk MLP59", rowId: `${prefix}ntf_proses MLP59.${id_tujuan}.18000.${sender.split('@')[0]}`, description: "59 Diamond 💎 Harga => Rp18.000"},
{title: "Produk MLPS86", rowId: `${prefix}ntf_proses MLPS86.${id_tujuan}.22000.${sender.split('@')[0]}`, description: "86 Diamond 💎 Harga => Rp22.000"},
{title: "Produk MLPS172", rowId: `${prefix}ntf_proses MLPS172.${id_tujuan}.44000.${sender.split('@')[0]}`, description: "172 Diamond 💎 Harga => Rp44.000"},
{title: "Produk MLPS257", rowId: `${prefix}ntf_proses MLPS257.${id_tujuan}.64000.${sender.split('@')[0]}`, description: "257 Diamond 💎 Harga => Rp64.000"}
]
var listMsg = {
text: `*Topup Diamond Mobile Legends*\n_Silahkan pilih salah satu!_`,
buttonText: "Touch me senpai",
sections: [ { title: "LIST DIAMOND MOBILE LEGENDS", rows } ]
}
conn.sendMessage(from, listMsg, {quoted:fkontak})
}
break
case 'ntf_proses':{
if (isGroup) return reply("Gunakan bot ini di pesan pribadi:3")

if (blnc.checkBalance(sender, balanceDB) < Number(q.split('.')[2])) return reply("Maaf saldo anda kurang")
if (blnc.checkBalance(sender, balanceDB) === 0) return reply(`Maaf sepertinya saldo kamu Rp 0, Silahkan melakukan ${prefix}deposit sebelum topup`)

reply(`*TOPUP GAME 🎮*
ID Game : ${q.split('.')[1]}
Produk : ${q.split('.')[0]}
Status : Diproses
Harga : Rp${toRupiah(q.split('.')[2])}

Mohon tunggu sebentar
pesanan kamu sedang di proses..`)

let ini_orang = q.split('.')[3]

let ini_teksnyaa = `${q.split('.')[0]}.${q.split('.')[1]}.2004`
conn.sendMessage(`${setting.contactOwner}@s.whatsapp.net`, { text: ini_teksnyaa})

var buttonMessage_dep = {
text: `*Teruskan pesan ini ke nomor*\n\n_Wa.me/6281329534712_\n\n*jika status berhasil klik button done ✓*`,
footer: conn.user.name,
buttons: [
{ buttonId: `${prefix}ntf_done ${ini_orang}|${q.split('.')[1]}|${q.split('.')[2]}|${q.split('.')[0]}`, buttonText: {displayText: 'done ✓'}, type: 1}
],
headerType: 1
}
conn.sendMessage(from, buttonMessage_dep)
}
break
case 'ntf_done':{
if (isGroup) return reply("Gunakan bot ini di pesan pribadi:3")
let data_produk = q.split('|')[3]
let data_harga = q.split('|')[2]
let tujuan_id = q.split('|')[1]
let nomer_orang = q.split('|')[0]
let text_doneya = `Saldo kamu telah terpotong Rp${toRupiah(data_harga)}, Telah melakukan transaksi topupff\n\n*ID_FF: ${tujuan_id}*\n*Produk : ${data_produk}*\n\n_Silahkan Cek Saldo Anda Ketik #me_`
blnc.lessBalance(`${nomer_orang}@s.whatsapp.net`, Number(data_harga), balanceDB)
conn.sendMessage(`${nomer_orang}@s.whatsapp.net`, { text: text_doneya})
}
break
case 'setwelcome':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_welcome*\n\n_Contoh_\n\n${prefix+command} Hallo @user\nSelamat Datang Di @group\n\n*Jangan lupa intro ya :*\nNama :\nKelas :\nUmur : \nStatus : \n\n_*Sering baca deskripsi.*_`)
if (isSetWelcome(from, set_welcome_group)) return reply(`Set Welcome already active`)
addSetWelcome(q, from, set_welcome_group)
reply(`Successfully Set text Welcome!`)
break
case 'changewelcome':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_welcome*\n\n_Contoh_\n\n${prefix+command} Hallo @user\nSelamat Datang Di @group\n\n*Jangan lupa intro ya :*\nNama :\nKelas :\nUmur : \nStatus : \n\n_*Sering baca deskripsi.*_`)
changeSetWelcome(q, from, set_welcome_group)
reply(`Successfully Change text Welcome!`)
break
case 'delwelcome':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isSetWelcome(from, set_welcome_group)) return reply(`Welcome Belum Di Setting\nSilahkan Ketik ${prefix}setwelcome`)
removeSetWelcome(from, set_welcome_group)
reply(`Successfully Delset text Welcome!`)
break
case 'getwelcome':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isSetWelcome(from, set_welcome_group)) return reply(`Welcome Belum Di Setting\nSilahkan Ketik ${prefix}setwelcome`)
reply(`*TEXT WELCOME*\n${getTextSetWelcome(from, set_welcome_group)}`)
break
case 'setleft':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_left*\n\n_Contoh_\n\n${prefix+command} Sayonara @user\nTelah Meninggalkan Grup @group\n`)
if (isSetLeft(from, set_left_db)) return reply(`Set Left already active`)
addSetLeft(q, from, set_left_db)
reply(`Successfully Set text Left!`)
break
case 'changeleft':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_left*\n\n_Contoh_\n\n${prefix+command} Sayonara @user\nTelah Meninggalkan Grup @group\n`)
changeSetLeft(q, from, set_left_db)
reply(`Successfully Change text Self!`)
break
case 'delleft':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isSetLeft(from, set_left_db)) return reply(`Welcome Belum Di Setting\nSilahkan Ketik ${prefix}setwelcome`)
removeSetLeft(from, set_left_db)
reply(`Successfully Delset text Left!`)
break
case 'getleft':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isSetLeft(from, set_left_db)) return reply(`Welcome Belum Di Setting\nSilahkan Ketik ${prefix}setwelcome`)
reply(`*TEXT LEFT*\n${getTextSetLeft(from, set_left_db)}`)
break
case 'dashboard': case 'db':{
let listpcnya = await store.chats.all().filter(v => v.id.endsWith('.net')).map(v => v)
let listgcnya = await store.chats.all().filter(v => v.id.endsWith('@g.us')).map(v => v.id)

var jumlahCmd = commund.length
if (jumlahCmd > 130) jumlahCmd = 130

teks = `*DASHBOARD*\n_Chat Pribadi : ${listpcnya.length}_\n_Chat Group : ${listgcnya.length}_\n_Total Hit : ${hitbot.length}_\n\n*COMMAND*`
for (let i = 0; i < jumlahCmd ; i ++) {
teks += `\n_#${commund[i].id} = ${commund[i].total}_`
}
reply(teks)
}
break
case 'resetdb':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
let para_kos = "[]"
commund.splice(para_kos)
fs.writeFileSync('./database/dashboard/datacmd.json', JSON.stringify(commund))
hitbot.splice(para_kos)
fs.writeFileSync('./database/dashboard/userhit.json', JSON.stringify(hitbot))
}
reply('Succesfull Reset Dashboard ✓')
break
case 'halah': case 'hilih': case 'huluh': case 'heleh': case 'holoh':
if (!quoted && !args[1]) return reply(`Kirim/reply text dengan caption ${prefix + command}`)
var ter = command[1].toLowerCase()
var tex = quoted ? quoted.text ? quoted.text : q ? q : text : q ? q : text
reply(tex.replace(/[aiueo]/g, ter).replace(/[AIUEO]/g, ter.toUpperCase()))
break
/*case 'addsewa':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *linkgc waktu*\n\nContoh : ${prefix+command} https://chat.whatsapp.com/Hjv5qt195A2AcwkbswwoMQ 30d\n\n*LIST WAKTU*\nd = days\nh = hours\nm = minutes\n\n*TRANSLATE*\ndays > hari\nhours > jam\nminutes > menit`)
let ini_linknyaa = q.split(' ')[0] ? q.split(' ')[0] : q
let ini_waktunya = q.split(' ')[1] ? q.split(' ')[1] : ''
if (ini_waktunya.length <1) return reply(`harus di isi semua!!\n_contoh_\n${prefix+command} *linkgc waktu*\n\nContoh : ${prefix+command} https://chat.whatsapp.com/Hjv5qt195A2AcwkbswwoMQ 30d\n\n*LIST WAKTU*\nd = days\nh = hours\nm = minutes\n\n*TRANSLATE*\ndays > hari\nhours > jam\nminutes > menit`)
//if (!isUrl(args[1])) return reply(mess.error.Iv)
var ini_urrrl = ini_linknyaa.split('https://chat.whatsapp.com/')[1]
var data = await conn.groupAcceptInvite(ini_urrrl)
if (_sewa.checkSewaGroup(data, sewa)) return reply(`Bot sudah disewa oleh grup tersebut!`)
_sewa.addSewaGroup(data, ini_waktunya, sewa)
reply(`Success Add Sewa Group Berwaktu!`)
}
break
case 'delsewa':
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!isGroup) return reply(`Perintah ini hanya bisa dilakukan di Grup yang menyewa bot`)
if (!isSewa) return reply(`Bot tidak disewa di Grup ini`)
sewa.splice(_sewa.getSewaPosition(args[1] ? args[1] : from, sewa), 1)
fs.writeFileSync('./database/sewa.json', JSON.stringify(sewa, null, 2))
reply(`Sukses`)
break
case 'listsewa':
let list_sewa_list = `*LIST-SEWA-GROUP*\n\n*Total:* ${sewa.length}\n\n`
let data_array = [];
for (let x of sewa) {
list_sewa_list += `*Name:* ${await getGcName(x.id)}\n*ID :* ${x.id}\n`
if (x.expired === 'PERMANENT') {
let ceksewa = 'PERMANENT'
list_sewa_list += `*Expire :* PERMANENT\n\n`
} else {
let ceksewa = ms(x.expired - Date.now())
list_sewa_list += `*Expire :* ${ceksewa.days} day(s) ${ceksewa.hours} hour(s) ${ceksewa.minutes} minute(s) ${ceksewa.seconds} second(s)\n\n`
}
}
conn.sendMessage(from, { text: list_sewa_list }, { quoted: msg })
break
case 'checksewa': case 'ceksewa':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isSewa) return reply(`Bot tidak di sewa group ini!`)
let ceksewa = ms(_sewa.getSewaExpired(from, sewa) - Date.now())
let sewanya = `*Expire :* ${ceksewa.days} day(s) ${ceksewa.hours} hour(s) ${ceksewa.minutes} minute(s) ${ceksewa.seconds} second(s)`
reply(sewanya)
break*/
//PEMBATAS
default:
if (!isGroup && !isCmd) {
if (cekUser("id", sender) == null) return
if (cekUser("teman", sender) == false) return
const reactionMessage = { react: { text: "✉", key: msg.key}}
conn.sendMessage(from, reactionMessage)
if (m.messages[0].type == "conversation" || m.messages[0].type == "extendedTextMessage") {
try{ var text1 = m.messages[0].message.extendedTextMessage.text } catch (err) { var text1 = m.messages[0].message.conversation }
conn.sendMessage(cekUser("teman", sender), {text: text1 }, {quoted:{ key: {fromMe: false, participant: `${botNumber}`, ...(from ? { remoteJid: "status@broadcast" } : {})},message: {"conversation": "━━━「 *PESAN-DIBALAS* 」━━━"}} })
let menfes_kosong = "[]"
db_menfes.splice(menfes_kosong)
fs.writeFileSync('./database/menfess.json', JSON.stringify(db_menfes))
reply('Pesan balasan kamu diteruskan')
}}
}} catch (err) {
console.log(color('[ERROR]', 'red'), err)}}
