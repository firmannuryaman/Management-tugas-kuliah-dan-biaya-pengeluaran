import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListChecks, Wallet, GraduationCap, LogOut, User, Menu, X } from 'lucide-react'
import { useAuth } from '../../lib/authStore'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Papan Tugas', icon: ListChecks },
  { to: '/expenses', label: 'Biaya Kuliah', icon: Wallet },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-lg text-primary-700 shrink-0">
          <GraduationCap size={24} />
          <span className="hidden sm:inline">KuliahTracker</span>
        </NavLink>

        <nav className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <l.icon size={18} />
              <span>{l.label}</span>
            </NavLink>
          ))}

          {user && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
              <span className="text-xs text-gray-400">{user.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Keluar"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <l.icon size={18} />
              {l.label}
            </NavLink>
          ))}
          {user && (
            <div className="border-t border-gray-100 pt-3 mt-2 space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500">
                <User size={18} />
                {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
              >
                <LogOut size={18} />
                Keluar
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
