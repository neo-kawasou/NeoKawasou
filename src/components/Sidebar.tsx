type SidebarProps = {
  onNavigate: (page: string) => void
  activePage: string
}

export function Sidebar({ onNavigate, activePage }: SidebarProps) {
  const pages = ['home', 'about', 'contact']

  return (
    <aside id="sidebar">
      <ul>
        {pages.map((page) => (
          <li key={page}>
            <a
              href="#"
              className={activePage === page ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                onNavigate(page)
              }}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
