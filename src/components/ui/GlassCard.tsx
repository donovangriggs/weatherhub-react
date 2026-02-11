import type { ReactNode } from 'react'

export const GlassCard = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`glass p-4 sm:p-6 rounded-2xl border-white/5 ${className}`}>{children}</div>
)
