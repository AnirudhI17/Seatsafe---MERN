import type { ReactNode } from 'react'
import { Navbar } from '../components/Navbar'

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-6 py-8 lg:px-12">
        {children}
      </main>
      <footer className="w-full border-t border-slate-800/50 bg-slate-900/70 backdrop-blur-md py-8">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              © 2024 SeatSafe. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                Privacy
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                Terms
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

