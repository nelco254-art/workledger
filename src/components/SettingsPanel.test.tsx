import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SettingsPanel } from './SettingsPanel'

describe('SettingsPanel', () => {
  it('shows comfortable mode when compact mode is disabled', () => {
    render(
      <SettingsPanel
        compactMode={false}
        onCompactModeChange={() => undefined}
      />,
    )

    expect(
      screen.getByRole('checkbox', { name: 'Comfortable' }),
    ).not.toBeChecked()

    expect(
      screen.getByText('Layout density is set to', { exact: false }),
    ).toHaveTextContent('comfortable')
  })

  it('requests compact mode when the toggle is selected', async () => {
    const user = userEvent.setup()
    const onCompactModeChange = vi.fn()

    render(
      <SettingsPanel
        compactMode={false}
        onCompactModeChange={onCompactModeChange}
      />,
    )

    await user.click(
      screen.getByRole('checkbox', { name: 'Comfortable' }),
    )

    expect(onCompactModeChange).toHaveBeenCalledOnce()
    expect(onCompactModeChange).toHaveBeenCalledWith(true)
  })

  it('announces compact mode when it is enabled', () => {
    render(
      <SettingsPanel
        compactMode
        onCompactModeChange={() => undefined}
      />,
    )

    expect(
      screen.getByRole('checkbox', { name: 'Compact' }),
    ).toBeChecked()

    expect(
      screen.getByText('Layout density is set to', { exact: false }),
    ).toHaveTextContent('compact')
  })
})