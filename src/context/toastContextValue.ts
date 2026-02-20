import { createContext, useContext } from 'react'
import type { ToastVariant } from '../types/toast'

export interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
