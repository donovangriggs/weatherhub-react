import type { ToastVariant } from '../types/toast'

export interface ToastEventDetail {
  message: string
  variant: ToastVariant
}

export const dispatchToast = (message: string, variant: ToastVariant = 'error') => {
  window.dispatchEvent(
    new CustomEvent<ToastEventDetail>('toast-event', { detail: { message, variant } }),
  )
}
