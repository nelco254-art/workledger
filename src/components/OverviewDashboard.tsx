import type { Client, Payment, WorkTask } from '../types'

interface OverviewDashboardProps {
  clients: Client[]
  payments: Payment[]
  tasks: WorkTask[]
  onReviewClients: () => void
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

export function OverviewDashboard({
  clients,
  payments,
  tasks,
  onReviewClients,
}: OverviewDashboardProps) {
  const activeClientCount = clients.filter(
    (client) => client.status === 'active',
  ).length

  const openTasks = tasks.filter((task) => task.status !== 'done')

  const inProgressTaskCount = tasks.filter(
    (task) => task.status === 'in-progress',
  ).length

  const unpaidPayments = payments.filter(
    (payment) => payment.status !== 'paid',
  )

  const outstandingAmount = unpaidPayments.reduce(
    (total, payment) => total + payment.amount,
    0,
  )

  const overduePaymentCount = payments.filter(
    (payment) => payment.status === 'overdue',
  ).length

  const upcomingTasks = [...openTasks]
    .sort((left, right) => left.dueDate.localeCompare(right.dueDate))
    .slice(0, 3)

  const clientNames = new Map(
    clients.map((client) => [client.id, client.name]),
  )

  return (
    <>
      <div className="summary-grid">
        <article className="summary-card">
          <span>Active clients</span>
          <strong>{activeClientCount}</strong>
          <small>{clients.length} total client records</small>
        </article>

        <article className="summary-card">
          <span>Open tasks</span>
          <strong>{openTasks.length}</strong>
          <small>{inProgressTaskCount} currently in progress</small>
        </article>

        <article className="summary-card">
          <span>Outstanding</span>
          <strong>{formatKes(outstandingAmount)}</strong>
          <small>
            {overduePaymentCount} overdue{' '}
            {overduePaymentCount === 1 ? 'payment' : 'payments'}
          </small>
        </article>
      </div>

      <div className="overview-lower-grid">
        <section className="workspace-status-card">
          <span className="empty-state-mark" aria-hidden="true">
            OK
          </span>

          <h3>Your workload is organized</h3>

          <p>
            You have {openTasks.length} open tasks across {activeClientCount}{' '}
            active clients, with all records ready to review.
          </p>

          <button
            className="primary-button"
            onClick={onReviewClients}
            type="button"
          >
            Review clients
          </button>
        </section>

        <section
          className="deadline-panel"
          aria-labelledby="upcoming-deadlines-heading"
        >
          <header>
            <div>
              <p className="eyebrow">Schedule</p>
              <h3 id="upcoming-deadlines-heading">Upcoming deadlines</h3>
            </div>

            <span>{upcomingTasks.length} next</span>
          </header>

          <ul className="deadline-list">
            {upcomingTasks.map((task) => (
              <li key={task.id}>
                <time dateTime={task.dueDate}>
                  {formatDate(task.dueDate)}
                </time>

                <div>
                  <strong>{task.title}</strong>
                  <span>
                    {clientNames.get(task.clientId) ?? 'Unknown client'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}