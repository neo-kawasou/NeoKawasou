import { useCallback, useState } from 'react'
import { contentToHtml, formatDate, isNew } from '../data/newsSheet'
import { useNews } from '../data/useNews'
import { ImageViewer } from '../components/ImageViewer'
import { CategoryTag, NewBadge } from '../components/ui'

// 記事内の画像：クリックで拡大できることが分かるよう、カーソルを虫眼鏡にする
const IMG_CLASS =
  'w-full object-contain max-h-96 cursor-zoom-in hover:opacity-90 transition-opacity'

type Props = {
  id: string
  onBack: () => void
}

export function NewsDetail({ id, onBack }: Props) {
  const { news: items, loading, error } = useNews()
  const [zoomed, setZoomed] = useState<{ src: string; alt: string } | null>(null)
  const closeZoom = useCallback(() => setZoomed(null), [])

  const news = items.find((n) => n.id === id)

  const back = (
    <button onClick={onBack} className="group text-[13px] font-bold hover:text-curtain transition-colors">
      <span className="inline-block transition-transform group-hover:-translate-x-1" aria-hidden>←</span> お知らせ一覧へ
    </button>
  )

  if (loading) return <p className="py-16 text-center text-sm text-ink/60">読み込み中…</p>
  if (error) return <p className="py-16 text-center text-sm text-curtain">記事を読み込めませんでした</p>
  if (!news) {
    return (
      <div className="container-site py-16 text-center">
        <p className="mb-6 text-sm">記事が見つかりません</p>
        {back}
      </div>
    )
  }

  return (
    <article className="container-site max-w-[800px] py-10 md:py-16">
      {back}

      <header className="mt-8 border-b border-ink pb-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[13px] text-ink/80">{formatDate(news.date)}</span>
          <CategoryTag category={news.category} />
          {isNew(news.date) && <NewBadge />}
        </div>
        <h1 className="mt-3 font-display text-2xl md:text-3xl leading-snug">{news.title}</h1>
      </header>

      <div
        className="mt-8 leading-loose"
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
        <div className="mt-8 flex flex-col gap-4">
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

      <div className="mt-12 border-t border-ink/20 pt-6">{back}</div>

      <ImageViewer src={zoomed?.src ?? null} alt={zoomed?.alt} onClose={closeZoom} />
    </article>
  )
}
