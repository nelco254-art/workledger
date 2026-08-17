import { ClientDirectory } from './components/ClientDirectory'
import { OverviewDashboard } from './components/OverviewDashboard'
import { PaymentLedger } from './components/PaymentLedger'
import { SettingsPanel } from './components/SettingsPanel'
import { TaskBoard } from './components/TaskBoard'
import {
  clients,
  payments,
  tasks as initialTasks,
} from './data'
import { useHashNavigation } from './hooks/useHashNavigation'
import { usePersistentBoolean } from './hooks/usePersistentBoolean'
import { usePersistentState } from './hooks/usePersistentState'
import type { TaskStatus } from './types'
import './App.css'

type PageId = 'overview' | 'clients' | 'tasks' | 'payments' | 'settings'

const navigation: Array<{ id: PageId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'clients', label: 'Clients' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'payments', label: 'Payments' },
  { id: 'settings', label: 'Settings' },
]

const pageIds = navigation.map((item) => item.id)

const pageDescriptions: Record<PageId, string> = {
  overview: 'A clear view of your client work and incoming payments.',
  clients: 'Keep client details and active relationships organized.',
  tasks: 'Plan deliverables and track work through completion.',
  payments: 'Monitor expected, received, and overdue payments.',
  settings: 'Manage your workspace preferences.',
}

function App() {
  const [activePage, setActivePage] = useHashNavigation(
    pageIds,
    'overview',
  )

  const [compactMode, setCompactMode] = usePersistentBoolean(
    'workledger:compact-mode',
    false,
  )

  const [taskRecords, setTaskRecords] = usePersistentState(
    'workledger:tasks',
    initialTasks,
  )

  const currentPage = navigation.find((item) => item.id === activePage)!

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTaskRecords((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    )
  }

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
              <OverviewDashboard
                clients={clients}
                payments={payments}
                tasks={taskRecords}
                onReviewClients={() => setActivePage('clients')}
              />
            ) : activePage === 'clients' ? (
              <ClientDirectory clients={clients} />
            ) : activePage === 'tasks' ? (
              <TaskBoard
                clients={clients}
                tasks={taskRecords}
                onStatusChange={updateTaskStatus}
              />
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