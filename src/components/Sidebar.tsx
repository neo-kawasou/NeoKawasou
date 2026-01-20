import { Page } from "../types/page"

type SidebarProps = {
  activePage: Page
  onNavigate: (page: Page) => void
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-56 bg-slate-100 p-4 border-r">
      <ul className="space-y-2">
        {(['home', 'about', 'contact'] as Page[]).map((page) => {
          const isActive = activePage === page

          return (
            <li key={page}>
              <button
                onClick={() => onNavigate(page)}
                className={`
                  w-full text-left
                  px-3 py-2
                  rounded-md
                  transition-colors
                  ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-800'
                  }
                `}
              >
                {page}
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
