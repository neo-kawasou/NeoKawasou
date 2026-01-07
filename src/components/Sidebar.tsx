import { Page } from "../main"

type Props = {
  onNavigate: (page: Page) => void
  activePage: Page
}

export default function Sidebar({ onNavigate, activePage }: Props) {
  return (
    <nav className="sidebar">
      <button onClick={() => onNavigate('home')}>Home</button>
      <button onClick={() => onNavigate('about')}>About</button>
      <button onClick={() => onNavigate('contact')}>Contact</button>
    </nav>
  )
}
