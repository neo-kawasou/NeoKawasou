import { useEffect, useState } from 'react'
import { Page } from '../types/page'
import { LogoMark } from './ui'
import { MobileMenu } from './MobileMenu'

type HeaderProps = {
  activePage: Page
  onNavigate: (page: Page) => void
}

// PC のヘッダーに並べるリンク（お問い合わせは赤いボタンで別に出す）
const NAV: { page: Page; label: string }[] = [
  { page: 'next', label: '次回公演' },
  { page: 'news', label: 'お知らせ' },
  { page: 'about', label: 'ネオ・カワソウについて' },
]

export function Header({ activePage, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  // メニューを開いている間は後ろのページをスクロールさせない
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const go = (page: Page) => {
    setMenuOpen(false)
    onNavigate(page)
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream border-b border-ink/40">
        <div className="container-site flex h-16 md:h-[86px] items-center justify-between">
          {/* ロゴ */}
          <button onClick={() => go('home')} className="flex items-center gap-3 group" aria-label="ホームへ">
            <LogoMark className="h-10 w-10 md:h-11 md:w-11" />
            <span className="font-display text-lg md:text-xl group-hover:text-curtain transition-colors">
              ネオ・カワソウ
            </span>
          </button>

          {/* PC：横並びのメニュー */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV.map(({ page, label }) => {
              const active = activePage === page
              return (
                <button
                  key={page}
                  onClick={() => go(page)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative py-2 text-[13px] font-bold tracking-wider transition-colors hover:text-curtain ${
                    active ? 'text-curtain' : ''
                  }`}
                >
                  {label}
                  {/* 今いるページには赤い下線 */}
                  {active && <span className="absolute -bottom-1 -left-3 -right-3 h-[2px] bg-curtain" />}
                </button>
              )
            })}
            <button
              onClick={() => go('contact')}
              aria-current={activePage === 'contact' ? 'page' : undefined}
              // お問い合わせページにいる間は黒いボタン
              className={`rounded-full px-5 py-2.5 text-[13px] font-bold tracking-wider text-paper hover:brightness-110 transition ${
                activePage === 'contact' ? 'bg-ink' : 'bg-curtain'
              }`}
            >
              お問い合わせ
            </button>
          </nav>

          {/* スマホ：メニューボタン */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="メニューを開く"
            className="md:hidden h-11 w-11 rounded-full border border-ink flex flex-col items-center justify-center gap-[5px]"
          >
            <span className="block h-[1.5px] w-4 bg-ink" />
            <span className="block h-[1.5px] w-4 bg-ink" />
          </button>
        </div>
      </header>

      {menuOpen && <MobileMenu onNavigate={go} onClose={() => setMenuOpen(false)} />}
    </>
  )
}
