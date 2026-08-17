import { useEffect, useState } from 'react'

const readStoredBoolean = (key: string, fallback: boolean) => {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const storedValue = window.localStorage.getItem(key)

    if (storedValue === null) {
      return fallback
    }

    return storedValue === 'true'
  } catch {
    return fallback
  }
}

export function usePersistentBoolean(key: string, fallback: boolean) {
  const [value, setValue] = useState(() =>
    readStoredBoolean(key, fallback),
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(key, String(value))
    } catch {
      // The preference remains available for the current session.
    }
  }, [key, value])

  return [value, setValue] as const
}