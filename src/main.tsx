import './style.css'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import { Footer } from './components/Footer'

type Page = 'home' | 'about' | 'contact'

function App() {
  const [page, setPage] = useState<Page>('home')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const handleNavigate = (nextPage: Page) => {
    setPage(nextPage)
    setIsSidebarOpen(false) // ⭐ 遷移したら閉じる
  }

  let PageComponent
  switch (page) {
    case 'about':
      PageComponent = <About />
      break
    case 'contact':
      PageComponent = <Contact />
      break
    default:
      PageComponent = <Home />
  }

return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header onToggleSidebar={() => setIsSidebarOpen(v => !v)} />

      {/* 中央エリア */}
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <Sidebar activePage={page} onNavigate={handleNavigate} />
        )}

        <main className="flex-1 p-4 overflow-auto">
          {PageComponent}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
