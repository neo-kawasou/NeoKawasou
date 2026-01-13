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
  <div className="h-screen flex flex-col overflow-x-hidden">
    <Header onToggleSidebar={() => setIsSidebarOpen(v => !v)} />

    <div className="flex flex-1 overflow-hidden">
      {isSidebarOpen && (
        <Sidebar activePage={page} onNavigate={setPage} />
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
