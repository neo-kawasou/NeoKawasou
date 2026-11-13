// 来場者特典の暗号を解く（ブラウザ用）
// 暗号化は scripts/encrypt-special.mjs で行う。方式は両方で同じにすること：
//   パスワード →（PBKDF2 / SHA-256 / ITERATIONS 回）→ 鍵 →（AES-GCM）→ 中身

export type SpecialContent = {
  title: string // ページの見出し
  body: string // 本文（お知らせと同じ書き方：改行・**太字**・[文字](URL)・![説明](画像URL)）
}

export type EncryptedPayload = {
  v: 1
  iterations: number
  salt: string // base64
  iv: string // base64
  data: string // base64（暗号化された中身）
}

const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

export async function decryptSpecial(payload: EncryptedPayload, password: string): Promise<SpecialContent> {
  const enc = new TextEncoder()
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: fromB64(payload.salt), iterations: payload.iterations, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )
  // パスワードが違うとここで失敗する（AES-GCM は改ざん・鍵違いを検出できる）
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(payload.iv) }, key, fromB64(payload.data))
  return JSON.parse(new TextDecoder().decode(plain)) as SpecialContent
}
