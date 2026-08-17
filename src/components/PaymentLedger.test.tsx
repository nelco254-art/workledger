import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { clients, payments } from '../data'
import { PaymentLedger } from './PaymentLedger'

describe('PaymentLedger', () => {
  it('calculates the payment summary totals', () => {
    render(<PaymentLedger clients={clients} payments={payments} />)

    expect(screen.getByText('KSh 140,000')).toBeInTheDocument()
    expect(screen.getByText('KSh 327,000')).toBeInTheDocument()

    expect(screen.getAllByText('KSh 72,000')).toHaveLength(2)

    expect(screen.getByText('2 paid records')).toBeInTheDocument()
    expect(screen.getByText('3 unpaid records')).toBeInTheDocument()
    expect(screen.getByText('1 overdue record')).toBeInTheDocument()
  })

  it('shows only overdue payments when selected', async () => {
    const user = userEvent.setup()

    render(<PaymentLedger clients={clients} payments={payments} />)

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filter by status' }),
      'overdue',
    )

    expect(
      screen.getByText('Showing 1 of 5 payment records'),
    ).toBeInTheDocument()

    expect(screen.getByText('PAY-003')).toBeInTheDocument()
    expect(screen.queryByText('PAY-001')).not.toBeInTheDocument()
    expect(screen.getByText('Monthly reporting')).toBeInTheDocument()
  })

  it('shows both pending payment records', async () => {
    const user = userEvent.setup()

    render(<PaymentLedger clients={clients} payments={payments} />)

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filter by status' }),
      'pending',
    )

    expect(
      screen.getByText('Showing 2 of 5 payment records'),
    ).toBeInTheDocument()

    expect(screen.getByText('PAY-002')).toBeInTheDocument()
    expect(screen.getByText('PAY-004')).toBeInTheDocument()
    expect(screen.queryByText('PAY-003')).not.toBeInTheDocument()
  })
})