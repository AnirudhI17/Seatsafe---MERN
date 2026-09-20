import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/Button'
import { useCreateEvent } from '../api/events'

export function CreateEventPage() {
  const navigate = useNavigate()
  const createMutation = useCreateEvent()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [capacity, setCapacity] = useState(50)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate dates
    const start = new Date(startsAt)
    const end = new Date(endsAt)
    
    if (end <= start) {
      setError('End date must be after start date')
      return
    }
    
    try {
      const payload = {
        title,
        description,
        location,
        is_online: false,
        online_url: '',
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
        capacity,
        price_cents: 0,
        banner_url: '',
      }
      const created = await createMutation.mutateAsync(payload)
      // Navigate to home page to see the new event in the list
      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Failed to create event. Please check all fields and try again.')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl space-y-8 rounded-3xl border border-slate-800/70 bg-slate-900/70 backdrop-blur-xl p-10 shadow-2xl shadow-purple-500/10"
      >
        <header className="space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Create event
          </h1>
          <p className="text-base text-slate-400">
            Publish a new event and SeatSafe will handle concurrency-safe registrations.
          </p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="title">
              Event Title
            </label>
            <input
              id="title"
              required
              minLength={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-base text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Summer Music Festival 2024"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-base text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Tell attendees what makes your event special..."
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-base text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Central Park, New York"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200" htmlFor="starts_at">
                Starts at
              </label>
              <input
                id="starts_at"
                type="datetime-local"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-base text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200" htmlFor="ends_at">
                Ends at
              </label>
              <input
                id="ends_at"
                type="datetime-local"
                required
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-base text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="capacity">
              Capacity
            </label>
            <input
              id="capacity"
              type="number"
              min={1}
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value) || 1)}
              className="w-full md:w-64 rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-base text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="100"
            />
            <p className="text-xs text-slate-500">Maximum number of attendees</p>
          </div>
          {error && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}
          <Button type="submit" loading={createMutation.isPending} className="w-full py-3.5 text-base">
            Create event
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

