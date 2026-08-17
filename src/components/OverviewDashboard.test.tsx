import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { clients, payments, tasks } from '../data'
import { OverviewDashboard } from './OverviewDashboard'

describe('OverviewDashboard', () => {
  it('renders the calculated workspace metrics', () => {
    render(
      <OverviewDashboard
        clients={clients}
        payments={payments}
        tasks={tasks}
        onReviewClients={() => undefined}
      />,
    )

    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('KSh 327,000')).toBeInTheDocument()
    expect(screen.getByText('1 overdue payment')).toBeInTheDocument()
  })

  it('orders upcoming deadlines from earliest to latest', () => {
    render(
      <OverviewDashboard
        clients={clients}
        payments={payments}
        tasks={tasks}
        onReviewClients={() => undefined}
      />,
    )

    const deadlinePanel = screen.getByRole('region', {
      name: 'Upcoming deadlines',
    })

    const deadlineItems = within(deadlinePanel).getAllByRole('listitem')

    expect(
      within(deadlineItems[0]).getByText('Prepare brand asset package'),
    ).toBeInTheDocument()

    expect(
      within(deadlineItems[1]).getByText('Build event landing page'),
    ).toBeInTheDocument()

    expect(
      within(deadlineItems[2]).getByText('Review logistics dashboard'),
    ).toBeInTheDocument()
  })

  it('opens the client directory from the review button', async () => {
    const user = userEvent.setup()
    const onReviewClients = vi.fn()

    render(
      <OverviewDashboard
        clients={clients}
        payments={payments}
        tasks={tasks}
        onReviewClients={onReviewClients}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: 'Review clients' }),
    )

    expect(onReviewClients).toHaveBeenCalledOnce()
  })
})