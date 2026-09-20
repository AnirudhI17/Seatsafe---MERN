import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="mx-4 w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
          >
            <div className="flex items-center justify-between gap-4">
              {title && (
                <h2 className="text-lg font-semibold text-slate-50">
                  {title}
                </h2>
              )}
              <Button
                variant="ghost"
                className="h-8 w-8 rounded-full p-0 text-slate-400 hover:text-slate-100"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </Button>
            </div>
            <div className="mt-4 text-sm text-slate-200">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

