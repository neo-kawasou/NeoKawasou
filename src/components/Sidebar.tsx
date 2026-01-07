type Page = 'home' | 'about' | 'contact'

type SidebarProps = {
  activePage: Page
  onNavigate: (page: Page) => void
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <a
            className={activePage === 'home' ? 'active' : ''}
            onClick={() => onNavigate('home')}
          >
            Home
          </a>
        </li>
        <li>
          <a
            className={activePage === 'about' ? 'active' : ''}
            onClick={() => onNavigate('about')}
          >
            About
          </a>
        </li>
        <li>
          <a
            className={activePage === 'contact' ? 'active' : ''}
            onClick={() => onNavigate('contact')}
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  )
}
