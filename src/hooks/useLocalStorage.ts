import { useState, useCallback } from 'react'
import { dispatchToast } from '../utils/toastEvents'

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value)
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        dispatchToast('Unable to save your preferences — storage may be full', 'warning')
      }
    },
    [key],
  )

  return [storedValue, setValue]
}
