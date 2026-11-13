import { StageCards } from '../components/StageCards'
import { Breadcrumb, InstagramIcon, LogoMark, XIcon } from '../components/ui'
import { ABOUT_TEXT, CONTACT_FORM_URL, SNS } from '../data/site'
import { Page } from '../types/page'

type Props = {
  onNavigate: (page: Page) => void
}

// ネオ・カワソウについて：紹介文 → これまでの公演（押すと詳細） → お問い合わせ
export default function About({ onNavigate }: Props) {
  const snsPill =
    'inline-flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-[12px] font-bold hover:bg-paper transition-colors'

  const openContact = () => {
    if (CONTACT_FORM_URL) window.open(CONTACT_FORM_URL, '_blank', 'noopener,noreferrer')
    else onNavigate('contact')
  }

  return (
    <>
      <Breadcrumb current="ネオ・カワソウについて" onHome={() => onNavigate('home')} />

      {/* 紹介 */}
      <section className="container-site py-10 md:py-14">
        <div className="md:flex md:items-center md:gap-14">
          {/* ロゴ：外側に赤い点線の輪 */}
          <div className="mx-auto mb-8 flex h-[160px] w-[160px] items-center justify-center rounded-full border border-dashed border-curtain md:mx-0 md:mb-0 md:h-[220px] md:w-[220px] md:shrink-0">
            <LogoMark className="h-[140px] w-[140px] md:h-[196px] md:w-[196px] border-[3px] border-ink" bordered={false} />
          </div>

          <div>
            <p className="eyebrow text-curtain">ABOUT</p>
            <h1 className="mt-3 font-display text-[32px] md:text-[40px] leading-[1.25]">
              ネオ・カワソウ
              <br />
              について
            </h1>
            <p className="mt-5 max-w-[560px] text-sm leading-loose text-ink/80">{ABOUT_TEXT}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={SNS.instagram.href} target="_blank" rel="noopener noreferrer" className={snsPill}>
                <InstagramIcon className="h-3.5 w-3.5" /> {SNS.instagram.handle}
              </a>
              <a href={SNS.x.href} target="_blank" rel="noopener noreferrer" className={snsPill}>
                <XIcon className="h-3.5 w-3.5" /> {SNS.x.handle}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* これまでの公演 */}
      <section className="bg-ink text-paper">
        <div className="container-site py-14 md:py-16">
          <div className="mb-8 md:flex md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-mustard">STAGES</p>
              <h2 className="mt-2 font-display text-[26px] md:text-[32px]">これまでの公演</h2>
            </div>
            <p className="mt-2 text-[11px] text-paper/60 md:mt-0">カードを押すと公演の詳細が開きます</p>
          </div>
          <StageCards onNavigate={onNavigate} showDetailLink />
        </div>
      </section>

      {/* お問い合わせ */}
      <section className="bg-curtain text-paper">
        <div className="container-site py-12 md:flex md:items-center md:justify-between md:py-14">
          <div>
            <p className="eyebrow text-paper/80">CONTACT</p>
            <h2 className="mt-2 font-display text-[22px] md:text-[26px]">出演・取材のご相談はこちら</h2>
          </div>
          <button
            onClick={openContact}
            className="group mt-6 inline-flex items-center gap-4 rounded-full bg-paper px-6 py-3.5 text-[13px] font-bold text-ink hover:bg-cream transition-colors md:mt-0"
          >
            お問い合わせ
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </button>
        </div>
      </section>
    </>
  )
}
