import { Carousel } from '../components/Carousel'
import { SectionHeading } from '../components/SectionHeading'
import { Page } from '../types/page'
import { News } from './News'

type Props = {
  onNavigate: (page: Page) => void
  onSelectNews: (id: string) => void
}

export default function Home({ onNavigate, onSelectNews }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* カルーセル */}
      <Carousel onNavigate={onNavigate} />

      {/* 最新情報 */}
      <section>
        <SectionHeading en="NEWS" ja="お知らせ" />

        <div className="bg-white rounded-lg shadow-md border-t-4 border-[#3d5a8a] px-4 py-2">
          <News
            limit={3}
            titleOnly
            onSelectNews={onSelectNews}
          />

          {/* もっと見る（一覧の右下） */}
          <div className="text-right border-t border-gray-200 py-2">
            <button
              onClick={() => onNavigate('news')}
              className="text-sm text-[#3d5a8a] hover:underline"
            >
              もっと見る →
            </button>
          </div>
        </div>
      </section>

      {/* 次回公演 */}
      <img
        src={`${import.meta.env.BASE_URL}images/次回公演についてのバナー.png`}
        alt="次回公演へ"
        className="
          my-4
          mx-auto
          cursor-pointer
          hover:opacity-80
          transition
          max-w-full
        "
        onClick={() => onNavigate('next')}
      />

      {/* お問い合わせ */}
      <section>
        <SectionHeading en="CONTACT" ja="お問い合わせ" />

        <div className="bg-white rounded-lg shadow-md border-t-4 border-[#3d5a8a] px-4 py-2">
          <p className="px-2 py-4 text-sm leading-relaxed">
            ご質問・ご相談等ございましたら、
            <button
              onClick={() => onNavigate('contact')}
              className="text-[#3d5a8a] underline hover:opacity-70"
            >
              こちら
            </button>
            からお気軽にお問い合わせください。
          </p>
        </div>
      </section>
    </div>
  )
}
