import { motion } from 'framer-motion'
import { useState } from 'react'
import { useMyRegistrations, useMyTickets, useCancelRegistration } from '../api/registrations'
import { Skeleton } from '../components/LoadingSkeleton'
import { Button } from '../components/Button'

export function DashboardPage() {
  const { data: regs, isLoading: regsLoading } = useMyRegistrations()
  const { data: tickets, isLoading: ticketsLoading } = useMyTickets()
  const cancelMutation = useCancelRegistration()
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  // Filter to show only active (non-cancelled) registrations
  const activeRegs = regs?.filter(r => r.status !== 'cancelled') || []
  
  // Filter out tickets from cancelled registrations
  const activeRegistrationIds = new Set(
    activeRegs.map(r => r.id)
  )
  const activeTickets = tickets?.filter(t => activeRegistrationIds.has(t.registration_id)) || []

  const handleCancel = async (registrationId: string) => {
    if (!confirm('Are you sure you want to cancel this registration? This action cannot be undone.')) {
      return
    }
    
    setCancellingId(registrationId)
    try {
      await cancelMutation.mutateAsync(registrationId)
      // Success - the list will automatically refresh
    } catch (error: any) {
      console.error('Cancel registration error:', error)
      const errorMsg = error?.response?.data?.error || 'Failed to cancel registration. Please try again.'
      alert(errorMsg)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-8"
    >
      <header className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          My Dashboard
        </h1>
        <p className="text-base text-slate-400">
          Manage your registrations and tickets in one place.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          My registrations
        </h2>
        {regsLoading ? (
          <Skeleton className="h-32 w-full rounded-2xl" />
        ) : !activeRegs || activeRegs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/50 backdrop-blur-xl p-12 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-base text-slate-400">
              You haven&apos;t registered for any events yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeRegs.map((reg) => (
              <div
                key={reg.id}
                className="rounded-2xl border border-slate-800/70 bg-slate-900/70 backdrop-blur-xl p-6 shadow-lg shadow-purple-500/5 transition-all duration-200 hover:shadow-purple-500/10"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400">Event ID</span>
                    <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase text-purple-400">
                      {reg.status}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {reg.event_id.slice(0, 8)}...
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span>{reg.quantity} ticket(s)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700/50">
                    <Button
                      variant="outline"
                      onClick={() => handleCancel(reg.id)}
                      loading={cancellingId === reg.id}
                      className="w-full text-sm py-2"
                    >
                      Cancel Registration
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">My tickets</h2>
        {ticketsLoading ? (
          <Skeleton className="h-32 w-full rounded-2xl" />
        ) : !activeTickets || activeTickets.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/50 backdrop-blur-xl p-12 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p className="text-base text-slate-400">
              Your tickets will appear here after successful registrations.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl p-6 shadow-lg shadow-purple-500/10 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-purple-500/20 p-2">
                      <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-400">Ticket</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {ticket.ticket_code}
                  </p>
                  <p className="text-sm text-slate-400">
                    Event: {ticket.event_id.slice(0, 8)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  )
}
