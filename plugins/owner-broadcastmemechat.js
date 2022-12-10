import Connection from '../lib/connection.js'
import { delay, ranNumb, readMore } from '../lib/others.js'
import { randomBytes } from 'crypto'

let handler = async (m, { conn, text, usedPrefix, command }) => {
	let chats = Object.entries(Connection.store.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && !jid.startsWith('212') && chat.isChats).map(v => v[0])
	let cc = conn.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : false || m)
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	if (/image/g.test(mime) || /video/g.test(mime)) {
		if (!text) throw `teks nya mana ?`
		let img = await q.download?.()
		conn.reply(m.chat, `_Mengirim pesan broadcast ke ${chats.length} chat_`, m)
		let wkt
		for (let id of chats) {
			try {
				await conn.sendFile(id, img, '', `${text}\n\n_*「 Just BC-Bot 」*_`)
				wkt = ranNumb(3000, 6000)
				await delay(wkt)
			} catch (e) {
				console.log(e)
			}
		}
		m.reply('Selesai Broadcast All Private Chat :)')
	} else {
		m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim`)
	}
}
handler.menuowner = ['bcmemechat'].map(v => v + ' <teks>')
handler.tagsowner = ['owner']
handler.command = /^((broadcast|bc)memechats?)$/i

handler.owner = true

export default handler