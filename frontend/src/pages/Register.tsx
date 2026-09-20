import { type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/Button'
import { useAuth } from '../context/AuthContext'

export function RegisterPage() {
  const { register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'attendee' | 'organizer'>('attendee')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register({ email, password, full_name: fullName, role })
    } catch (err) {
      console.error(err)
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl space-y-8 rounded-3xl border border-slate-800/70 bg-slate-900/70 backdrop-blur-xl p-10 shadow-2xl shadow-purple-500/10"
      >
        <header className="space-y-3 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Create your SeatSafe account
          </h1>
          <p className="text-base text-slate-400">
            Book events in seconds and keep your tickets in one place.
          </p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="full_name">
              Full name
            </label>
            <input
              id="full_name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-base text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-base text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-base text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
            />
            <p className="text-xs text-slate-500">Must be at least 8 characters</p>
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-200">I want to</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('attendee')}
                className={`rounded-xl border-2 px-6 py-5 text-left transition-all duration-200 hover:scale-[1.02] ${
                  role === 'attendee'
                    ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white shadow-lg shadow-purple-500/20'
                    : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-lg font-semibold mb-1">Attend Events</div>
                <div className="text-sm text-slate-400">Book and manage tickets</div>
              </button>
              <button
                type="button"
                onClick={() => setRole('organizer')}
                className={`rounded-xl border-2 px-6 py-5 text-left transition-all duration-200 hover:scale-[1.02] ${
                  role === 'organizer'
                    ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white shadow-lg shadow-purple-500/20'
                    : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-lg font-semibold mb-1">Create Events</div>
                <div className="text-sm text-slate-400">Organize and manage events</div>
              </button>
            </div>
          </div>
          {error && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full py-3.5 text-base" loading={loading}>
            Sign up
          </Button>
          <div className="text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200">
                Log in
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

