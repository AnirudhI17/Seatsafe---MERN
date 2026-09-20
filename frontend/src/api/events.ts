import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './client'

export interface Event {
  id: string
  title: string
  description: string
  location: string
  starts_at: string
  ends_at: string
  capacity: number
  registered_count: number
  status: 'draft' | 'published' | 'archived'
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await api.get('/events')
      return res.data.data as Event[]
    },
  })
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['events', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/events/${id}`)
      return res.data.data as Event
    },
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: unknown) => {
      const res = await api.post('/events', payload)
      return res.data.data as Event
    },
    onSuccess: () => {
      // Invalidate all event-related queries
      qc.invalidateQueries({ queryKey: ['events'] })
      // Force refetch
      qc.refetchQueries({ queryKey: ['events'] })
    },
  })
}

