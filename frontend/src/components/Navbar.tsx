import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from './Button'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="w-full border-b border-white/10 bg-slate-950/95 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-8 max-w-[1600px]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 transition-transform duration-200 group-hover:scale-105">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11a1 1 0 112 0v3a1 1 0 11-2 0v-3zm1-5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            SeatSafe
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `text-sm font-medium transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-slate-300 hover:text-white'
              }`
            }
          >
            Events
          </NavLink>
          {user && (
            <>
              {(user.role === 'organizer' || user.role === 'admin') && (
                <NavLink 
                  to="/events/new" 
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                    }`
                  }
                >
                  Create Event
                </NavLink>
              )}
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                Dashboard
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end mr-3">
                <span className="text-sm font-medium text-white">{user.full_name}</span>
                <span className="text-xs text-slate-400 capitalize">{user.role}</span>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="h-9"
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/register')}
              >
                Get Started For Free
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

