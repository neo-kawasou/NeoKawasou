import './style.css'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import { Header } from './components/Header'
import { Footer } from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Next from './pages/Next'
import { News } from './pages/News'
import { NewsDetail } from './pages/NewsDetail'
import { Page } from './types/page'

function App() {
  const [page, setPage] = useState<Page>('home')
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null)

  // ページを切り替えたら一番上から表示する
  const navigate = (next: Page) => {
    setPage(next)
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
      content = <News onSelectNews={openNews} />
      break
    case 'newsDetail':
      content = selectedNewsId && <NewsDetail id={selectedNewsId} onBack={() => navigate('news')} />
      break
    default:
      content = <Home onNavigate={navigate} onSelectNews={openNews} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage={page === 'newsDetail' ? 'news' : page} onNavigate={navigate} />
      <main className="flex-1">{content}</main>
      <Footer onNavigate={navigate} compact={page !== 'home'} />
    </div>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
