import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePersistentState } from './usePersistentState'

describe('usePersistentState', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns the fallback when no stored state exists', () => {
    const fallback = [{ id: 'task-001', status: 'todo' }]

    const { result } = renderHook(() =>
      usePersistentState('test-tasks', fallback),
    )

    expect(result.current[0]).toEqual(fallback)
  })

  it('stores structured state as JSON', () => {
    const { result } = renderHook(() =>
      usePersistentState('test-tasks', [
        { id: 'task-001', status: 'todo' },
      ]),
    )

    act(() => {
      result.current[1]([
        { id: 'task-001', status: 'done' },
      ])
    })

    expect(result.current[0]).toEqual([
      { id: 'task-001', status: 'done' },
    ])

    expect(
      JSON.parse(window.localStorage.getItem('test-tasks') ?? ''),
    ).toEqual([{ id: 'task-001', status: 'done' }])
  })

  it('recovers from malformed stored data', () => {
    window.localStorage.setItem('test-tasks', '{invalid json')

    const fallback = [{ id: 'task-001', status: 'todo' }]

    const { result } = renderHook(() =>
      usePersistentState('test-tasks', fallback),
    )

    expect(result.current[0]).toEqual(fallback)
  })
})