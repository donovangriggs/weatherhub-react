import { motion } from 'motion/react'
import { SearchInput } from '../ui/SearchInput'
import { UnitToggle } from '../ui/UnitToggle'

const CloudLogo = ({ size = 18 }: { size?: number }) => {
  return (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="white">
      <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z" />
    </svg>
  )
}

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="sticky top-0 z-50 glass border-b border-white/5"
    >
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg flex items-center justify-center w-8 h-8">
            <CloudLogo />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Weather<span className="text-primary">Hub</span>
          </span>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <SearchInput />
        </div>

        <div className="flex items-center">
          <UnitToggle />
        </div>
      </div>
      <div className="px-4 pb-3 md:hidden">
        <SearchInput />
      </div>
    </motion.nav>
  )
}
