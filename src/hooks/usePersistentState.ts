import { useEffect, useState } from 'react'

const readStoredState = <Value>(key: string, fallback: Value) => {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const storedValue = window.localStorage.getItem(key)

    if (storedValue === null) {
      return fallback
    }

    return JSON.parse(storedValue) as Value
  } catch {
    return fallback
  }
}

export function usePersistentState<Value>(
  key: string,
  fallback: Value,
) {
  const [value, setValue] = useState<Value>(() =>
    readStoredState(key, fallback),
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // The value remains available for the current session.
    }
  }, [key, value])

  return [value, setValue] as const
}