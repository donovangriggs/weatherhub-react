import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Toast as ToastType, ToastVariant } from '../../types/toast'
import { toastVariants, toastTransition } from '../../animation/variants'

const variantStyles: Record<ToastVariant, { icon: string; accent: string }> = {
  success: { icon: 'check_circle', accent: 'text-green-400' },
  error: { icon: 'error', accent: 'text-red-400' },
  warning: { icon: 'warning', accent: 'text-amber-400' },
  info: { icon: 'info', accent: 'text-blue-400' },
}

const ToastItem = ({ toast, onRemove }: { toast: ToastType; onRemove: (id: string) => void }) => {
  const { icon, accent } = variantStyles[toast.variant]

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={toastTransition}
      className="glass flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg max-w-sm pointer-events-auto"
    >
      <span className={`material-symbols-outlined ${accent} text-xl shrink-0`}>{icon}</span>
      <p className="text-sm text-slate-200">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        className="ml-auto text-slate-400 hover:text-slate-200 transition-colors shrink-0"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </motion.div>
  )
}

export const ToastContainer = ({ toasts, onRemove }: { toasts: ToastType[]; onRemove: (id: string) => void }) => {
  return (
    <div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}
