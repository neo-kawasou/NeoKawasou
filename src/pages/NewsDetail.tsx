import { useEffect, useState } from 'react'
import { NewsItem, fetchNews, contentToHtml } from '../data/newsSheet'

type Props = {
  id: string
  onBack: () => void
}

export function NewsDetail({ id, onBack }: Props) {
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
      .then((items) => {
        const found = items.find((n) => n.id === id)
        if (!found) throw new Error('記事が見つかりません')
        setNews(found)
      })
      .catch((e) => {
        console.error(e)
        setError('記事を読み込めませんでした')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-6">読み込み中…</div>
  if (error) return <div className="text-center py-6 text-red-500">{error}</div>
  if (!news) return <div className="text-center py-6">記事が見つかりません</div>

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button onClick={onBack} className="text-blue-500 mb-4">
        ← 一覧へ戻る
      </button>
      <div className="text-sm text-gray-500">{news.date}</div>
      <h2 className="text-2xl font-bold mb-6">{news.title}</h2>
      {news.imageUrls.map((url, i) => (
        <img
          key={url + i}
          src={url}
          alt={`${news.title}（${i + 1}枚目）`}
          className="mb-4 w-full object-contain max-h-96"
        />
      ))}
      <div
        className="leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: contentToHtml(news.content, 'my-2 w-full object-contain max-h-96'),
        }}
      />
    </div>
  )
}
