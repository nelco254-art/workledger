import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useHashNavigation } from './useHashNavigation'

const pages = ['overview', 'clients', 'tasks', 'payments'] as const

describe('useHashNavigation', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('uses the fallback page when the URL has no valid hash', () => {
    window.history.replaceState(null, '', '/#unknown')

    const { result } = renderHook(() =>
      useHashNavigation(pages, 'overview'),
    )

    expect(result.current[0]).toBe('overview')
  })

  it('updates the URL and active page when navigating', async () => {
    const { result } = renderHook(() =>
      useHashNavigation(pages, 'overview'),
    )

    act(() => {
      result.current[1]('clients')
    })

    expect(window.location.hash).toBe('#clients')

    await waitFor(() => {
      expect(result.current[0]).toBe('clients')
    })
  })

  it('responds to browser hash changes', () => {
    const { result } = renderHook(() =>
      useHashNavigation(pages, 'overview'),
    )

    act(() => {
      window.location.hash = '#payments'
      window.dispatchEvent(new Event('hashchange'))
    })

    expect(result.current[0]).toBe('payments')
  })
})