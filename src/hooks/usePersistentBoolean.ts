import { usePersistentState } from './usePersistentState'

export function usePersistentBoolean(
  key: string,
  fallback: boolean,
) {
  return usePersistentState(key, fallback)
}