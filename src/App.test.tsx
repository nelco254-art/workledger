import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('WorkLedger application', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
    window.localStorage.clear()
  })

  it('renders the workspace overview metrics', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Overview' }),
    ).toBeInTheDocument()

    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('KSh 327,000')).toBeInTheDocument()
  })

  it('navigates to the client directory and updates the URL', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Clients' }))

    expect(window.location.hash).toBe('#clients')

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Clients' }),
    ).toBeInTheDocument()

    expect(screen.getByText('Amina Wekesa')).toBeInTheDocument()
  })
})