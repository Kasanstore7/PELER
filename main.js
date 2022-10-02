"use strict";
const {
	default: makeWASocket,
	BufferJSON,
	initInMemoryKeyStore,
	DisconnectReason,
	AnyMessageContent,
	useSingleFileAuthState,
	makeInMemoryStore,
	delay,
	downloadContentFromMessage,
	jidDecode,
	generateForwardMessageContent,
	generateWAMessageFromContent,
	proto,
	prepareWAMessageMedia
} = require("@adiwajshing/baileys")
const figlet = require("figlet");
const fs = require("fs");
const moment = require('moment')
const chalk = require('chalk')
const logg = require('pino')
const PhoneNumber = require('awesome-phonenumber')
const clui = require('clui')
const { Spinner } = clui

const afk = require("./lib/afk");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif2')
const { serialize, getBuffer, makeid } = require("./lib/myfunc");
const { color, connLog } = require("./lib/color");
const { isSetWelcome, getTextSetWelcome } = require('./lib/setwelcome');
const { isSetLeft, getTextSetLeft } = require('./lib/setleft');

let welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
let left = JSON.parse(fs.readFileSync('./database/left.json'));
let set_welcome_group = JSON.parse(fs.readFileSync('./database/set_welcome.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/set_left.json'));
let _afk = JSON.parse(fs.readFileSync('./database/afk.json'));

const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')

let setting = JSON.parse(fs.readFileSync('./config.json'));
let nama_session = './session.json'
const { state, saveState } = useSingleFileAuthState(nama_session)

