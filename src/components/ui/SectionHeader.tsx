import type { ReactNode } from 'react'
import { MaterialIcon } from './MaterialIcon'

export const SectionHeader = ({ icon, children }: { icon: string; children: ReactNode }) => (
  <h3 className="font-bold flex items-center gap-2">
    <MaterialIcon name={icon} className="text-primary text-sm" />
    {children}
  </h3>
)
