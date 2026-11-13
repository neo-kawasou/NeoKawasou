import { Page } from '../types/page'
import { CONTACT_FORM_URL, SNS } from '../data/site'
import { InstagramIcon, SectionTitle, XIcon } from './ui'

type Props = {
  onNavigate: (page: Page) => void
}

// 赤いお問い合わせ欄（トップページの下）
export function ContactSection({ onNavigate }: Props) {
  // フォームのURLが決まるまでは、お問い合わせページへ移動する
  const openForm = () => {
    if (CONTACT_FORM_URL) window.open(CONTACT_FORM_URL, '_blank', 'noopener,noreferrer')
    else onNavigate('contact')
  }

  const pill = 'flex items-center justify-center gap-2 rounded-full border border-paper py-3 text-[13px] font-bold text-paper hover:bg-paper/10 transition-colors'

  return (
    <section className="bg-curtain text-paper">
      <div className="container-site py-14 md:py-16 md:flex md:items-center md:justify-between md:gap-12">
        <div>
          <SectionTitle en="CONTACT" ja="お問い合わせ" dark className="[&_p]:text-paper/80" />
          <p className="mt-5 text-sm leading-relaxed">
            ご質問・ご相談等ございましたら、こちらからお気軽にお問い合わせください。
          </p>
        </div>

        <div className="mt-8 md:mt-0 md:w-[245px] md:shrink-0">
          <button
            onClick={openForm}
            className="group flex w-full items-center justify-between rounded-full bg-paper px-6 py-4 text-sm font-bold text-ink hover:bg-cream transition-colors"
          >
            お問い合わせフォーム
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </button>

          {/* SNS（スマホではフッターにあるので PC だけ） */}
          <div className="mt-3 hidden md:grid grid-cols-2 gap-2">
            <a href={SNS.instagram.href} target="_blank" rel="noopener noreferrer" className={pill}>
              <InstagramIcon className="h-3.5 w-3.5" /> Instagram
            </a>
            <a href={SNS.x.href} target="_blank" rel="noopener noreferrer" className={pill}>
              <XIcon className="h-3.5 w-3.5" /> X
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
