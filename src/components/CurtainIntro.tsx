import { useEffect, useState } from 'react'
import { LogoMark } from './ui'

// 一度見た人には出さないための目印（ブラウザのタブを閉じるまで覚えている）
const STORAGE_KEY = 'neo-kawasou-curtain-seen'

const MIN_WAIT = 500 // ロゴを最低これだけ見せる（ミリ秒）
const MAX_WAIT = 3000 // 読み込みが遅くても、これ以上は待たせない
const TOTAL_AFTER_LIFT = 1650 // 幕が上がり始めてから飾り幕まで上がりきるまで（style.css のタイムライン）
const OPENING_TIME = 2300 // ページが順に現れ終わるまで（style.css の stage-in）

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // 保存できない環境（プライベートモードなど）では毎回出るだけなので何もしない
  }
}

// 動きを減らす設定の人には、緞帳を出さない
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// ページの準備（フォントと画像の読み込み）が終わるのを待つ
function pageReady(): Promise<void> {
  const fonts = document.fonts?.ready ?? Promise.resolve()
  const loaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }))
  return Promise.all([fonts, loaded]).then(() => undefined)
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/* ---------- 幕の裾の波形（横にくり返す） ---------- */

function WavyEdge({ id, fill, className }: { id: string; fill: string; className: string }) {
  return (
    <svg className={className} preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id={id} width="26" height="16" patternUnits="userSpaceOnUse">
          <path d="M0 0 Q13 16 26 0 Z" fill={fill} stroke="#1c1a17" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// 初めて開いたときの緞帳。幕の裏ではページの表示・読み込みが進み、準備ができたら幕が上がる
export function CurtainIntro() {
  const [show, setShow] = useState(() => !alreadySeen() && !prefersReducedMotion())
  const [lifting, setLifting] = useState(false)

  // 準備ができたら幕を上げる
  useEffect(() => {
    if (!show) return
    markSeen()
    document.body.style.overflow = 'hidden' // 幕が上がりきるまでスクロールさせない

    let alive = true
    Promise.race([Promise.all([wait(MIN_WAIT), pageReady()]), wait(MAX_WAIT)]).then(() => {
      if (alive) setLifting(true)
    })
    return () => {
      alive = false
      document.body.style.overflow = ''
    }
  }, [show])

  // 幕が上がり始めたら「開演」：ページを順に登場させ、上がりきったら幕を片付ける
  useEffect(() => {
    if (!lifting) return
    const root = document.documentElement
    root.classList.add('stage-opening')
    const hide = setTimeout(() => setShow(false), TOTAL_AFTER_LIFT)
    const done = setTimeout(() => root.classList.remove('stage-opening'), OPENING_TIME)
    return () => {
      clearTimeout(hide)
      clearTimeout(done)
    }
  }, [lifting])

  // 途中でクリックして飛ばしたときも、ページが消えたままにならないよう片付ける
  const skip = () => {
    document.documentElement.classList.remove('stage-opening')
    setShow(false)
  }

  if (!show) return null

  return (
    <div onClick={skip} aria-hidden className="cursor-pointer">
      {/* 本幕 */}
      <div className={`curtain-drape fixed inset-x-0 top-0 -bottom-[20px] z-[200] ${lifting ? 'curtain-rise' : ''}`}>
        {/* 裾：黄色の縁取りと波形 */}
        <div className="absolute inset-x-0 bottom-[16px] h-[6px] bg-mustard border-y border-ink/60" />
        <WavyEdge id="curtain-hem" fill="#9e2b2b" className="absolute inset-x-0 bottom-0 h-4 w-full" />

        {/* スポットライトとロゴ */}
        <div
          className={`curtain-spot absolute left-1/2 top-[46%] h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full ${
            lifting ? 'curtain-spot-off' : ''
          }`}
        />
        <div className="curtain-logo absolute inset-0 flex flex-col items-center justify-center gap-3.5">
          <LogoMark className="h-24 w-24 border-[2.5px] border-ink shadow-[5px_5px_0_0_#1c1a17]" bordered={false} />
          <p className="font-display text-2xl tracking-[0.06em] text-paper">ネオ・カワソウ</p>
        </div>
      </div>

      {/* 飾り幕（一文字幕）：画面のいちばん上。本幕より少し遅れて上がる */}
      <div className={`fixed inset-x-0 top-0 z-[201] ${lifting ? 'valance-rise' : ''}`}>
        <div className="h-[5px] bg-mustard" />
        <div className="h-[19px] bg-[#5e1414]" />
        <WavyEdge id="curtain-valance" fill="#5e1414" className="block h-4 w-full" />
      </div>
    </div>
  )
}
