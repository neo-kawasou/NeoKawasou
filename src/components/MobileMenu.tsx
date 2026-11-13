import { useEffect } from 'react'
import { Page } from '../types/page'
import { CURRENT_STAGE_LABEL, SNS } from '../data/site'
import { InstagramIcon, LogoMark, XIcon } from './ui'

type Props = {
  onNavigate: (page: Page) => void
  onClose: () => void
}

const MENU: { page: Page; label: string; en: string }[] = [
  { page: 'home', label: 'ホーム', en: 'HOME' },
  { page: 'next', label: '次回公演', en: 'NEXT STAGE' },
  { page: 'news', label: 'お知らせ', en: 'NEWS' },
  { page: 'about', label: 'ネオ・カワソウについて', en: 'ABOUT' },
  { page: 'contact', label: 'お問い合わせ', en: 'CONTACT' },
]

// スマホで開く全画面メニュー（赤い幕の背景）
export function MobileMenu({ onNavigate, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="curtain-stripes fixed inset-0 z-50 overflow-y-auto md:hidden" role="dialog" aria-modal="true">
      <div className="px-4 pb-10">
        {/* 上：ロゴと閉じるボタン */}
        <div className="flex h-16 items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3">
            <LogoMark className="h-10 w-10" />
            <span className="font-display text-lg text-paper">ネオ・カワソウ</span>
          </button>
          <button
            onClick={onClose}
            aria-label="メニューを閉じる"
            className="h-11 w-11 rounded-full border border-paper text-paper flex items-center justify-center"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* メニュー本体（紙のカード） */}
        <nav className="mt-4 rounded-lg border border-ink bg-cream px-5 py-2 shadow-[4px_4px_0_0_#1c1a17]">
          <ul>
            {MENU.map(({ page, label, en }, i) => (
              <li key={page} className="border-b border-dashed border-ink/30 last:border-b-0">
                <button onClick={() => onNavigate(page)} className="flex w-full items-start gap-4 py-5 text-left">
                  <span className="mt-1 font-mono text-xs text-curtain">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 font-display text-xl leading-snug">{label}</span>
                  <span className="mt-1 font-mono text-[11px] text-ink/60">{en}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 今の公演へのボタン */}
        <button
          onClick={() => onNavigate('next')}
          className="mt-6 flex w-full items-center justify-between rounded-full bg-ink px-6 py-4 text-sm font-bold text-paper"
        >
          <span>{CURRENT_STAGE_LABEL}</span>
          <span aria-hidden>→</span>
        </button>

        {/* SNS */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <a
            href={SNS.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-paper py-3 text-sm font-bold text-paper"
          >
            <InstagramIcon /> Instagram
          </a>
          <a
            href={SNS.x.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-paper py-3 text-sm font-bold text-paper"
          >
            <XIcon /> X
          </a>
        </div>
      </div>
    </div>
  )
}
