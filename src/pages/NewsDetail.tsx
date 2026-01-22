import { newsList } from '../data/news'

type Props = {
  id: string
  onBack: () => void
}

export function NewsDetail({ id, onBack }: Props) {
  const news = newsList.find((n) => n.id === id)

  if (!news) {
    return <div className="p-4">記事が見つかりません</div>
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="text-blue-500 mb-4"
      >
        ← 一覧へ戻る
      </button>

      <div className="text-sm text-gray-500">{news.date}</div>
      <h2 className="text-2xl font-bold mb-6">{news.title}</h2>

      <div className="whitespace-pre-line leading-relaxed">
        {news.content}
      </div>
    </div>
  )
}
