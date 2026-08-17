import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { clients, tasks } from '../data'
import { TaskBoard } from './TaskBoard'

describe('TaskBoard', () => {
  it('combines client search with priority filtering', async () => {
    const user = userEvent.setup()

    render(<TaskBoard clients={clients} tasks={tasks} />)

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Priority' }),
      'high',
    )

    await user.type(
      screen.getByRole('searchbox', { name: 'Search tasks' }),
      'Grace',
    )

    expect(screen.getByText('Showing 1 of 7 tasks')).toBeInTheDocument()

    expect(
      screen.getByText('Draft product launch timeline'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Prepare brand asset package'),
    ).not.toBeInTheDocument()

    expect(screen.getAllByText('No matching tasks')).toHaveLength(2)
  })

  it('clears task filters and restores the full board', async () => {
    const user = userEvent.setup()

    render(<TaskBoard clients={clients} tasks={tasks} />)

    await user.type(
      screen.getByRole('searchbox', { name: 'Search tasks' }),
      'Missing task',
    )

    expect(screen.getByText('Showing 0 of 7 tasks')).toBeInTheDocument()
    expect(screen.getAllByText('No matching tasks')).toHaveLength(3)

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(screen.getByText('Showing 7 of 7 tasks')).toBeInTheDocument()
    expect(screen.getByText('Prepare brand asset package')).toBeInTheDocument()
    expect(screen.getByText('Deliver performance report')).toBeInTheDocument()
  })
})