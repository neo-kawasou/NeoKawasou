import { Page } from '../types/page'

type SidebarProps = {
  activePage: Page
  onNavigate: (page: Page) => void
  onClose: () => void
}

const MENU: { page: Page; label: string }[] = [
  { page: 'home', label: 'ホーム' },
  { page: 'next', label: '次回公演' },
  { page: 'news', label: 'お知らせ' },
  { page: 'about', label: 'ネオ・カワソウについて' },
  { page: 'contact', label: 'お問い合わせ' },
]

export function Sidebar({ activePage, onNavigate, onClose }: SidebarProps) {
  const handleClick = (page: Page) => {
    onNavigate(page)
    // スマホではページを選んだらメニューを閉じる
    if (window.innerWidth < 768) onClose()
  }

  return (
    <>
      {/* スマホ用：後ろを暗くする。タップでメニューを閉じる */}
      <div
        onClick={onClose}
        className="fixed inset-0 top-16 bg-black/40 z-40 md:hidden"
      />

      <aside
        className="
          fixed md:static
          top-16 left-0 right-0
          md:w-60 shrink-0
          bg-white
          shadow-lg md:shadow-none
          md:border-l md:border-gray-200
          z-50
        "
      >
        <nav>
          <ul className="py-2">
            {MENU.map(({ page, label }) => {
              const isActive = activePage === page

              return (
                <li key={page}>
                  <button
                    onClick={() => handleClick(page)}
                    className={`
                      w-full flex items-center justify-between
                      pl-5 pr-4 py-4
                      border-l-4
                      text-left
                      transition-colors
                      ${
                        isActive
                          ? 'border-[#3d5a8a] bg-[#f3f5f9] text-[#2b3f63] font-bold'
                          : 'border-transparent text-gray-700 hover:bg-[#f3f5f9] hover:text-[#2b3f63]'
                      }
                    `}
                  >
                    <span>{label}</span>
                    <span className={isActive ? 'text-[#3d5a8a]' : 'text-gray-300'}>›</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
