import { useCallback, useState } from 'react'
import { NewsItem, contentToHtml, formatDate, isNew } from '../data/newsSheet'
import { useNews } from '../data/useNews'
import { ImageViewer } from '../components/ImageViewer'
import { CategoryTag, ChevronIcon, NewBadge } from '../components/ui'
import { Page } from '../types/page'

// 本文中の画像（![説明](URL)）：クリックで拡大できることが分かるよう、カーソルを虫眼鏡にする
const INLINE_IMG_CLASS = 'my-3 w-full object-contain max-h-96 cursor-zoom-in hover:opacity-90 transition-opacity'

type Props = {
  id: string
  onBack: () => void
  onSelectNews: (id: string) => void
  onNavigate: (page: Page) => void
}

/* ---------- 記事の画像（複数ならスライドで切り替え） ---------- */

function ImageSlider({ images, title, onZoom }: { images: string[]; title: string; onZoom: (src: string) => void }) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const prev = () => setIndex((i) => (i - 1 + count) % count)
  const next = () => setIndex((i) => (i + 1) % count)

  return (
    <div>
      <div className="relative overflow-hidden rounded border border-ink bg-ink">
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => onZoom(src)}
              className="relative aspect-[16/9] min-w-full cursor-zoom-in overflow-hidden"
              aria-label={`${title}の画像${i + 1}を拡大`}
              tabIndex={i === index ? 0 : -1}
            >
              {/* 比率が合わないときの余白：同じ画像をぼかして敷く */}
              <img src={src} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl opacity-70" />
              <img src={src} alt={`${title}（${i + 1}枚目）`} className="relative h-full w-full object-contain" />
            </button>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="前の画像"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-ink bg-paper/90 flex items-center justify-center hover:bg-paper"
            >
              <ChevronIcon dir="left" />
            </button>
            <button
              onClick={next}
              aria-label="次の画像"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-ink/90 text-paper flex items-center justify-center hover:bg-ink"
            >
              <ChevronIcon dir="right" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}枚目`}
              className={`h-[5px] rounded-full transition-all ${index === i ? 'w-[18px] bg-curtain' : 'w-[5px] bg-ink/30'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- 前後の記事 ---------- */

function NeighborLink({ item, dir, onSelect }: { item?: NewsItem; dir: 'newer' | 'older'; onSelect: (id: string) => void }) {
  if (!item) return <div className="hidden md:block" />
  const newer = dir === 'newer'
  return (
    <button
      onClick={() => onSelect(item.id)}
      className={`group rounded-md border border-ink px-4 py-3 transition-colors hover:bg-paper ${newer ? 'text-left' : 'text-right'}`}
    >
      <span className="block font-mono text-[10px] tracking-wider text-ink/60">
        {newer ? '← NEWER' : 'OLDER →'}
      </span>
      <span className="mt-1 block truncate text-[13px] font-bold group-hover:text-curtain transition-colors">{item.title}</span>
    </button>
  )
}

/* ---------- ページ ---------- */

export function NewsDetail({ id, onBack, onSelectNews, onNavigate }: Props) {
  const { news: items, loading, error } = useNews()
  const [zoomed, setZoomed] = useState<string | null>(null)
  const closeZoom = useCallback(() => setZoomed(null), [])

  const index = items.findIndex((n) => n.id === id)
  const news = items[index]

  const breadcrumb = (
    <nav className="container-site max-w-[800px] pt-5 md:pt-6 text-[11px] text-ink/60" aria-label="現在地">
      <button onClick={() => onNavigate('home')} className="hover:text-curtain transition-colors">ホーム</button>
      <span className="mx-2">/</span>
      <button onClick={onBack} className="underline underline-offset-2 hover:text-curtain transition-colors">お知らせ</button>
      {news && (
        <>
          <span className="mx-2">/</span>
          <span>{news.title}</span>
        </>
      )}
    </nav>
  )

  const backButton = (
    <button
      onClick={onBack}
      className="rounded-full bg-ink px-7 py-3 text-[13px] font-bold text-paper hover:bg-curtain transition-colors"
    >
      お知らせ一覧へ
    </button>
  )

  if (loading) return <p className="py-16 text-center text-sm text-ink/60">読み込み中…</p>
  if (error) return <p className="py-16 text-center text-sm text-curtain">記事を読み込めませんでした</p>
  if (!news) {
    return (
      <div className="container-site py-16 text-center">
        <p className="mb-6 text-sm">記事が見つかりません</p>
        {backButton}
      </div>
    )
  }

  // 一覧は新しい順なので、1つ前が「新しい記事」、1つ後が「古い記事」
  const newer = items[index - 1]
  const older = items[index + 1]

  return (
    <>
      {breadcrumb}

      <div className="container-site max-w-[800px] pt-6 pb-14 md:pt-8 md:pb-20">
        <article className="rounded-md border border-ink bg-paper shadow-[6px_6px_0_0_#1c1a17] md:shadow-[8px_8px_0_0_#1c1a17]">
          {/* 日付・カテゴリ・タイトル */}
          <header className="border-b-2 border-dashed border-ink px-5 py-6 md:px-8 md:py-8">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[13px] text-ink/80">{formatDate(news.date)}</span>
              <CategoryTag category={news.category} />
              {isNew(news.date) && <NewBadge />}
            </div>
            <h1 className="mt-3 font-display text-[24px] md:text-[30px] leading-snug">{news.title}</h1>
          </header>

          <div className="px-5 py-6 md:px-8 md:py-8">
            {/* imageUrl 列の画像（2枚以上ならスライド） */}
            {news.imageUrls.length > 0 && (
              <div className="mb-7">
                <ImageSlider images={news.imageUrls} title={news.title} onZoom={setZoomed} />
              </div>
            )}

            {/* 本文 */}
            <div
              className="text-[14px] leading-loose"
              onClick={(e) => {
                const target = e.target as HTMLElement
                if (target instanceof HTMLImageElement) setZoomed(target.src)
              }}
              dangerouslySetInnerHTML={{ __html: contentToHtml(news.content, INLINE_IMG_CLASS) }}
            />

            {/* ボタン（スプレッドシートの linkLabel / linkUrl 列） */}
            {news.linkLabel && news.linkUrl && (
              <a
                href={news.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-curtain px-6 py-3.5 text-[13px] font-bold text-paper hover:brightness-110 transition"
              >
                {news.linkLabel} <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </article>

        {/* 前後の記事 */}
        {(newer || older) && (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <NeighborLink item={newer} dir="newer" onSelect={onSelectNews} />
            <NeighborLink item={older} dir="older" onSelect={onSelectNews} />
          </div>
        )}

        <div className="mt-8 text-center">{backButton}</div>
      </div>

      <ImageViewer src={zoomed} onClose={closeZoom} />
    </>
  )
}
