import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Sidebar } from './components/Sidebar'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Contact } from './pages/Contact'

function App() {
  const [page, setPage] = useState('home')

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
    <div id="app" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onNavigate={setPage} activePage={page} />
      <main style={{ flex: 1, padding: '20px' }}>{PageComponent}</main>
    </div>
  )
}

const root = createRoot(document.getElementById('app')!)
root.render(<App />)
