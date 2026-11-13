import { Page } from '../types/page'

type HeaderProps = {
  onToggleSidebar: () => void
  onNavigate: (page: Page) => void
}

export function Header({ onToggleSidebar, onNavigate }: HeaderProps) {
  return (
    <header className="h-16 bg-[#2b3f63] text-white flex items-center px-4 md:px-6 gap-3 shadow-md">
      {/* ロゴ＋タイトル */}
      <h1
        onClick={() => onNavigate('home')}
        className="flex items-center gap-3 cursor-pointer group min-w-0"
      >
        <img
          src={`${import.meta.env.BASE_URL}images/ロゴ.jpg`}
          alt="ネオ・カワソウ"
          className="h-12 w-12 shrink-0 rounded-full bg-white ring-2 ring-white/40 group-hover:ring-white transition"
        />
        <span className="font-bold text-lg tracking-wider truncate group-hover:text-[#d8e1f0] transition-colors">
          ネオ・カワソウのホームページ
        </span>
      </h1>

      {/* メニューボタン（右端） */}
      <button
        onClick={onToggleSidebar}
        aria-label="メニュー"
        className="ml-auto shrink-0 p-2 rounded-md hover:bg-white/10 transition-colors"
      >
        <span className="block w-6 h-[2px] bg-white" />
        <span className="block w-6 h-[2px] bg-white mt-[6px]" />
        <span className="block w-4 h-[2px] bg-white mt-[6px] ml-auto" />
      </button>
    </header>
  )
}
