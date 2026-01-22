import { Page } from '../types/page'

type SidebarProps = {
  activePage: Page
  onNavigate: (page: Page) => void
}

export function Sidebar({
  activePage,
  onNavigate,
}: SidebarProps) {
  return (
    <>
      {/* オーバーレイ（表示のみ・閉じない） */}
      <div
        className="
          fixed inset-0
          bg-black/40
          z-40
          md:hidden
          pointer-events-none
        "
      />

      <aside
        className="
          fixed md:static
          top-16 md:top-0
          left-0
          w-full md:w-56
          bg-slate-100
          border-b md:border-r
          z-50
        "
      >
        <ul
          className="
            flex flex-row md:flex-col
            gap-1
            p-2 md:p-4
          "
        >
          {(['home', 'about', 'contact'] as Page[]).map((page) => {
            const isActive = activePage === page

            return (
              <li key={page} className="flex-1 md:flex-none">
                <button
                  onClick={() => onNavigate(page)}
                  className={`
                    w-full
                    px-3 py-2
                    rounded-md
                    text-center md:text-left
                    transition-colors
                    ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-slate-200'
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
    </>
  )
}