function title() {
	  console.log(chalk.bold.blue(figlet.textSync('NEOBOT', {
		font: 'Standard',
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 80,
		whitespaceBreak: false
	})))
	console.log(chalk.yellow(`\n${chalk.red('[ STORE - BOT ]')}\n\n${chalk.italic.magenta('• Author')} : ${chalk.white('Lexxy24')}\n${chalk.italic.magenta('• YouTube')} : ${chalk.white('Lexxy Official')}\n${chalk.italic.magenta('• Caption')} : ${chalk.white('Rela Bergadang Demi Mencari Cuan:v')}\n`))
}
/**
* Uncache if there is file change;
* @param {string} module Module name or path;
* @param {function} cb <optional> ;
*/
 function nocache(module, cb = () => { }) {
    console.log(`Bot Sudah Aktif ✅`)
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
* Uncache a module
* @param {string} module Module name or path;
*/
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

const status = new Spinner(chalk.cyan(` Booting WhatsApp Bot`))
const starting = new Spinner(chalk.cyan(` Preparing After Connect`))
const reconnect = new Spinner(chalk.redBright(` Reconnecting WhatsApp Bot`))

const store = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

const connectToWhatsApp = async () => {
    const conn = makeWASocket({
        printQRInTerminal: true,
        logger: logg({ level: 'fatal' }),
        auth: state,
        browser: ["Neobot Multi Device", "Safari", "3.0"]
    })
    title()
    store.bind(conn.ev)
    
    conn.mode = 'public'

    require('./index')
    require('./help')
    nocache('./index', module => console.log(chalk.redBright('[ CMD ]  ') + time + chalk.yellowBright(` "${module}" Update!`)))
    nocache('./help', module => console.log(chalk.redBright('[ CMD ]  ') + time + chalk.yellowBright(` "${module}" Update!`)))
 
	conn.ev.on('messages.upsert', async m => {
	    var msg = m.messages[0]
	    if (!m.messages) return;
	    if (msg.key && msg.key.remoteJid == "status@broadcast") return
	    msg = serialize(conn, msg)
	    msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
	    require('./index')(conn, msg, m, setting, store, welcome, left, set_welcome_group, set_left_db, _afk)
	})

            // To Read Presences
        conn.ev.on('presence.update', async data => {
        
           // Read Data Presences Afk
           if (data.presences) {
             for (let key in data.presences) {
               if (data.presences[key].lastKnownPresence === "composing" || data.presences[key].lastKnownPresence === "recording") {
                 if (afk.checkAfkUser(key, _afk)) {
                   _afk.splice(afk.getAfkPosition(key, _afk), 1)
                   fs.writeFileSync('./database/afk.json', JSON.stringify(_afk, null, 2))
                  conn.sendMessage(data.id, { text: `@${key.split("@")[0]} berhenti afk, dia sedang ${data.presences[key].lastKnownPresence === "composing" ? "mengetik" : "merekam"}`, mentions: [key] })
                 }
               }
             }
           }
        })

        
    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            status.stop()
            reconnect.stop()
            starting.stop()
            console.log(connLog('Connect, Welcome Owner'))
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
            ? connectToWhatsApp()
            : console.log(connLog('Connection Lost'))
        }
    })
	
    conn.ev.on('group-participants.update', async (data) => {
        const isWelcome = welcome.includes(data.id) ? true : false
        const isLeft = left.includes(data.id) ? true : false
        const metadata = await conn.groupMetadata(data.id)
        const groupName = metadata.subject
        const groupDesc = metadata.desc
        const groupMem = metadata.participants.length
        try {
            for (let i of data.participants) {
                if (data.action == "add" && isWelcome) {
                    try {
                        var pp_user = await conn.profilePictureUrl(i, 'image')
                    } catch {
                        var pp_user = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                    }
                    if (isSetWelcome(data.id, set_welcome_group)) {
                        var get_teks_welcome = getTextSetWelcome(data.id, set_welcome_group)
                        var replace_pesan = (get_teks_welcome.replace(/@user/gi, `@${i.split('@')[0]}`))
                        var full_pesan = (replace_pesan.replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc))
                        conn.sendMessage(data.id, { caption: `${full_pesan}`, image: await getBuffer(pp_user), mentions: [i] })
                    } else {
                        conn.sendMessage(data.id, { caption: `Welcome @${i.split("@")[0]} in the group ${groupName}`, image: await getBuffer(pp_user), mentions: [i] })
                    }
                } else if (data.action == "remove" && isLeft) {
                    try {
                        var pp_user = await conn.profilePictureUrl(i, 'image')
                    } catch {
                        var pp_user = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                    }
                    if (isSetLeft(data.id, set_left_db)) {
                        var get_teks_left = getTextSetLeft(data.id, set_left_db)
                        var replace_pesan = (get_teks_left.replace(/@user/gi, `@${i.split('@')[0]}`))
                        var full_pesan = (replace_pesan.replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc))
                        conn.sendMessage(data.id, { caption: `${full_pesan}`, image: await getBuffer(pp_user), mentions: [i] })
                    } else {
                        conn.sendMessage(data.id, { caption: `Sayonara @${i.split("@")[0]}`, image: await getBuffer(pp_user), mentions: [i] })
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    })

    conn.ev.on('messages.delete', item => {
        if ('all' in item) {
            const list = messages[item.jid]
            list === null || list === void 0 ? void 0 : list.clear()
        }
        else {
            const jid = item.keys[0].remoteJid
            const list = messages[jid]
            if (list) {
                const idSet = new Set(item.keys.map(k => k.id));
                list.filter(m => !idSet.has(m.key.id))
            }
        }
    })
	
    conn.ev.on('creds.update', () => saveState)
	
	conn.reply = (from, content, msg) => conn.sendMessage(from, { text: content }, { quoted: msg })

    conn.ws.on('CB:call', async (json) => {
    const callerId = json.content[0].attrs['call-creator']
    console.log(`Telpon Masuk Dari ${callerId} Bot Otomatis Memblokir User`)
    conn.sendMessage(callerId, { text: `Maaf kamu terdektesi telpon bot, Bot akan blokir otomatis. Jika Mau Dibuka Silahkan Hubungi Ownerku\nWa.me/${setting.contactOwner}`})
    conn.updateBlockStatus(callerId, 'block')
    })

    conn.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    
    conn.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = conn.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

conn.getName = (jid, withoutContact = false) => {
        var id = conn.decodeJid(jid)
        withoutContact = conn.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = conn.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === conn.decodeJid(conn.user.id) ?
            conn.user :
            (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
        
    conn.setStatus = (status) => {
        conn.query({
            tag: 'iq',
            attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
            }]
        })
        return status
    }
        
    conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
        let list = []
        for (let i of kon) {
            list.push({
                lisplayName: await conn.getName(i + '@s.whatsapp.net'),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(i + '@s.whatsapp.net')}\nFN:${await conn.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
           })
        }
        return conn.sendMessage(jid, { contacts: { displayName: `${list.length} Contacts`, contacts: list }, ...opts }, { quoted })
    }
        
    conn.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype
        if (options.readViewOnce) {
            message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
            vtype = Object.keys(message.message.viewOnceMessage.message)[0]
            delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
            delete message.message.viewOnceMessage.message[vtype].viewOnce
            message.message = {
                ...message.message.viewOnceMessage.message
            }
        }

        let mtype = Object.keys(message.message)[0]
        let content = await generateForwardMessageContent(message, forceForward)
        let ctype = Object.keys(content)[0]
        let context = {}
        if (mtype != "conversation") context = message.message[mtype].contextInfo
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        }
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {})
        await conn.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
        return waMessage
    }
	
    conn.sendMessageFromContent = async(jid, message, options = {}) => {
        var option = { contextInfo: {}, ...options }
        var prepare = await generateWAMessageFromContent(jid, message, option)
        await conn.relayMessage(jid, prepare.message, { messageId: prepare.key.id })
        return prepare
    }
	
    conn.downloadAndSaveMediaMessage = async(msg, type_file, path_file) => {
	    if (type_file === 'image') {
	        var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
	        let buffer = Buffer.from([])
	        for await(const chunk of stream) {
	            buffer = Buffer.concat([buffer, chunk])
	        }
	        fs.writeFileSync(path_file, buffer)
	        return path_file
	    } else if (type_file === 'video') {
	        var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
	        let buffer = Buffer.from([])
	        for await(const chunk of stream) {
	            buffer = Buffer.concat([buffer, chunk])
	        }
	        fs.writeFileSync(path_file, buffer)
	        return path_file
	    } else if (type_file === 'sticker') {
	        var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
	        let buffer = Buffer.from([])
	        for await(const chunk of stream) {
	            buffer = Buffer.concat([buffer, chunk])
	        }
	        fs.writeFileSync(path_file, buffer)
	        return path_file
	    } else if (type_file === 'audio') {
	        var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
	        let buffer = Buffer.from([])
	        for await(const chunk of stream) {
	            buffer = Buffer.concat([buffer, chunk])
	        }
	        fs.writeFileSync(path_file, buffer)
	        return path_file
        }
    }
	
    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    conn.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
    
    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
     
    conn.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
	
    return conn
}

connectToWhatsApp()
.catch(err => console.log(err))
