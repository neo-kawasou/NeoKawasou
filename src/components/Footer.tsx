const SNS_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/neo_kawasou',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'X（旧Twitter）',
    href: 'https://x.com/kawaso_geki',
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="h-12 shrink-0 bg-[#2b3f63] text-white text-xs flex items-center justify-between px-4 md:px-6">
      <span className="text-[#b9c7e0]">© 2026 ネオ・カワソウ</span>

      <div className="flex items-center gap-2">
        {SNS_LINKS.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
          >
            {icon}
          </a>
        ))}
      </div>
    </footer>
  )
}
