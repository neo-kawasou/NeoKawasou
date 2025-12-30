import './style.css'
import { home } from './pages/home'
import { about } from './pages/about'
import { contact } from './pages/contact'

const app = document.getElementById('app')!

function render(page: string) {
  switch (page) {
    case 'about':
      app.innerHTML = about()
      break
    case 'contact':
      app.innerHTML = contact()
      break
    default:
      app.innerHTML = home()
  }
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'A') {
    e.preventDefault()
    const page = target.getAttribute('data-page')
    if (page) render(page)
  }
})

render('home')
