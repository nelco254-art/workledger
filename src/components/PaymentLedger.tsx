import type { Client, Payment } from '../types'

interface PaymentLedgerProps {
  clients: Client[]
  payments: Payment[]
}

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

export function PaymentLedger({
  clients,
  payments,
}: PaymentLedgerProps) {
  const clientNames = new Map(
    clients.map((client) => [client.id, client.name]),
  )

  return (
    <div className="payment-panel">
      <div className="payment-header">
        <div>
          <h3>Payment ledger</h3>
          <p>
            {payments.length} payment{' '}
            {payments.length === 1 ? 'record' : 'records'} in this workspace
          </p>
        </div>
      </div>

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
            {payments.map((payment) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}