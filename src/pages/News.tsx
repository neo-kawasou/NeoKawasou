import { newsList } from '../data/news'

type Props = {
  onSelectNews: (id: string) => void
  limit?: number
}

export function News({ onSelectNews, limit }: Props) {
  const list = [...newsList]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, limit ?? newsList.length)

  return (
    <div className="max-w-3xl mx-auto mt-2">
      <h2 className="text-2xl font-bold mb-6 text-center">
        - 最新情報 -
      </h2>

      <ul>
        {list.map((news) => (
          <li
            key={news.id}
            onClick={() => onSelectNews(news.id)}
            className="
              p-4
              cursor-pointer
              hover:bg-gray-100
              transition
              border-b
              border-gray-200
              last:border-b-0
            "
          >
            <div className="text-sm text-gray-500">
              {news.date}
            </div>
            <div className="font-semibold">
              {news.title}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
