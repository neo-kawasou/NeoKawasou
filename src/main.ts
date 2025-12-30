import { createSidebar } from './components/sidebar'
import { renderHome } from './pages/home'
import { renderAbout } from './pages/about'
import { renderContact } from './pages/contact'

const app = document.getElementById('app')!

const content = document.createElement('main')

function navigate(page: string) {
  content.innerHTML = ''

  switch (page) {
    case 'about':
      content.appendChild(renderAbout())
      break
    case 'contact':
      content.appendChild(renderContact())
      break
    default:
      content.appendChild(renderHome())
  }
}

const sidebar = createSidebar(navigate)

app.appendChild(sidebar)
app.appendChild(content)

// 初期表示
navigate('home')
