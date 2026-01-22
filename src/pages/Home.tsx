import { Carousel } from '../components/Carousel'
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

      {/* 次回公演 */}
      <img
        src={`${import.meta.env.BASE_URL}images/次回公演(1).png`}
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

      {/* 最新情報 */}
      <section>
        <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
          <News
            limit={3}
            onSelectNews={onSelectNews}
          />
        </div>

        {/* もっと見る */}
        <div className="text-center mt-4">
          <button
            onClick={() => onNavigate('news')}
            className="
              px-6 py-2
              border border-gray-400
              rounded-full
              text-sm
              hover:bg-gray-200
              transition
            "
          >
            もっと見る
          </button>
        </div>
      </section>

      {/* お問い合わせ */}
      <section>
        <h2 className="my-3 font-bold text-xl text-center">
          - お問い合わせ -
        </h2>

        <div className="border border-gray-300 rounded-md p-4 bg-gray-50 text-sm">
          ご質問・ご相談等ございましたら、こちらからお気軽にお問い合わせください。
        </div>
      </section>
    </div>
  )
}
