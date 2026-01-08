type HeaderProps = {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="h-12 bg-slate-800 text-white flex items-center px-4 gap-4">
     <button
        onClick={onToggleSidebar}
        className="
            p-2
            rounded-md
            text-2xl
            transition-colors duration-200
        "
        >
        ☰
      </button>
      <h1 className="font-bold">ネオ・カワソウのホームページ</h1>
    </header>
  )
}
