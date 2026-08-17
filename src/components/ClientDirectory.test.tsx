import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { clients } from '../data'
import { ClientDirectory } from './ClientDirectory'

describe('ClientDirectory', () => {
  it('filters clients using the search field', async () => {
    const user = userEvent.setup()

    render(<ClientDirectory clients={clients} />)

    await user.type(
      screen.getByRole('searchbox', { name: 'Search clients' }),
      'Amina',
    )

    expect(screen.getByText('Amina Wekesa')).toBeInTheDocument()
    expect(screen.queryByText('David Kimani')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 5 clients')).toBeInTheDocument()
  })

  it('filters clients by status', async () => {
    const user = userEvent.setup()

    render(<ClientDirectory clients={clients} />)

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Status' }),
      'paused',
    )

    expect(screen.getByText('Brian Mwangi')).toBeInTheDocument()
    expect(screen.queryByText('Amina Wekesa')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 5 clients')).toBeInTheDocument()
  })

  it('shows an empty result and clears active filters', async () => {
    const user = userEvent.setup()

    render(<ClientDirectory clients={clients} />)

    const searchField = screen.getByRole('searchbox', {
      name: 'Search clients',
    })

    await user.type(searchField, 'Missing client')

    expect(screen.getByText('No clients found')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(searchField).toHaveValue('')
    expect(screen.getByText('Amina Wekesa')).toBeInTheDocument()
    expect(screen.getByText('Showing 5 of 5 clients')).toBeInTheDocument()
  })
})