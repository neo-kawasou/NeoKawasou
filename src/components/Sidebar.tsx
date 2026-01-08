type Page = 'home' | 'about' | 'contact'

type SidebarProps = {
  activePage: Page
  onNavigate: (page: Page) => void
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-40 bg-slate-100 p-2">
      <ul className="space-y-2">
        {(['home', 'about', 'contact'] as Page[]).map((page) => (
          <li key={page}>
            <button
              className={`w-full text-left px-2 py-1 rounded ${
                activePage === page ? 'bg-blue-500 text-white' : ''
              }`}
              onClick={() => onNavigate(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
