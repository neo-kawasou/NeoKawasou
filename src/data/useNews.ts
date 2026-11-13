import { useEffect, useState } from 'react'
import { NewsItem, fetchNews } from './newsSheet'

// 1回開いたページの中では、スプレッドシートを読むのは1回だけにする
// （トップページのスライド下とお知らせ一覧で同じデータを使うため）
let cache: Promise<NewsItem[]> | null = null

function loadNews(): Promise<NewsItem[]> {
  if (!cache) {
    cache = fetchNews().catch((e) => {
      cache = null // 失敗したら次回やり直す
      throw e
    })
  }
  return cache
}

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    loadNews()
      .then((items) => alive && setNews(items))
      .catch((e) => {
        console.error(e)
        if (alive) setError('お知らせを読み込めませんでした')
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return { news, loading, error }
}
