import { useEffect, useState } from 'react'

export type NewsItem = {
  id: string
  date: string
  title: string
  content: string
  imageUrl?: string
}

type Props = {
  onSelectNews: (id: string) => void
  limit?: number
}

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1veHd3SkWVGbnKN0S0TTneAZ-JjnQaI_amxoIDiJjCho/gviz/tq?tqx=out:csv&sheet=news'

// CSVセル整形
function cleanCell(cell: string | undefined): string {
  if (!cell) return ''
  return cell.replace(/^"|"$/g, '').replace(/""/g, '"').trim()
}

// Google Drive viewリンク → 直接リンク
function toDirectDriveLink(url: string | undefined): string | undefined {
  if (!url) return undefined
  const match = url.match(/\/file\/d\/(.*?)\/view/)
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url
}

// Markdown風をHTMLに変換
function contentToHtml(text: string): string {
  let html = text
  html = html.replace(/\n/g, '<br>')                // 改行
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // **強調**
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, url) => {
    const directUrl = toDirectDriveLink(url)
    return `<img src="${directUrl}" alt="${alt}" class="my-2 w-full object-contain max-h-64"/>`
  })
  return html
}

// CSVパース
function parseCSV(text: string): NewsItem[] {
  const lines = text.trim().split(/\r?\n/)
  const [, ...rows] = lines

  const items: NewsItem[] = []

  for (const line of rows) {
    const cols = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
    if (!cols || cols.length < 4) continue

    const [id, date, title, content, imageUrl] = cols
    if (!id || !date || !title || !content) continue

    items.push({
      id: cleanCell(id),
      date: cleanCell(date),
      title: cleanCell(title),
      content: cleanCell(content),
      imageUrl: imageUrl ? toDirectDriveLink(cleanCell(imageUrl)) : undefined,
    })
  }

  return items
}

export function News({ onSelectNews, limit }: Props) {
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(SHEET_CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed')
        return res.text()
      })
      .then((text) => {
        const data = parseCSV(text)
        const sorted = data.sort((a, b) => b.date.localeCompare(a.date))
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

  return (
    <ul>
      {newsList.map((news) => (
        <li
          key={news.id}
          onClick={() => onSelectNews(news.id)}
          className="p-4 cursor-pointer border-b hover:bg-gray-100"
        >
          <div className="text-sm text-gray-500">{news.date}</div>
          <div className="font-semibold mb-2">{news.title}</div>
          <div
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: contentToHtml(news.content) }}
          />
          {news.imageUrl && (
            <img
              src={news.imageUrl}
              alt={news.title}
              className="mt-2 max-h-64 w-full object-contain"
            />
          )}
        </li>
      ))}
    </ul>
  )
}
