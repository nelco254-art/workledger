import { useState } from 'react'
import type { Client, Payment, PaymentStatus } from '../types'

interface PaymentLedgerProps {
  clients: Client[]
  payments: Payment[]
}

type PaymentFilter = PaymentStatus | 'all'

const dateFormatter = new Intl.DateTimeFormat('en-KE', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const formatDate = (date: string) =>
  dateFormatter.format(new Date(`${date}T00:00:00Z`))

const formatKes = (amount: number) =>
  `KSh ${amount.toLocaleString('en-KE')}`

const formatReference = (id: string) =>
  id.replace('payment-', 'PAY-').toUpperCase()

const totalPayments = (payments: Payment[]) =>
  payments.reduce((total, payment) => total + payment.amount, 0)

export function PaymentLedger({
  clients,
  payments,
}: PaymentLedgerProps) {
  const [statusFilter, setStatusFilter] = useState<PaymentFilter>('all')

  const clientNames = new Map(
    clients.map((client) => [client.id, client.name]),
  )

  const paidPayments = payments.filter(
    (payment) => payment.status === 'paid',
  )

  const unpaidPayments = payments.filter(
    (payment) => payment.status !== 'paid',
  )

  const overduePayments = payments.filter(
    (payment) => payment.status === 'overdue',
  )

  const filteredPayments = payments.filter(
    (payment) =>
      statusFilter === 'all' || payment.status === statusFilter,
  )

  return (
    <div className="payment-layout">
      <div className="payment-summary-grid">
        <article className="payment-summary-card">
          <span>Received</span>
          <strong>{formatKes(totalPayments(paidPayments))}</strong>
          <small>{paidPayments.length} paid records</small>
        </article>

        <article className="payment-summary-card">
          <span>Outstanding</span>
          <strong>{formatKes(totalPayments(unpaidPayments))}</strong>
          <small>{unpaidPayments.length} unpaid records</small>
        </article>

        <article className="payment-summary-card">
          <span>Overdue</span>
          <strong>{formatKes(totalPayments(overduePayments))}</strong>
          <small>{overduePayments.length} overdue record</small>
        </article>
      </div>

      <div className="payment-panel">
        <div className="payment-header">
          <div>
            <h3>Payment ledger</h3>
            <p>Review received, pending, and overdue client payments.</p>
          </div>

          <label className="payment-filter">
            <span>Filter by status</span>
            <select
              onChange={(event) =>
                setStatusFilter(event.target.value as PaymentFilter)
              }
              value={statusFilter}
            >
              <option value="all">All payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </label>
        </div>

        <p className="payment-result-count" aria-live="polite">
          Showing {filteredPayments.length} of {payments.length} payment records
        </p>

        <div
          className="table-scroll"
          tabIndex={0}
          aria-label="Scrollable payment ledger"
        >
          <table className="payment-table">
            <caption className="sr-only">
              WorkLedger payment records
            </caption>

            <thead>
              <tr>
                <th scope="col">Reference</th>
                <th scope="col">Client</th>
                <th scope="col">Description</th>
                <th scope="col">Amount</th>
                <th scope="col">Due date</th>
                <th scope="col">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <span className="payment-reference">
                        {formatReference(payment.id)}
                      </span>
                    </td>

                    <td>
                      <strong className="payment-client">
                        {clientNames.get(payment.clientId) ?? 'Unknown client'}
                      </strong>
                    </td>

                    <td>{payment.description}</td>

                    <td>
                      <strong className="payment-amount">
                        {formatKes(payment.amount)}
                      </strong>
                    </td>

                    <td>
                      <time dateTime={payment.dueDate}>
                        {formatDate(payment.dueDate)}
                      </time>
                    </td>

                    <td>
                      <span
                        className={`payment-status payment-status-${payment.status}`}
                      >
                        {payment.status}
                      </span>

                      {payment.paidOn && (
                        <small className="payment-paid-date">
                          Paid {formatDate(payment.paidOn)}
                        </small>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="empty-table-cell" colSpan={6}>
                    <strong>No payments found</strong>
                    <span>Choose another payment status.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}