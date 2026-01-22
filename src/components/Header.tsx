import { Page } from '../types/page'

type HeaderProps = {
  onToggleSidebar: () => void
  onNavigate: (page: Page) => void
}

export function Header({ onToggleSidebar, onNavigate }: HeaderProps) {
  return (
    <header className="h-16 bg-slate-800 text-white flex items-center px-6 gap-4">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-md text-2xl"
      >
        ☰
      </button>

      <h1
        onClick={() => onNavigate('home')}
        className="
          font-bold
          text-lg
          cursor-pointer
          hover:text-gray-300
          transition-colors
        "
      >
        ネオ・カワソウのホームページ
      </h1>
    </header>
  )
}

