import { useCallback, useEffect, useState } from 'react'
import { NewsItem, fetchNews, contentToHtml } from '../data/newsSheet'
import { ImageViewer } from '../components/ImageViewer'

// 記事内の画像：クリックで拡大できることが分かるよう、カーソルを虫眼鏡にする
const IMG_CLASS =
  'w-full object-contain max-h-96 cursor-zoom-in hover:opacity-90 transition-opacity'

type Props = {
  id: string
  onBack: () => void
}

export function NewsDetail({ id, onBack }: Props) {
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [zoomed, setZoomed] = useState<{ src: string; alt: string } | null>(null)
  const closeZoom = useCallback(() => setZoomed(null), [])

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
      <div
        className="leading-relaxed"
        // 本文中の画像（![説明](URL) で入れたもの）もクリックで拡大
        onClick={(e) => {
          const target = e.target as HTMLElement
          if (target instanceof HTMLImageElement) {
            setZoomed({ src: target.src, alt: target.alt })
          }
        }}
        dangerouslySetInnerHTML={{
          __html: contentToHtml(news.content, `my-2 ${IMG_CLASS}`),
        }}
      />

      {/* imageUrl 列の画像は本文の下にまとめて並べる */}
      {news.imageUrls.length > 0 && (
        <div className="mt-6 flex flex-col gap-4">
          {news.imageUrls.map((url, i) => (
            <img
              key={url + i}
              src={url}
              alt={`${news.title}（${i + 1}枚目）`}
              onClick={() => setZoomed({ src: url, alt: `${news.title}（${i + 1}枚目）` })}
              className={IMG_CLASS}
            />
          ))}
        </div>
      )}

      <ImageViewer
        src={zoomed?.src ?? null}
        alt={zoomed?.alt}
        onClose={closeZoom}
      />
    </div>
  )
}
