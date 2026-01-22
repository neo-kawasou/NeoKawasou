import { useEffect, useState } from 'react'
import { NewsItem } from './News'

type Props = {
  id: string
  onBack: () => void
}

function toDirectDriveLink(url: string | undefined): string | undefined {
  if (!url) return undefined
  const match = url.match(/\/file\/d\/(.*?)\/view/)
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url
}

function contentToHtml(text: string): string {
  let html = text
  html = html.replace(/\n/g, '<br>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, url) => {
    const directUrl = toDirectDriveLink(url)
    return `<img src="${directUrl}" alt="${alt}" class="my-2 w-full object-contain max-h-96"/>`
  })
  return html
}

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1veHd3SkWVGbnKN0S0TTneAZ-JjnQaI_amxoIDiJjCho/gviz/tq?tqx=out:csv&sheet=news'

export function NewsDetail({ id, onBack }: Props) {
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(SHEET_CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed')
        return res.text()
      })
      .then((text) => {
        const lines = text.trim().split(/\r?\n/)
        const [, ...rows] = lines

        const items: NewsItem[] = []

        for (const line of rows) {
          const cols = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
          if (!cols || cols.length < 4) continue

          const [nid, date, title, content, imageUrl] = cols
          if (!nid || !date || !title || !content) continue

          items.push({
            id: nid.replace(/^"|"$/g, '').trim(),
            date: date.replace(/^"|"$/g, '').trim(),
            title: title.replace(/^"|"$/g, '').trim(),
            content: content.replace(/^"|"$/g, '').replace(/""/g, '"').trim(),
            imageUrl: imageUrl ? toDirectDriveLink(imageUrl.replace(/^"|"$/g, '')) : undefined,
          })
        }

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
      {news.imageUrl && (
        <img
          src={news.imageUrl}
          alt={news.title}
          className="mb-4 w-full object-contain max-h-96"
        />
      )}
      <div
        className="whitespace-pre-line leading-relaxed"
        dangerouslySetInnerHTML={{ __html: contentToHtml(news.content) }}
      />
    </div>
  )
}
