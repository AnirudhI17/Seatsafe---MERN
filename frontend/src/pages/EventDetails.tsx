import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEvent } from '../api/events'
import { useRegisterForEvent } from '../api/registrations'
import { Button } from '../components/Button'
import { Skeleton } from '../components/LoadingSkeleton'
import { useAuth } from '../context/AuthContext'

export function EventDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { data: event, isLoading, isError } = useEvent(id)
  const [quantity, setQuantity] = useState(1)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const registerMutation = useRegisterForEvent(id)

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <Skeleton className="h-12 w-2/3 rounded-2xl" />
        <Skeleton className="h-6 w-1/2 rounded-xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10">
            <svg className="h-8 w-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Failed to load event</h3>
          <p className="text-sm text-slate-400">Please try again later</p>
        </div>
      </div>
    )
  }

  const remaining = Math.max(event.capacity - event.registered_count, 0)
  const isFull = remaining === 0
  const percentBooked = (event.registered_count / event.capacity) * 100

  const handleRegister = async () => {
    setErrorMessage(null)
    try {
      await registerMutation.mutateAsync({ quantity })
    } catch (error: any) {
      // Handle specific error codes
      if (error?.response?.status === 409) {
        const errorMsg = error?.response?.data?.error || ''
        if (errorMsg.includes('already registered')) {
          setErrorMessage('You already have a registration for this event. To get more tickets, please cancel your existing registration first and register again with the total number of tickets you need.')
        } else if (errorMsg.includes('fully booked')) {
          setErrorMessage('This event is fully booked. No more seats available.')
        } else {
          setErrorMessage('Registration conflict. Please try again.')
        }
      } else if (error?.response?.status === 400) {
        setErrorMessage('Not enough seats available. Please try a lower quantity.')
      } else {
        setErrorMessage('Registration failed. Please try again.')
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-5xl space-y-8"
    >
      <header className="space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          {event.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-base text-slate-400">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(event.starts_at).toLocaleString()}</span>
          </div>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <article className="space-y-6 rounded-3xl border border-slate-800/70 bg-slate-900/70 backdrop-blur-xl p-8 shadow-xl shadow-purple-500/5">
          <h2 className="text-xl font-semibold text-white">
            About this event
          </h2>
          <p className="text-base leading-relaxed text-slate-300">
            {event.description || 'No description provided.'}
          </p>
        </article>

        <aside className="space-y-6 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl p-8 shadow-xl shadow-purple-500/10">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Event Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Capacity</span>
                <span className="font-semibold text-white">
                  {event.registered_count}/{event.capacity}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${percentBooked}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {remaining} {remaining === 1 ? 'seat' : 'seats'} remaining
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isFull 
                    ? 'bg-rose-500/10 text-rose-300' 
                    : 'bg-emerald-500/10 text-emerald-300'
                }`}>
                  {isFull ? 'Sold out' : 'Open'}
                </span>
              </div>
            </div>
          </div>

          {user ? (
            <div className="space-y-4 border-t border-slate-700/50 pt-6">
              <label className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-200">Number of tickets</span>
                <input
                  type="number"
                  min={1}
                  max={Math.min(10, remaining)}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Math.min(10, Number(e.target.value) || 1)))
                  }
                  className="w-24 rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-2 text-center text-base text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
              </label>
              <Button
                className="w-full py-3 text-base"
                onClick={handleRegister}
                loading={registerMutation.isPending}
                disabled={isFull}
              >
                {isFull ? 'Event is sold out' : 'Register now'}
              </Button>
              {errorMessage && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm text-amber-300">
                  {errorMessage}
                </div>
              )}
              {registerMutation.isSuccess && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-300">
                  You&apos;re registered! A ticket has been generated for you.
                </div>
              )}
            </div>
          ) : (
            <div className="border-t border-slate-700/50 pt-6">
              <p className="text-sm text-slate-400 text-center">
                Log in to register for this event.
              </p>
            </div>
          )}
        </aside>
      </section>
    </motion.div>
  )
}
