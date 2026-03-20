import { useWeatherContext } from '../../context/weatherContextValue'
import { MaterialIcon } from './MaterialIcon'
import type { Location } from '../../types/weather'

const isSameLocation = (a: Location, b: Location) =>
  a.latitude === b.latitude && a.longitude === b.longitude

const LocationChip = ({
  location,
  isActive,
  onSelect,
  onRemove,
}: {
  location: Location
  isActive: boolean
  onSelect: () => void
  onRemove?: () => void
}) => (
  <button
    onClick={onSelect}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors whitespace-nowrap ${
      isActive
        ? 'bg-primary/20 text-primary border border-primary/30'
        : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
    }`}
  >
    <span className="truncate max-w-[120px]">{location.name}</span>
    {onRemove && (
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation()
            onRemove()
          }
        }}
        className="text-slate-400 hover:text-red-400 transition-colors"
        aria-label={`Remove ${location.name} from favorites`}
      >
        <MaterialIcon name="close" className="text-xs" />
      </span>
    )}
  </button>
)

export const QuickSwitcher = () => {
  const { favorites, recents, removeFavorite, changeLocation, weatherState } = useWeatherContext()

  const currentLocation = weatherState?.location
  const hasFavorites = favorites.length > 0
  const hasRecents = recents.length > 0

  if (!hasFavorites && !hasRecents) return null

  const isActive = (loc: Location) =>
    currentLocation ? isSameLocation(loc, currentLocation) : false

  return (
    <div className="glass border-b border-white/5 px-4 sm:px-6 py-2">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {hasFavorites && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              <MaterialIcon name="star" className="text-xs text-yellow-500/70" />
              Favorites
            </span>
            <div className="flex items-center gap-1.5">
              {favorites.map((loc) => (
                <LocationChip
                  key={`${loc.latitude},${loc.longitude}`}
                  location={loc}
                  isActive={isActive(loc)}
                  onSelect={() => changeLocation(loc)}
                  onRemove={() => removeFavorite(loc)}
                />
              ))}
            </div>
          </div>
        )}
        {hasRecents && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              <MaterialIcon name="history" className="text-xs" />
              Recents
            </span>
            <div className="flex items-center gap-1.5">
              {recents.map((loc) => (
                <LocationChip
                  key={`${loc.latitude},${loc.longitude}`}
                  location={loc}
                  isActive={isActive(loc)}
                  onSelect={() => changeLocation(loc)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
