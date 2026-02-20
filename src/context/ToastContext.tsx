import { useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Toast, ToastVariant } from '../types/toast'
import type { ToastEventDetail } from '../utils/toastEvents'
import { ToastContext } from './toastContextValue'
import { ToastContainer } from '../components/ui/Toast'

const DEFAULT_DURATION = 4000

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, variant: ToastVariant = 'error', duration = DEFAULT_DURATION) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { id, message, variant, duration }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Listen for toast events from non-React code (utils)
  useEffect(() => {
    const handler = (e: Event) => {
      const { message, variant } = (e as CustomEvent<ToastEventDetail>).detail
      showToast(message, variant)
    }
    window.addEventListener('toast-event', handler)
    return () => window.removeEventListener('toast-event', handler)
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}
