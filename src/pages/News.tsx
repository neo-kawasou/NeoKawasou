import { useEffect, useState } from 'react'
import { NewsItem, fetchNews, contentToPlainText } from '../data/newsSheet'

export type { NewsItem }

type Props = {
  onSelectNews: (id: string) => void
  limit?: number
  titleOnly?: boolean
}

export function News({ onSelectNews, limit, titleOnly }: Props) {
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
      .then((sorted) => {
        setNewsList(limit ? sorted.slice(0, limit) : sorted)
      })
      .catch((e) => {
        console.error(e)
        setError('お知らせを読み込めませんでした')
      })
      .finally(() => setLoading(false))
  }, [limit])

  if (loading) return <div className="text-center py-6">読み込み中…</div>
  if (error) return <div className="text-center py-6 text-red-500">{error}</div>

  // トップページ用：日付とタイトルだけの一覧
  if (titleOnly) {
    return (
      <ul>
        {newsList.map((news) => (
          <li
            key={news.id}
            onClick={() => onSelectNews(news.id)}
            className="group flex items-center gap-4 px-2 py-4 cursor-pointer border-b border-dotted border-gray-300 last:border-b-0 hover:bg-[#f3f5f9] transition-colors"
          >
            <span className="text-sm text-[#3d5a8a] tabular-nums shrink-0">
              {news.date.replace(/-/g, '.')}
            </span>
            <span className="font-semibold flex-1">{news.title}</span>
            <span className="text-gray-400 group-hover:text-[#3d5a8a] group-hover:translate-x-1 transition">
              ›
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul>
      {newsList.map((news) => (
        <li
          key={news.id}
          onClick={() => onSelectNews(news.id)}
          className="p-4 cursor-pointer border-b hover:bg-gray-100"
        >
          <div className="text-sm text-gray-500">{news.date}</div>
          <div className="font-semibold mb-1">{news.title}</div>
          {/* 本文は冒頭2行だけ。はみ出した分は「…」になる */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {contentToPlainText(news.content)}
          </p>
        </li>
      ))}
    </ul>
  )
}
