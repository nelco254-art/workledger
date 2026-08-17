import { useState } from 'react'
import { ClientDirectory } from './components/ClientDirectory'
import { PaymentLedger } from './components/PaymentLedger'
import { SettingsPanel } from './components/SettingsPanel'
import { TaskBoard } from './components/TaskBoard'
import { clients, payments, tasks } from './data'
import { usePersistentBoolean } from './hooks/usePersistentBoolean'
import './App.css'

type PageId = 'overview' | 'clients' | 'tasks' | 'payments' | 'settings'

const navigation: Array<{ id: PageId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'clients', label: 'Clients' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'payments', label: 'Payments' },
  { id: 'settings', label: 'Settings' },
]

const pageDescriptions: Record<PageId, string> = {
  overview: 'A clear view of your client work and incoming payments.',
  clients: 'Keep client details and active relationships organized.',
  tasks: 'Plan deliverables and track work through completion.',
  payments: 'Monitor expected, received, and overdue payments.',
  settings: 'Manage your workspace preferences.',
}

const activeClientCount = clients.filter(
  (client) => client.status === 'active',
).length

const openTaskCount = tasks.filter((task) => task.status !== 'done').length

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

const formatKes = (amount: number) =>
  `KSh ${amount.toLocaleString('en-KE')}`

function App() {
  const [activePage, setActivePage] = useState<PageId>('overview')

  const [compactMode, setCompactMode] = usePersistentBoolean(
    'workledger:compact-mode',
    false,
  )

  const currentPage = navigation.find((item) => item.id === activePage)!

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <div className={`app-shell${compactMode ? ' compact' : ''}`}>
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              W
            </span>

            <div>
              <strong>WorkLedger</strong>
              <span>Client workspace</span>
            </div>
          </div>

          <nav aria-label="Primary navigation">
            <ul className="nav-list">
              {navigation.map((item) => (
                <li key={item.id}>
                  <button
                    className="nav-button"
                    aria-current={item.id === activePage ? 'page' : undefined}
                    onClick={() => setActivePage(item.id)}
                    type="button"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-status">
            <span className="status-dot" aria-hidden="true" />
            <span>Local workspace</span>
          </div>
        </aside>

        <main className="main-content" id="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">Workspace</p>
              <h1>{currentPage.label}</h1>
            </div>

            <div className="profile" aria-label="Current user">
              <span className="profile-avatar" aria-hidden="true">
                N
              </span>
              <span>Nelco</span>
            </div>
          </header>

          <section className="page-content" aria-labelledby="page-heading">
            <div className="page-introduction">
              <div>
                <p className="eyebrow">WorkLedger</p>
                <h2 id="page-heading">{currentPage.label}</h2>
                <p>{pageDescriptions[activePage]}</p>
              </div>
            </div>

            {activePage === 'overview' ? (
              <>
                <div className="summary-grid">
                  <article className="summary-card">
                    <span>Active clients</span>
                    <strong>{activeClientCount}</strong>
                    <small>{clients.length} total client records</small>
                  </article>

                  <article className="summary-card">
                    <span>Open tasks</span>
                    <strong>{openTaskCount}</strong>
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

                <div className="empty-state">
                  <span className="empty-state-mark" aria-hidden="true">
                    OK
                  </span>

                  <h3>Your workload is organized</h3>

                  <p>
                    You have {openTaskCount} open tasks across{' '}
                    {activeClientCount} active clients, with all records ready
                    to review.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => setActivePage('clients')}
                    type="button"
                  >
                    Review clients
                  </button>
                </div>
              </>
            ) : activePage === 'clients' ? (
              <ClientDirectory clients={clients} />
            ) : activePage === 'tasks' ? (
              <TaskBoard clients={clients} tasks={tasks} />
            ) : activePage === 'payments' ? (
              <PaymentLedger clients={clients} payments={payments} />
            ) : (
              <SettingsPanel
                compactMode={compactMode}
                onCompactModeChange={setCompactMode}
              />
            )}
          </section>
        </main>
      </div>
    </>
  )
}

export default App