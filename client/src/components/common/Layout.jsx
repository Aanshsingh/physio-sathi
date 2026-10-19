import { NavLink, Link, Outlet } from 'react-router-dom'
import { FiHome, FiUsers, FiTool, FiMessageCircle, FiMapPin } from 'react-icons/fi'
import { FaRupeeSign } from 'react-icons/fa'

const links = [
  { to: '/', label: 'Home', icon: FiHome, end: true },
  { to: '/find', label: 'Find Physio', icon: FiUsers },
  { to: '/equipment', label: 'Equipment', icon: FiTool },
  { to: '/planner', label: 'Cost Planner', icon: FaRupeeSign },
  { to: '/assistant', label: 'AI Sathi', icon: FiMessageCircle },
]

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal text-sm font-extrabold text-white">PS</span>
            <span className="leading-tight">
              <span className="block text-base font-bold">Physio<span className="text-teal">Sathi</span></span>
              <span className="block text-[11px] text-soft">Recovery companion</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-mist text-teal-dark' : 'text-soft hover:text-navy'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <span className="flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium">
            <FiMapPin className="text-teal" aria-hidden /> Faridabad
          </span>
        </div>
      </header>

      <main className="pb-24 md:pb-0">
        <Outlet />
      </main>

      <footer className="hidden border-t border-line bg-white md:block">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-soft">
          Physio Sathi is a hackathon prototype. Physio and equipment listings shown in the demo are sample data.
          Physio Sathi does not give medical advice.
        </div>
      </footer>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Bottom"
      >
        <ul className="mx-auto grid max-w-xl grid-cols-5">
          {links.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${isActive ? 'text-teal-dark' : 'text-soft'}`
                }
              >
                <Icon className="text-lg" aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
