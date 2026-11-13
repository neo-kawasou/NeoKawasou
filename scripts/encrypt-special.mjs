// 来場者特典の原稿（secret/special.json）をパスワードで暗号化して、
// public/special.enc.json に書き出す。
//
// 使い方：  npm run encrypt-special -- 合言葉
//
// ・secret/special.json は GitHub に上げない（.gitignore 済み）
// ・public/special.enc.json は暗号化済みなので上げてよい
// ・方式は src/data/specialCrypto.ts と同じにすること
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { webcrypto as crypto } from 'node:crypto'

const SRC = 'secret/special.json'
const OUT = 'public/special.enc.json'
const ITERATIONS = 250000

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
const content = JSON.parse(readFileSync(SRC, 'utf8'))
if (typeof content.title !== 'string' || typeof content.body !== 'string') {
  console.error(`${SRC} には "title" と "body" を文字で書いてください。`)
  process.exit(1)
}

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
const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(content)))

const b64 = (buf) => Buffer.from(buf).toString('base64')
writeFileSync(
  OUT,
  JSON.stringify({ v: 1, iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), data: b64(data) }, null, 2) + '\n',
)
console.log(`暗号化しました → ${OUT}`)
console.log('このあと npm run build → コミット → プッシュで公開されます。')
