import Papa from 'papaparse'

export type NewsItem = {
  id: string
  date: string
  title: string
  content: string
  imageUrls: string[]
}

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1veHd3SkWVGbnKN0S0TTneAZ-JjnQaI_amxoIDiJjCho/gviz/tq?tqx=out:csv&sheet=news'

// Google Drive の共有リンク → <img> で表示できるリンク
export function toDirectDriveLink(url: string | undefined): string | undefined {
  if (!url) return undefined
  const match = url.match(/\/file\/d\/([^/?]+)/) ?? url.match(/[?&]id=([^&]+)/)
  return match ? `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600` : url
}

// 本文の中で変換するもの（1回でまとめて探すので、変換結果が二重に変換されない）
//   ![説明](画像URL)      → 画像
//   [表示する文字](URL)   → 文字のリンク
//   https://...          → そのままリンク
const INLINE_PATTERN =
  /!\[(.*?)\]\((.*?)\)|\[(.+?)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>"）」]+)/g

const LINK_CLASS = 'text-[#3d5a8a] underline break-all hover:opacity-70'

function link(url: string, label: string): string {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">${label}</a>`
}

// 本文の簡易記法（改行・**強調**・画像・リンク）を HTML に変換
export function contentToHtml(text: string, imgClass: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(INLINE_PATTERN, (_, alt, imgUrl, label, labelUrl, bareUrl) => {
      if (imgUrl !== undefined) {
        return `<img src="${toDirectDriveLink(imgUrl)}" alt="${alt}" class="${imgClass}"/>`
      }
      if (labelUrl !== undefined) return link(labelUrl, label)
      return link(bareUrl, bareUrl)
    })
    .replace(/\r?\n/g, '<br>')
}

// 一覧のプレビュー用：画像や記号を外し、改行をスペースにした本文
export function contentToPlainText(text: string): string {
  return text
    .replace(/!\[(.*?)\]\((.*?)\)/g, '')
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '$1')
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
      // imageUrl 列には複数のURLを改行・スペース・カンマ区切りで書ける
      imageUrls: (row.imageUrl ?? '')
        .split(/[\s,、]+/)
        .filter(Boolean)
        .map((url) => toDirectDriveLink(url)!),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}
