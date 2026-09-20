import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/Home'
import { EventDetailsPage } from './pages/EventDetails'
import { LoginPage } from './pages/Login'
import { RegisterPage } from './pages/Register'
import { CreateEventPage } from './pages/CreateEvent'
import { DashboardPage } from './pages/Dashboard'
import { RequireAuth } from './components/RequireAuth'

const queryClient = new QueryClient()

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <MainLayout>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/events/:id" element={<EventDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/events/new"
                    element={
                      <RequireAuth>
                        <CreateEventPage />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <RequireAuth>
                        <DashboardPage />
                      </RequireAuth>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </MainLayout>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  )
}

export default App
