import { StageCards } from '../components/StageCards'
import { LogoMark, SectionTitle } from '../components/ui'
import { ABOUT_TEXT } from '../data/site'
import { Page } from '../types/page'

type Props = {
  onNavigate: (page: Page) => void
}

// ネオ・カワソウについて：紹介文の下に、これまでの公演
export default function About({ onNavigate }: Props) {
  return (
    <>
      <section className="container-site py-12 md:py-20">
        <div className="md:flex md:items-center md:gap-14">
          <LogoMark className="mb-8 h-28 w-28 md:mb-0 md:h-[170px] md:w-[170px]" />
          <div>
            <SectionTitle en="ABOUT" ja="ネオ・カワソウについて" />
            <p className="mt-5 max-w-[560px] text-sm leading-loose">{ABOUT_TEXT}</p>
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="container-site py-14 md:py-16">
          <div className="mb-6 flex items-center gap-4">
            <span className="eyebrow text-mustard">STAGES</span>
            <h2 className="font-display text-lg md:text-xl">これまでの公演</h2>
            <span className="h-px flex-1 border-t border-dashed border-paper/30" />
          </div>
          <StageCards onNavigate={onNavigate} />
        </div>
      </section>
    </>
  )
}
