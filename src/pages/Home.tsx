import { Carousel } from '../components/Carousel'
import { ContactSection } from '../components/ContactSection'
import { StageCards } from '../components/StageCards'
import { LogoMark, SectionTitle } from '../components/ui'
import { ABOUT_TEXT } from '../data/site'
import { Page } from '../types/page'
import { NewsList } from './News'

type Props = {
  onNavigate: (page: Page) => void
  onSelectNews: (id: string) => void
}

export default function Home({ onNavigate, onSelectNews }: Props) {
  return (
    <>
      {/* スライド */}
      <section className="border-b border-ink/40">
        <div className="container-site py-8 md:py-10">
          <Carousel onNavigate={onNavigate} />
        </div>
      </section>

      {/* お知らせ */}
      <section className="bg-paper">
        <div className="container-site py-12 md:py-14 md:flex md:gap-12">
          <div className="mb-6 flex items-end justify-between md:mb-0 md:block md:w-[200px] md:shrink-0">
            <SectionTitle en="NEWS" ja="お知らせ" />
            <button
              onClick={() => onNavigate('news')}
              className="group text-[13px] font-bold md:mt-8"
            >
              <span className="md:hidden">一覧</span>
              <span className="hidden md:inline">すべてのお知らせ</span>
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1" aria-hidden>→</span>
            </button>
          </div>
          <div className="flex-1">
            <NewsList onSelectNews={onSelectNews} limit={3} />
          </div>
        </div>
      </section>

      {/* ネオ・カワソウについて ＋ これまでの公演（黒い背景） */}
      <section className="bg-ink text-paper">
        <div className="container-site py-14 md:py-16">
          <div className="md:flex md:items-center md:gap-14">
            {/* PC：大きいロゴ */}
            <div className="hidden md:flex h-[190px] w-[190px] shrink-0 items-center justify-center rounded-full border border-mustard">
              <LogoMark className="h-[170px] w-[170px]" bordered={false} />
            </div>
            <div>
              <SectionTitle en="ABOUT" ja="ネオ・カワソウについて" dark />
              <p className="mt-5 max-w-[400px] text-sm leading-loose text-paper/85">{ABOUT_TEXT}</p>
            </div>
          </div>

          {/* これまでの公演 */}
          <div className="mt-14 md:mt-20">
            <div className="mb-6 flex items-center gap-4">
              <span className="eyebrow text-mustard">STAGES</span>
              <h2 className="font-display text-lg md:text-xl">これまでの公演</h2>
              <span className="h-px flex-1 border-t border-dashed border-paper/30" />
              <button
                onClick={() => onNavigate('about')}
                className="group shrink-0 text-[12px] font-bold text-paper/80 hover:text-mustard transition-colors"
              >
                すべて見る
                <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-1" aria-hidden>→</span>
              </button>
            </div>
            {/* トップは最新3件だけ。全部はネオ・カワソウについてのページで */}
            <StageCards onNavigate={onNavigate} latest={3} />
          </div>
        </div>
      </section>

      <ContactSection onNavigate={onNavigate} />
    </>
  )
}
