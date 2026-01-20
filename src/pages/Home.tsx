import { Carousel } from '../components/Carousel'
import { Page } from '../types/page'

type Props = {
  onNavigate: (page: Page) => void
}

export default function Home({ onNavigate }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Carousel />
      {/* 画像をクリック */}
      <img
        src={`${import.meta.env.BASE_URL}images/next.png`}
        alt="Nextページへ"
        className="w-64 mx-auto cursor-pointer hover:opacity-80 transition"
        onClick={() => onNavigate('next')}
      />

      <div className="font-bold text-xl text-center">
        ネオ・カワソウのホームページ
      </div>
    </div>
  )
}