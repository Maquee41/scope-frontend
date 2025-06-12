import { Link } from '@tanstack/react-router'

import { ModeToggle } from '@/components/mode-toggle'

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-white text-black">
      <nav className="flex justify-between">
        <div className="px-2 font-bold">
          <Link to="/">Scope</Link>
        </div>
        <div className="flex gap-2">
          <Link to="/login">Login</Link>
          <Link to="/profile">Prfoile</Link>
          <Link to="/workflow">Workflow</Link>
        </div>
      </nav>
      <ModeToggle />
    </header>
  )
}
