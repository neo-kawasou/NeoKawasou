type HeaderProps = {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="h-16 bg-slate-800 text-white flex items-center px-6 gap-4">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-md text-2xl"
      >
        ☰
      </button>
      <h1 className="font-bold text-lg">
        ネオ・カワソウのホームページ
      </h1>
    </header>
  )
}
