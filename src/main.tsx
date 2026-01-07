import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import { Sidebar } from './components/Sidebar'


export type Page = 'home' | 'about' | 'contact'

function App() {
  const [page, setPage] = useState<Page>('home')
  console.log('Current page:', page)

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onNavigate={setPage} activePage={page} />
      <main style={{ flex: 1, padding: '20px' }}>
        {page === 'home' && <Home />}
        {page === 'about' && <About />}
        {page === 'contact' && <Contact />}
      </main>
    </div>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
