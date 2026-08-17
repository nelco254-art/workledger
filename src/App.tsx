import { useState } from 'react'
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

function App() {
  const [activePage, setActivePage] = useState<PageId>('overview')
  const currentPage = navigation.find((item) => item.id === activePage)!

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <div className="app-shell">
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
                    <strong>0</strong>
                    <small>Ready for your first client</small>
                  </article>

                  <article className="summary-card">
                    <span>Open tasks</span>
                    <strong>0</strong>
                    <small>Nothing awaiting action</small>
                  </article>

                  <article className="summary-card">
                    <span>Outstanding</span>
                    <strong>KSh 0</strong>
                    <small>No unpaid balances</small>
                  </article>
                </div>

                <div className="empty-state">
                  <span className="empty-state-mark" aria-hidden="true">
                    WL
                  </span>
                  <h3>Your workspace is ready</h3>
                  <p>
                    Add a client to begin organizing tasks and tracking payments.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => setActivePage('clients')}
                    type="button"
                  >
                    Go to clients
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <span className="empty-state-mark" aria-hidden="true">
                  {currentPage.label.slice(0, 2).toUpperCase()}
                </span>
                <h3>{currentPage.label} are coming next</h3>
                <p>
                  This section is connected to the navigation and ready for its
                  first feature.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  )
}

export default App