import { useEffect, useState } from 'react'
import { LogoMark } from './ui'

// 一度見た人には出さないための目印（ブラウザのタブを閉じるまで覚えている）
const STORAGE_KEY = 'neo-kawasou-curtain-seen'

const MIN_WAIT = 1000 // 幕を最低これだけ見せる（ミリ秒）
const MAX_WAIT = 3500 // 読み込みが遅くても、これ以上は待たせない
const LIFT_TIME = 1400 // 幕が上がりきるまで（style.css の curtain-rise と同じ）

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

// 初めて開いたときに、緞帳（赤い幕）が上がってページが見える演出
// 幕の裏ではページの表示・お知らせや画像の読み込みが進んでいて、準備ができたら幕が上がる
export function CurtainIntro() {
  const [show, setShow] = useState(() => !alreadySeen() && !prefersReducedMotion())
  const [lifting, setLifting] = useState(false)

  useEffect(() => {
    if (!show) return
    markSeen()
    document.body.style.overflow = 'hidden' // 幕が上がりきるまでスクロールさせない

    let alive = true
    // 「最低1秒」と「準備完了」の両方がそろったら上げる。ただし最長3.5秒で必ず上げる
    Promise.race([Promise.all([wait(MIN_WAIT), pageReady()]), wait(MAX_WAIT)]).then(() => {
      if (alive) setLifting(true)
    })

    return () => {
      alive = false
      document.body.style.overflow = ''
    }
  }, [show])

  // 念のため：動きの終わりの合図が来なくても、上がりきる頃には必ず消す
  useEffect(() => {
    if (!lifting) return
    const timer = setTimeout(() => setShow(false), LIFT_TIME + 200)
    return () => clearTimeout(timer)
  }, [lifting])

  if (!show) return null

  return (
    <div
      // -bottom-[26px]：裾の丸み（style.css の --hem）の分だけ幕を長くして、画面の下に隙間を作らない
      className={`curtain-drape fixed inset-x-0 top-0 -bottom-[26px] z-[200] flex items-center justify-center ${lifting ? 'curtain-rise' : ''}`}
      onAnimationEnd={(e) => {
        // 幕そのものが上がりきったら消す（中のロゴの動きでは消さない）
        if (e.target === e.currentTarget && lifting) setShow(false)
      }}
      onClick={() => setShow(false)} // 待てない人はクリックで飛ばせる
      aria-hidden
    >
      <div className="curtain-logo flex flex-col items-center gap-4">
        <LogoMark className="h-24 w-24 md:h-28 md:w-28 shadow-[0_6px_18px_rgba(0,0,0,0.45)]" />
        <p className="font-display text-2xl text-paper drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] md:text-3xl">
          ネオ・カワソウ
        </p>
      </div>
    </div>
  )
}
