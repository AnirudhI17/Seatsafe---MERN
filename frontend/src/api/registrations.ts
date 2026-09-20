import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './client'

export interface Registration {
  id: string
  event_id: string
  user_id: string
  status: string
  quantity: number
  registered_at: string
}

export interface Ticket {
  id: string
  registration_id: string
  event_id: string
  user_id: string
  ticket_code: string
}

export function useRegisterForEvent(eventId: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { quantity: number; notes?: string }) => {
      const res = await api.post(`/events/${eventId}/register`, payload)
      return res.data.data as { registration: Registration; ticket: Ticket | null }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registrations', 'me'] })
      qc.invalidateQueries({ queryKey: ['tickets', 'me'] })
      qc.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useMyRegistrations() {
  return useQuery({
    queryKey: ['registrations', 'me'],
    queryFn: async () => {
      const res = await api.get('/registrations/me')
      return res.data.data as Registration[]
    },
  })
}

export function useMyTickets() {
  return useQuery({
    queryKey: ['tickets', 'me'],
    queryFn: async () => {
      const res = await api.get('/tickets/me')
      return res.data.data as Ticket[]
    },
  })
}

export function useCancelRegistration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (registrationId: string) => {
      const res = await api.delete(`/registrations/${registrationId}`)
      return res.data
    },
    onSuccess: () => {
      // Invalidate all related queries to refresh data
      qc.invalidateQueries({ queryKey: ['registrations', 'me'] })
      qc.invalidateQueries({ queryKey: ['tickets', 'me'] })
      qc.invalidateQueries({ queryKey: ['events'] })
      qc.invalidateQueries({ queryKey: ['event'] })
    },
  })
}

