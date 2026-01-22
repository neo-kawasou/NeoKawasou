import './style.css'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Next from './pages/Next'
import { Footer } from './components/Footer'
import { NewsDetail } from './pages/NewsDetail'
import { News } from './pages/News'
import { Page } from './types/page'

function App() {
  const [page, setPage] = useState<Page>('home')
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  let PageComponent

  switch (page) {
    case 'about':
      PageComponent = <About />
      break

    case 'contact':
      PageComponent = <Contact />
      break

    case 'next':
      PageComponent = <Next />
      break

    case 'news':
      PageComponent = (
        <News
          onSelectNews={(id) => {
            setSelectedNewsId(id)
            setPage('newsDetail')
          }}
        />
      )
      break

    case 'newsDetail':
      PageComponent = selectedNewsId && (
        <NewsDetail
          id={selectedNewsId}
          onBack={() => setPage('news')}
        />
      )
      break

    default:
      PageComponent = (
        <Home
          onNavigate={setPage}
          onSelectNews={(id) => {
            setSelectedNewsId(id)
            setPage('newsDetail')
          }}
        />
      )
  }

  return (
    <div className="h-screen flex flex-col overflow-x-hidden">
      <Header
        onToggleSidebar={() => setIsSidebarOpen(v => !v)}
        onNavigate={setPage}
      />

      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <Sidebar
            activePage={page === 'newsDetail' ? 'home' : page}
            onNavigate={setPage}
          />
        )}

        <main className="flex-1 min-w-0 overflow-x-hidden px-8 py-2">
          {PageComponent}
        </main>
      </div>

      <Footer />
    </div>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
