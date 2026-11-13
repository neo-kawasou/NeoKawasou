import { Page } from '../types/page'
import { SNS } from '../data/site'
import { InstagramIcon, XIcon } from './ui'

type Props = {
  onNavigate: (page: Page) => void
  compact?: boolean // トップ以外のページは1行の小さいフッター
}

const linkClass = 'text-[13px] text-paper/90 hover:text-mustard transition-colors text-left'

function SnsCircles() {
  return (
    <div className="flex gap-3 md:hidden">
      <a href={SNS.instagram.href} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
        className="h-11 w-11 rounded-full border border-paper/60 flex items-center justify-center">
        <InstagramIcon />
      </a>
      <a href={SNS.x.href} target="_blank" rel="noopener noreferrer" aria-label="X"
        className="h-11 w-11 rounded-full border border-paper/60 flex items-center justify-center">
        <XIcon />
      </a>
    </div>
  )
}

export function Footer({ onNavigate, compact = false }: Props) {
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (compact) {
    return (
      <footer className="bg-ink text-paper">
        <div className="container-site py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="font-display text-xl">ネオ・カワソウ</p>
            <ul className="hidden md:flex items-center gap-6 text-[12px]">
              <li><button onClick={() => onNavigate('home')} className={linkClass}>ホーム</button></li>
              <li><button onClick={() => onNavigate('next')} className={linkClass}>次回公演</button></li>
              <li><button onClick={() => onNavigate('about')} className={linkClass}>ネオ・カワソウについて</button></li>
              {Object.values(SNS).map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{s.label}</a>
                </li>
              ))}
            </ul>
            <SnsCircles />
          </div>
          <p className="mt-8 border-t border-paper/15 pt-5 text-[11px] text-paper/70">© 2026 ネオ・カワソウ</p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-ink text-paper">
      <div className="container-site py-12 md:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <p className="font-display text-xl">ネオ・カワソウ</p>

          {/* PC：リンクの列 */}
          <div className="hidden md:flex gap-10">
            <div>
              <p className="eyebrow text-mustard mb-4">STAGE</p>
              <ul className="space-y-3">
                <li><button onClick={() => onNavigate('next')} className={linkClass}>次回公演</button></li>
                <li><button onClick={() => onNavigate('news')} className={linkClass}>お知らせ</button></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-mustard mb-4">INFO</p>
              <ul className="space-y-3">
                <li><button onClick={() => onNavigate('about')} className={linkClass}>ネオ・カワソウについて</button></li>
                <li><button onClick={() => onNavigate('contact')} className={linkClass}>お問い合わせ</button></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-mustard mb-4">FOLLOW</p>
              <ul className="space-y-3">
                {Object.values(SNS).map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {s.label} {s.handle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <SnsCircles />
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-paper/15 pt-5">
          <p className="text-[11px] text-paper/70">© 2026 ネオ・カワソウ</p>
          <button onClick={toTop} className="hidden md:block font-mono text-[11px] tracking-wider hover:text-mustard transition-colors">
            PAGE TOP ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
