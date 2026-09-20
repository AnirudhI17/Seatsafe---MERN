import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'

export const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') {
    return config
  }

  const saved = window.localStorage.getItem('seatsafe_auth')
  if (!saved) {
    return config
  }

  try {
    const parsed = JSON.parse(saved) as { token?: string }
    if (parsed.token) {
      // headers is AxiosHeaders in Axios v1 – mutate in place
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const headers = (config.headers ?? {}) as any
      headers.Authorization = `Bearer ${parsed.token}`
      config.headers = headers
    }
  } catch {
    // ignore parse errors
  }

  return config
})

