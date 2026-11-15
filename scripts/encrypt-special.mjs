// 来場者特典の原稿（secret/special.json）と添付ファイル（PDF など）を
// パスワードで暗号化して、public/special.enc.json に書き出す。
//
// 使い方：  npm run encrypt-special -- 合言葉
//
// ・secret/ の中身は GitHub に上げない（.gitignore 済み）
// ・public/special.enc.json は暗号化済みなので上げてよい
// ・方式は src/data/specialCrypto.ts と同じにすること
//
// secret/special.json の書き方：
// {
//   "title": "見出し",
//   "body": "本文",
//   "attachments": [
//     { "label": "限定コンテンツ", "file": "限定コンテンツ.pdf" }   ← secret/ に置いたファイル名
//   ]
// }
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { webcrypto as crypto } from 'node:crypto'

const DIR = 'secret'
const SRC = join(DIR, 'special.json')
const OUT = 'public/special.enc.json'
const ITERATIONS = 250000
const WARN_MB = 10 // これより大きいと特典ページを開くのが遅くなる

const MIME = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

const password = process.argv[2]
if (!password) {
  console.error('パスワードを指定してください：  npm run encrypt-special -- 合言葉')
  process.exit(1)
}
if (!existsSync(SRC)) {
  console.error(`${SRC} がありません。原稿を作ってから実行してください。`)
  process.exit(1)
}

// 原稿が正しい形か確かめる
let content
try {
  content = JSON.parse(readFileSync(SRC, 'utf8'))
} catch (e) {
  console.error(`${SRC} の書き方に間違いがあります（" や , の付け忘れなど）：\n${e.message}`)
  process.exit(1)
}
if (typeof content.title !== 'string' || typeof content.body !== 'string') {
  console.error(`${SRC} には "title" と "body" を文字で書いてください。`)
  process.exit(1)
}

// 添付ファイルを読み込んで、中身を一緒に暗号化する
const attachments = []
let totalBytes = 0
for (const a of content.attachments ?? []) {
  const path = join(DIR, a.file ?? '')
  if (!a.file || !existsSync(path)) {
    console.error(`添付ファイル ${path} がありません。secret/ に置いて、ファイル名を合わせてください。`)
    process.exit(1)
  }
  const mime = MIME[extname(a.file).toLowerCase()]
  if (!mime) {
    console.error(`${a.file} は使えない種類のファイルです（PDF / PNG / JPG のみ）。`)
    process.exit(1)
  }
  totalBytes += statSync(path).size
  attachments.push({ label: a.label ?? a.file, file: a.file, mime, data: readFileSync(path).toString('base64') })
}
const payloadContent = { title: content.title, body: content.body, attachments }

const enc = new TextEncoder()
const salt = crypto.getRandomValues(new Uint8Array(16))
const iv = crypto.getRandomValues(new Uint8Array(12))
const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  baseKey,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
)
const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(payloadContent)))

const b64 = (buf) => Buffer.from(buf).toString('base64')
writeFileSync(
  OUT,
  JSON.stringify({ v: 1, iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), data: b64(data) }, null, 2) + '\n',
)

const mb = (n) => (n / 1024 / 1024).toFixed(1)
console.log(`暗号化しました → ${OUT}（${mb(statSync(OUT).size)} MB）`)
if (attachments.length) console.log(`添付：${attachments.map((a) => a.file).join('、')}（合計 ${mb(totalBytes)} MB）`)
if (totalBytes > WARN_MB * 1024 * 1024) {
  console.warn(`※ 添付ファイルが ${WARN_MB}MB を超えています。特典ページを開くのに時間がかかるかもしれません。`)
}
console.log('このあと npm run build → コミット → プッシュで公開されます。')
