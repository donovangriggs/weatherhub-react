import type { Location } from '../types/weather'
import { dispatchToast } from './toastEvents'

export const FALLBACK_LOCATION: Location = {
  name: 'Cape Town',
  region: 'Western Cape',
  country: 'South Africa',
  latitude: -33.9249,
  longitude: 18.4241,
}

export const getSavedLocation = (): Location | null => {
  try {
    const saved = localStorage.getItem('lastLocation')
    return saved ? (JSON.parse(saved) as Location) : null
  } catch {
    return null
  }
}

export const saveLocation = (loc: Location): void => {
  try {
    localStorage.setItem('lastLocation', JSON.stringify(loc))
  } catch {
    dispatchToast('Unable to save your location — storage may be full', 'warning')
  }
}

export const getBrowserLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          name: 'My Location',
          region: '',
          country: '',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => reject(new Error('Permission denied')),
      { timeout: 5000 },
    )
  })
}
