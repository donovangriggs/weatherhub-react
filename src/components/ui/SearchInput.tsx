import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGeocoding } from '../../hooks/useGeocoding'
import { useWeatherContext } from '../../context/weatherContextValue'
import { MaterialIcon } from './MaterialIcon'
import { dropdownVariants } from '../../animation/variants'
import type { GeocodingResult } from '../../types/geocoding'

export const SearchInput = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { results, isLoading } = useGeocoding(query)
  const { changeLocation } = useWeatherContext()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const showDropdown = isOpen && query.trim().length >= 2
  const hasResults = results.length > 0

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (result: GeocodingResult) => {
    changeLocation({
      name: result.name,
      region: result.admin1 ?? '',
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
    })
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative z-100 group">
      <MaterialIcon
        name="search"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
      />
      <input
        type="text"
        role="combobox"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search city or zip code..."
        aria-expanded={showDropdown && hasResults}
        aria-controls="search-results"
        aria-autocomplete="list"
        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
      />
      <AnimatePresence>
        {showDropdown && hasResults && (
          <motion.ul
            id="search-results"
            role="listbox"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full mt-2 w-full bg-[#1a2332] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
          >
            {results.map((r) => (
              <li key={r.id} role="option" aria-selected={false}>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors text-sm"
                  onClick={() => handleSelect(r)}
                >
                  <span className="font-medium">{r.name}</span>
                  <span className="text-slate-400 ml-2 text-xs">
                    {r.admin1 ? `${r.admin1}, ` : ''}
                    {r.country}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDropdown && isLoading && !hasResults && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full mt-2 w-full bg-[#1a2332] border border-white/10 rounded-xl p-4 text-sm text-slate-400 z-50"
          >
            Searching...
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDropdown && !isLoading && !hasResults && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full mt-2 w-full bg-[#1a2332] border border-white/10 rounded-xl p-4 text-sm text-slate-400 z-50"
          >
            No results found
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
