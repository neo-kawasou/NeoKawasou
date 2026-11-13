import './style.css'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CurtainIntro } from './components/CurtainIntro'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Next from './pages/Next'
import { News } from './pages/News'
import { NewsDetail } from './pages/NewsDetail'
import Special from './pages/Special'
import { Page } from './types/page'

// URL の # で直接開けるページ（QRコード用）。例：…/NeoKawasou/#/special
const HASH_PAGES: Partial<Record<string, Page>> = {
  '#/special': 'special',
}
// QRコードの URL（…/NeoKawasou/qr/）
// 本番では public/qr/index.html が #/special へ移動させる。開発サーバーでは直接ここに来るので、ここでも特典ページにする
const isQrPath = () => /\/qr\/?$/.test(window.location.pathname)

const pageFromHash = (): Page => {
  if (isQrPath()) {
    history.replaceState(null, '', `${import.meta.env.BASE_URL}#/special`)
    return 'special'
  }
  return HASH_PAGES[window.location.hash] ?? 'home'
}

function App() {
  const [page, setPage] = useState<Page>(pageFromHash)
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null)

  // 開いたまま URL の # が変わったとき（同じタブで QR を読んだときなど）にも切り替える
  useEffect(() => {
    const onHash = () => setPage(pageFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // ページを切り替えたら一番上から表示する
  const navigate = (next: Page) => {
    setPage(next)
    // 特典ページから他へ移ったら、URL の #/special を消しておく
    if (window.location.hash && HASH_PAGES[window.location.hash] !== next) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  const openNews = (id: string) => {
    setSelectedNewsId(id)
    navigate('newsDetail')
  }

  let content
  switch (page) {
    case 'about':
      content = <About onNavigate={navigate} />
      break
    case 'contact':
      content = <Contact onNavigate={navigate} />
      break
    case 'next':
      content = <Next onNavigate={navigate} />
      break
    case 'news':
      content = <News onSelectNews={openNews} onNavigate={navigate} />
      break
    case 'newsDetail':
      content = selectedNewsId && (
        <NewsDetail
          id={selectedNewsId}
          onBack={() => navigate('news')}
          onSelectNews={openNews}
          onNavigate={navigate}
        />
      )
      break
    case 'special':
      content = <Special onNavigate={navigate} />
      break
    default:
      content = <Home onNavigate={navigate} onSelectNews={openNews} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage={page === 'newsDetail' ? 'news' : page} onNavigate={navigate} />
      <main className="flex-1">{content}</main>
      <Footer onNavigate={navigate} compact={page !== 'home'} />
      {/* 初めて開いたときの緞帳 */}
      <CurtainIntro />
    </div>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
