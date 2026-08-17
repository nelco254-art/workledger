import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePersistentBoolean } from './usePersistentBoolean'

describe('usePersistentBoolean', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('uses the fallback when no saved value exists', () => {
    const { result } = renderHook(() =>
      usePersistentBoolean('test-preference', false),
    )

    expect(result.current[0]).toBe(false)
  })

  it('reads an existing value from local storage', () => {
    window.localStorage.setItem('test-preference', 'true')

    const { result } = renderHook(() =>
      usePersistentBoolean('test-preference', false),
    )

    expect(result.current[0]).toBe(true)
  })

  it('stores updates in local storage', () => {
    const { result } = renderHook(() =>
      usePersistentBoolean('test-preference', false),
    )

    act(() => {
      result.current[1](true)
    })

    expect(result.current[0]).toBe(true)
    expect(window.localStorage.getItem('test-preference')).toBe('true')
  })
})