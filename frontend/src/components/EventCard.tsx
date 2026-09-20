import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from './Button'

export interface EventCardProps {
  id: string
  title: string
  location: string
  starts_at: string
  ends_at: string
  capacity: number
  registered_count: number
  status: 'draft' | 'published' | 'archived'
}

export function EventCard({
  id,
  title,
  location,
  starts_at,
  capacity,
  registered_count,
  status,
}: EventCardProps) {
  const remaining = Math.max(capacity - registered_count, 0)
  const isFull = remaining === 0
  const fillPercentage = Math.min((registered_count / capacity) * 100, 100)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-6 hover:border-purple-500/30 hover:bg-slate-900/60 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 ring-1 ring-inset ring-purple-500/20">
                {new Date(starts_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                  status === 'published'
                    ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                    : status === 'draft'
                    ? 'bg-amber-500/10 text-amber-400 ring-amber-500/20'
                    : 'bg-slate-500/10 text-slate-400 ring-slate-500/20'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white leading-snug line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
              {title}
            </h3>
          </div>
        </div>

        {/* Location */}
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">
          <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location}</span>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {registered_count} / {capacity} registered
            </span>
            <span
              className={`font-semibold ${
                isFull ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isFull ? 'Sold out' : `${remaining} left`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                isFull 
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3">
            <span className="text-xs text-slate-500 font-medium">
              {new Date(starts_at).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
            {!isFull && (
              <Link to={`/events/${id}`}>
                <Button
                  variant="primary"
                  className="h-10 px-5 text-xs"
                >
                  Register Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

