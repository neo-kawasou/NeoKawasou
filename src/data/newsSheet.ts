import Papa from 'papaparse'

export type NewsItem = {
  id: string
  date: string
  title: string
  content: string
  imageUrl?: string
}

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1veHd3SkWVGbnKN0S0TTneAZ-JjnQaI_amxoIDiJjCho/gviz/tq?tqx=out:csv&sheet=news'

// Google Drive の共有リンク → <img> で表示できるリンク
export function toDirectDriveLink(url: string | undefined): string | undefined {
  if (!url) return undefined
  const match = url.match(/\/file\/d\/([^/?]+)/) ?? url.match(/[?&]id=([^&]+)/)
  return match ? `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600` : url
}

// 本文の簡易記法（改行・**強調**・![alt](画像URL)）を HTML に変換
export function contentToHtml(text: string, imgClass: string): string {
  return text
    .replace(/\r?\n/g, '<br>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, url) => {
      return `<img src="${toDirectDriveLink(url)}" alt="${alt}" class="${imgClass}"/>`
    })
}

// 一覧のプレビュー用：画像や **強調** の記号を外し、改行をスペースにした本文
export function contentToPlainText(text: string): string {
  return text
    .replace(/!\[(.*?)\]\((.*?)\)/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\s*\r?\n\s*/g, ' ')
    .trim()
}

// スプレッドシートからお知らせ一覧を取得（新しい順）
export async function fetchNews(): Promise<NewsItem[]> {
  // ブラウザのキャッシュで古い内容が出ないよう、毎回違うURLにする
  const res = await fetch(`${SHEET_CSV_URL}&_=${Date.now()}`)
  if (!res.ok) throw new Error('fetch failed')
  const text = await res.text()

  const { data } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
    transform: (v) => v.trim(),
  })

  return data
    .filter((row) => row.id && row.date && row.title && row.content)
    .map((row) => ({
      id: row.id,
      date: row.date,
      title: row.title,
      content: row.content,
      imageUrl: toDirectDriveLink(row.imageUrl || undefined),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}
