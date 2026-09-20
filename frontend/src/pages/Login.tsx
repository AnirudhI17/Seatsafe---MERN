import { type FormEvent, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/Button'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      console.error(err)
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const from = (location.state as { from?: Location })?.from

  return (
    <div className="flex min-h-[calc(100vh-200px)] w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl space-y-8 rounded-3xl border border-slate-800/70 bg-slate-900/70 backdrop-blur-xl p-10 shadow-2xl shadow-purple-500/10"
      >
        <header className="space-y-3 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-base text-slate-400">
            {from ? 'Log in to continue where you left off.' : 'Log in to manage your tickets and events.'}
          </p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-base text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full py-3.5 text-base" loading={loading}>
            Log in
          </Button>
          <div className="text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

