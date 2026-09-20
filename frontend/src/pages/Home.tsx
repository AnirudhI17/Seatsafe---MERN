import { motion } from 'framer-motion'
import { useState } from 'react'
import { useEvents } from '../api/events'
import { EventCard } from '../components/EventCard'
import { EventCardSkeletonGrid } from '../components/LoadingSkeleton'

export function HomePage() {
  const { data, isLoading, isError } = useEvents()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter events based on search query
  const filteredEvents = data?.filter(event => {
    const query = searchQuery.toLowerCase()
    return (
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    )
  }) || []

  if (isLoading) {
    return <EventCardSkeletonGrid />
  }

  if (isError) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Failed to load events</h3>
          <p className="text-sm text-slate-400">Please try again later</p>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
          <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-white">
          No events yet
        </h2>
        <p className="max-w-md text-sm text-slate-400">
          Once organisers publish events, they'll appear here for attendees
          to discover and book seats in real time.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full flex-1 space-y-8">
      {/* Header with Search */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Featured events
            </h1>
            <p className="text-slate-400 max-w-2xl">
              Book seats with confidence — SeatSafe prevents overbooking even under heavy load.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/50 pl-11 pr-4 py-3 text-sm text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <div className="text-sm text-slate-400">
          Found {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
        </div>
      )}

      {/* Events grid */}
      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
            <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No events found</h3>
          <p className="text-sm text-slate-400 max-w-md">
            Try adjusting your search terms or clear the search to see all events.
          </p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </motion.div>
      )}
    </div>
  )
}

