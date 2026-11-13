// 複数のページで使う小さな部品
import { ReactNode } from 'react'
import { LOGO } from '../data/site'

/* ---------- アイコン ---------- */

export function InstagramIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

// デザイン案に合わせて「×」の形
export function XIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  )
}

export function ChevronIcon({ dir, className = 'h-4 w-4' }: { dir: 'left' | 'right'; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )
}

/* ---------- ロゴ ---------- */

export function LogoMark({ className = 'h-10 w-10', bordered = true }: { className?: string; bordered?: boolean }) {
  return (
    <img
      src={LOGO}
      alt=""
      className={`${className} shrink-0 rounded-full bg-white object-cover ${bordered ? 'border-2 border-ink' : ''}`}
    />
  )
}

/* ---------- ラベル ---------- */

// お知らせのカテゴリ（公演＝赤、それ以外＝グレー）
export function CategoryTag({ category }: { category: string }) {
  if (!category) return null
  const isStage = category === '公演'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-[1px] text-[11px] font-bold leading-5 ${
        isStage ? 'border-curtain text-curtain' : 'border-ink/60 text-ink/70'
      }`}
    >
      {category}
    </span>
  )
}

export function NewBadge() {
  return (
    <span className="inline-block bg-mustard px-1.5 py-[1px] font-mono text-[10px] leading-4 text-ink">
      NEW
    </span>
  )
}

/* ---------- 見出し ---------- */

// 小さい英字ラベル＋極太の日本語見出し
export function SectionTitle({
  en,
  ja,
  dark = false,
  className = '',
}: {
  en: string
  ja: ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <p className={`eyebrow ${dark ? 'text-mustard' : 'text-curtain'}`}>{en}</p>
      <h2 className={`mt-2 font-display text-[26px] md:text-[28px] leading-tight ${dark ? 'text-paper' : 'text-ink'}`}>
        {ja}
      </h2>
    </div>
  )
}
