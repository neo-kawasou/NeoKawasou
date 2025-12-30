export function createSidebar(onNavigate: (page: string) => void): HTMLElement {
  const sidebar = document.createElement('nav')
  sidebar.className = 'sidebar'

  sidebar.innerHTML = `
    <ul>
      <li data-page="home">Home</li>
      <li data-page="about">About</li>
    </ul>
  `

  sidebar.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const page = target.dataset.page
    if (page) onNavigate(page)
  })

  return sidebar
}
