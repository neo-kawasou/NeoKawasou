import { NewsItem, contentToPlainText, formatDate, isNew } from '../data/newsSheet'
import { useNews } from '../data/useNews'
import { useState } from 'react'
import { Breadcrumb, CategoryTag, NewBadge } from '../components/ui'
import { Page } from '../types/page'

export type { NewsItem }

type ListProps = {
  onSelectNews: (id: string) => void
  limit?: number
  withPreview?: boolean // 本文の冒頭を2行だけ見せる
  filter?: (n: NewsItem) => boolean // 表示する記事をしぼる（カテゴリ絞り込み用）
  boxed?: boolean // 各行に白い背景をつける（お知らせページ用）
}

// お知らせの一覧（トップページとお知らせページで共通）
export function NewsList({ onSelectNews, limit, withPreview = false, filter, boxed = false }: ListProps) {
  const { news, loading, error } = useNews()

  if (loading) return <p className="py-8 text-center text-sm text-ink/60">読み込み中…</p>
  if (error) return <p className="py-8 text-center text-sm text-curtain">{error}</p>
  if (news.length === 0) return <p className="py-8 text-center text-sm text-ink/60">お知らせはまだありません</p>

  const filtered = filter ? news.filter(filter) : news
  const items = limit ? filtered.slice(0, limit) : filtered
  if (items.length === 0) return <p className="py-8 text-center text-sm text-ink/60">該当するお知らせはありません</p>

  return (
    <ul className={boxed ? 'border-t-2 border-ink bg-paper' : 'border-t border-ink'}>
      {items.map((n) => {
        const fresh = isNew(n.date)
        return (
          <li key={n.id} className="border-b border-ink/20">
            <button
              onClick={() => onSelectNews(n.id)}
              className={`group w-full py-5 md:py-6 text-left hover:bg-ink/[0.03] transition-colors ${boxed ? 'px-4 md:px-5' : 'px-1 md:px-1.5'}`}
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
                {/* 日付・カテゴリ（スマホでは NEW もここ） */}
                <div className="flex items-center gap-3 md:w-[220px] md:shrink-0 md:gap-0">
                  <span className="font-mono text-[13px] text-ink/80 md:w-[110px]">{formatDate(n.date)}</span>
                  <CategoryTag category={n.category} />
                  {fresh && <span className="md:hidden"><NewBadge /></span>}
                </div>

                {/* タイトル */}
                <span className="flex-1 font-bold text-[15px] group-hover:text-curtain transition-colors">
                  {n.title}
                </span>

                {/* PC：NEW と矢印 */}
                <span className="hidden md:flex items-center gap-5">
                  {fresh && <NewBadge />}
                  <span className="text-lg transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </span>
              </div>

              {withPreview && (
                <p className="mt-2 md:ml-[244px] text-sm leading-relaxed text-ink/70 line-clamp-2">
                  {contentToPlainText(n.content)}
                </p>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

// お知らせページ（カテゴリで絞り込み）
export function News({ onSelectNews, onNavigate }: { onSelectNews: (id: string) => void; onNavigate: (page: Page) => void }) {
  const { news } = useNews()
  const [category, setCategory] = useState<string>('すべて')

  // スプレッドシートの category 列にある種類を、出てくる順に並べる
  const categories = Array.from(new Set(news.map((n) => n.category).filter(Boolean)))
  const filter = category === 'すべて' ? undefined : (n: NewsItem) => n.category === category
  const count = filter ? news.filter(filter).length : news.length

  return (
    <>
      <Breadcrumb current="お知らせ" onHome={() => onNavigate('home')} />
      <section className="container-site max-w-[900px] py-10 md:py-14">
        <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-curtain">NEWS</p>
            <h1 className="mt-3 font-display text-[34px] md:text-[44px] leading-none">お知らせ</h1>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {['すべて', ...categories].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={`rounded-full border border-ink px-4 py-2 text-[12px] font-bold transition-colors ${
                    category === c ? 'bg-ink text-paper' : 'hover:bg-paper'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <NewsList onSelectNews={onSelectNews} filter={filter} boxed />
        {news.length > 0 && <p className="mt-6 text-right font-mono text-[11px] text-ink/60">{count} 件</p>}
      </section>
    </>
  )
}
