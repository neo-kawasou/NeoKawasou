import { useCallback, useEffect, useState } from 'react'
import { Page } from '../types/page'
import { SLIDES } from '../data/site'
import { ChevronIcon } from './ui'

type Props = {
  onNavigate: (page: Page) => void
}

const INTERVAL = 5000 // 自動で切り替わる間隔（ミリ秒）

export function Carousel({ onNavigate }: Props) {
  const [index, setIndex] = useState(0)
  const count = SLIDES.length

  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])

  // 自動送り（手で切り替えたら、そこから数え直す）
  useEffect(() => {
    const timer = setInterval(next, INTERVAL)
    return () => clearInterval(timer)
  }, [index, next])

  const open = (i: number) => {
    const slide = SLIDES[i]
    if (slide.page) onNavigate(slide.page)
    else if (slide.href) window.open(slide.href, '_blank', 'noopener,noreferrer')
  }

  const dots = (
    <div className="flex items-center gap-2.5">
      {SLIDES.map((s, i) => (
        <button
          key={s.title}
          onClick={() => setIndex(i)}
          aria-label={`${i + 1}枚目`}
          className={`h-[5px] rounded-full transition-all ${index === i ? 'w-[18px] bg-curtain' : 'w-[5px] bg-ink/30'}`}
        />
      ))}
    </div>
  )

  const arrowBase = 'h-11 w-11 md:h-12 md:w-12 shrink-0 rounded-full flex items-center justify-center transition'

  return (
    <div>
      <div className="flex items-center gap-6">
        {/* PC：左矢印 */}
        <button onClick={prev} aria-label="前へ" className={`${arrowBase} hidden md:flex border border-ink bg-paper hover:bg-cream`}>
          <ChevronIcon dir="left" />
        </button>

        {/* スライド本体：テープで貼った紙のような枠 */}
        <div className="relative flex-1 pr-3 pt-3 md:pr-4 md:pt-4">
          {/* 後ろの赤い紙 */}
          <div className="absolute inset-0 left-8 bottom-6 md:left-14 md:bottom-8 rounded bg-curtain" aria-hidden />

          <div className="relative overflow-hidden border border-ink bg-paper shadow-[5px_5px_0_0_#1c1a17] md:shadow-[7px_7px_0_0_#1c1a17]">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {SLIDES.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => open(i)}
                  className="relative min-w-full aspect-[2/1] overflow-hidden bg-ink"
                  aria-label={s.title}
                  tabIndex={i === index ? 0 : -1}
                >
                  {/* 比率が合わないときの余白：同じ画像をぼかして敷く */}
                  <img
                    src={s.image}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl opacity-80"
                  />
                  {/* メイン画像：切らずに全体を表示 */}
                  <img src={s.image} alt={s.title} className="relative h-full w-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* マスキングテープ */}
          <span className="absolute -top-0 left-6 md:left-8 h-5 md:h-6 w-16 md:w-20 -rotate-2 bg-mustard/90" aria-hidden />
          <span className="absolute -top-0 right-10 md:right-12 hidden md:block h-6 w-20 rotate-3 bg-mustard/90" aria-hidden />
        </div>

        {/* PC：右矢印 */}
        <button onClick={next} aria-label="次へ" className={`${arrowBase} hidden md:flex bg-ink text-paper hover:bg-curtain`}>
          <ChevronIcon dir="right" />
        </button>
      </div>

      {/* PC：下の線と枚数表示 */}
      <div className="hidden md:block mx-[72px] mt-6 border-t border-ink pt-5">
        <div className="flex items-center justify-end gap-5">
          <span className="font-mono text-xs">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          {dots}
        </div>
      </div>

      {/* スマホ：矢印と点 */}
      <div className="md:hidden mt-4 flex items-center justify-between">
        <button onClick={prev} aria-label="前へ" className={`${arrowBase} border border-ink bg-paper`}>
          <ChevronIcon dir="left" />
        </button>
        {dots}
        <button onClick={next} aria-label="次へ" className={`${arrowBase} bg-ink text-paper`}>
          <ChevronIcon dir="right" />
        </button>
      </div>
    </div>
  )
}
