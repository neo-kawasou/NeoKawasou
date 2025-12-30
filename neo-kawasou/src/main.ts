import { about } from './pages/about'
import { contact } from './pages/contact'
import { home } from './pages/home'
import './style.css'

const content = document.getElementById('content') as HTMLElement

type Page = 'home' | 'about' | 'contact'

function render(page: Page) {
  switch (page) {
    case 'about':
      content.innerHTML = about()
      break
    case 'contact':
      content.innerHTML = contact()
      break
    default:
      content.innerHTML = home()
  }
}

// サイドバークリックを監視
document.querySelector('.sidebar')!.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  if (target.tagName !== 'A') return

  e.preventDefault()

  const page = target.dataset.page as Page
  render(page)
})

// 初期表示
render('home')
