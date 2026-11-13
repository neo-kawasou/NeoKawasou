import { FormEvent, useCallback, useEffect, useState } from 'react'
import { ImageViewer } from '../components/ImageViewer'
import { LogoMark } from '../components/ui'
import { contentToHtml } from '../data/newsSheet'
import { EncryptedPayload, SpecialContent, decryptSpecial } from '../data/specialCrypto'
import { Page } from '../types/page'

type Props = {
  onNavigate: (page: Page) => void
}

// 暗号化された特典（scripts/encrypt-special.mjs で作る）
const PAYLOAD_URL = `${import.meta.env.BASE_URL}special.enc.json`

// 一度パスワードを入れたら、タブを閉じるまでは入れ直さなくてよい
const SESSION_KEY = 'neo-kawasou-special-pass'

const readSaved = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}
const save = (pass: string | null) => {
  try {
    if (pass) sessionStorage.setItem(SESSION_KEY, pass)
    else sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // 保存できない環境では、毎回入力してもらうだけ
  }
}

const IMG_CLASS = 'my-3 w-full object-contain max-h-[480px] rounded border border-ink cursor-zoom-in'

// 来場者特典ページ（QRコードから #/special で開く。メニューには出さない）
export default function Special({ onNavigate }: Props) {
  const [payload, setPayload] = useState<EncryptedPayload | null>(null)
  const [state, setState] = useState<'loading' | 'missing' | 'locked' | 'checking' | 'open'>('loading')
  const [content, setContent] = useState<SpecialContent | null>(null)
  const [password, setPassword] = useState('')
  const [wrong, setWrong] = useState(false)
  const [zoomed, setZoomed] = useState<string | null>(null)
  const closeZoom = useCallback(() => setZoomed(null), [])

  const unlock = useCallback(async (p: EncryptedPayload, pass: string) => {
    try {
      const c = await decryptSpecial(p, pass)
      setContent(c)
      setState('open')
      save(pass)
      return true
    } catch {
      return false
    }
  }, [])

  // 暗号化された特典を読み込む。前に入れたパスワードがあれば自動で開く
  useEffect(() => {
    let alive = true
    fetch(`${PAYLOAD_URL}?_=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('not found'))))
      .then(async (p: EncryptedPayload) => {
        if (!alive) return
        setPayload(p)
        const saved = readSaved()
        if (saved && (await unlock(p, saved))) return
        save(null)
        if (alive) setState('locked')
      })
      .catch(() => alive && setState('missing'))
    return () => {
      alive = false
    }
  }, [unlock])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!payload || !password) return
    setState('checking')
    setWrong(false)
    const ok = await unlock(payload, password.trim())
    if (!ok) {
      setWrong(true)
      setState('locked')
    }
  }

  const logout = () => {
    save(null)
    setContent(null)
    setPassword('')
    setState('locked')
  }

  /* ---------- 開いた後：特典の中身 ---------- */
  if (state === 'open' && content) {
    return (
      <section className="container-site max-w-[800px] py-10 md:py-16">
        <article className="rounded-md border border-ink bg-paper shadow-[6px_6px_0_0_#1c1a17] md:shadow-[8px_8px_0_0_#1c1a17]">
          <header className="border-b-2 border-dashed border-ink px-5 py-6 md:px-8 md:py-8">
            <p className="eyebrow text-curtain">SPECIAL</p>
            <h1 className="mt-3 font-display text-[24px] md:text-[30px] leading-snug">{content.title}</h1>
          </header>
          <div
            className="px-5 py-6 text-[14px] leading-loose md:px-8 md:py-8"
            onClick={(e) => {
              const t = e.target as HTMLElement
              if (t instanceof HTMLImageElement) setZoomed(t.src)
            }}
            dangerouslySetInnerHTML={{ __html: contentToHtml(content.body, IMG_CLASS) }}
          />
        </article>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="rounded-full bg-ink px-6 py-3 text-[13px] font-bold text-paper hover:bg-curtain transition-colors"
          >
            ホームへ
          </button>
          <button onClick={logout} className="rounded-full border border-ink px-6 py-3 text-[13px] font-bold hover:bg-paper transition-colors">
            ログアウト
          </button>
        </div>
        <ImageViewer src={zoomed} onClose={closeZoom} />
      </section>
    )
  }

  /* ---------- 開く前：パスワード入力 ---------- */
  return (
    <section className="container-site max-w-[480px] py-14 md:py-20">
      <div className="rounded-md border border-ink bg-paper px-6 py-8 text-center shadow-[6px_6px_0_0_#9e2b2b] md:px-8 md:py-10">
        <LogoMark className="mx-auto h-16 w-16" />
        <p className="eyebrow mt-5 text-curtain">SPECIAL</p>
        <h1 className="mt-2 font-display text-[22px] md:text-[24px]">ご来場の皆さまへ</h1>

        {state === 'loading' && <p className="mt-6 text-sm text-ink/60">読み込み中…</p>}

        {state === 'missing' && <p className="mt-6 text-sm text-ink/70">このページは準備中です。</p>}

        {(state === 'locked' || state === 'checking') && (
          <form onSubmit={onSubmit} className="mt-6 text-left">
            <label className="block text-[13px] font-bold">
              パスワード
              <input
                type="password"
                autoComplete="off"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パンフレットなどに記載のパスワード"
                className="mt-2 w-full rounded border border-ink bg-cream px-3 py-3 text-sm placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-curtain/40"
              />
            </label>
            {wrong && <p className="mt-2 text-[12px] font-bold text-curtain">パスワードが違います</p>}
            <button
              type="submit"
              disabled={state === 'checking' || !password}
              className="mt-5 w-full rounded-full bg-curtain py-3.5 text-[13px] font-bold text-paper hover:brightness-110 transition disabled:opacity-60"
            >
              {state === 'checking' ? '確認中…' : 'ログイン'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
