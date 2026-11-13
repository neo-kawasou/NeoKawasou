import { NewsItem, contentToPlainText, formatDate, isNew } from '../data/newsSheet'
import { useNews } from '../data/useNews'
import { CategoryTag, NewBadge, SectionTitle } from '../components/ui'

export type { NewsItem }

type ListProps = {
  onSelectNews: (id: string) => void
  limit?: number
  withPreview?: boolean // 本文の冒頭を2行だけ見せる（お知らせページ用）
}

// お知らせの一覧（トップページとお知らせページで共通）
export function NewsList({ onSelectNews, limit, withPreview = false }: ListProps) {
  const { news, loading, error } = useNews()

  if (loading) return <p className="py-8 text-center text-sm text-ink/60">読み込み中…</p>
  if (error) return <p className="py-8 text-center text-sm text-curtain">{error}</p>
  if (news.length === 0) return <p className="py-8 text-center text-sm text-ink/60">お知らせはまだありません</p>

  const items = limit ? news.slice(0, limit) : news

  return (
    <ul className="border-t border-ink">
      {items.map((n) => {
        const fresh = isNew(n.date)
        return (
          <li key={n.id} className="border-b border-ink/20">
            <button
              onClick={() => onSelectNews(n.id)}
              className="group w-full px-1 md:px-1.5 py-5 md:py-6 text-left hover:bg-ink/[0.03] transition-colors"
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

// お知らせページ
export function News({ onSelectNews }: { onSelectNews: (id: string) => void }) {
  return (
    <section className="container-site py-12 md:py-20">
      <SectionTitle en="NEWS" ja="お知らせ" className="mb-8 md:mb-10" />
      <NewsList onSelectNews={onSelectNews} withPreview />
    </section>
  )
}
