import { useWeatherContext } from '../../context/weatherContextValue'
import { dispatchToast } from '../../utils/toastEvents'
import type { Location } from '../../types/weather'

const MAX_FAVORITES = 5

export const FavoriteButton = ({ location, size = 'md' }: { location: Location; size?: 'sm' | 'md' }) => {
  const { isFavorite, toggleFavorite, favorites } = useWeatherContext()
  const favorited = isFavorite(location)

  const handleClick = () => {
    if (!favorited && favorites.length >= MAX_FAVORITES) {
      dispatchToast('Maximum 5 favorites reached — remove one first', 'warning')
      return
    }
    toggleFavorite(location)
  }

  const iconSize = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? `Remove ${location.name} from favorites` : `Add ${location.name} to favorites`}
      className={`transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${favorited ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-400'}`}
    >
      <span className={`material-symbols-outlined ${iconSize}`} style={favorited ? { fontVariationSettings: "'FILL' 1" } : undefined}>
        star
      </span>
    </button>
  )
}
