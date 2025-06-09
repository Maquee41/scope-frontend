import { Link } from '@tanstack/react-router'

import { ModeToggle } from '@/components/mode-toggle'

export default function Header() {
	return (
		<header className='p-2 flex gap-2 bg-white text-black justify-between'>
			<nav className='flex flex-row'>
				<div className='px-2 font-bold'>
					<Link to='/'>Scope</Link>
				</div>
			</nav>
			<ModeToggle />
		</header>
	)
}
