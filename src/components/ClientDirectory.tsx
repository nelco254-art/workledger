import { useState } from 'react'
import type { Client, ClientStatus } from '../types'

interface ClientDirectoryProps {
  clients: Client[]
}

type StatusFilter = ClientStatus | 'all'
type ClientSort = 'name' | 'newest' | 'oldest'

const dateFormatter = new Intl.DateTimeFormat('en-KE', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const formatDate = (date: string) =>
  dateFormatter.format(new Date(`${date}T00:00:00Z`))

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const compareClients = (
  left: Client,
  right: Client,
  sortOrder: ClientSort,
) => {
  if (sortOrder === 'newest') {
    return right.joinedOn.localeCompare(left.joinedOn)
  }

  if (sortOrder === 'oldest') {
    return left.joinedOn.localeCompare(right.joinedOn)
  }

  return left.name.localeCompare(right.name)
}

export function ClientDirectory({ clients }: ClientDirectoryProps) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortOrder, setSortOrder] = useState<ClientSort>('name')

  const normalizedQuery = query.trim().toLowerCase()

  const visibleClients = clients
    .filter((client) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        client.name.toLowerCase().includes(normalizedQuery) ||
        client.company.toLowerCase().includes(normalizedQuery) ||
        client.email.toLowerCase().includes(normalizedQuery)

      const matchesStatus =
        statusFilter === 'all' || client.status === statusFilter

      return matchesQuery && matchesStatus
    })
    .sort((left, right) => compareClients(left, right, sortOrder))

  const hasActiveFilters =
    normalizedQuery.length > 0 || statusFilter !== 'all'

  const clearFilters = () => {
    setQuery('')
    setStatusFilter('all')
  }

  return (
    <div className="directory-panel">
      <div className="directory-header">
        <div>
          <h3>Client directory</h3>
          <p>Search, filter, and sort client records.</p>
        </div>
      </div>

      <div className="directory-controls" role="search">
        <label className="filter-field">
          <span>Search clients</span>
          <input
            aria-describedby="client-results"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, company, or email"
            type="search"
            value={query}
          />
        </label>

        <label className="filter-field">
          <span>Status</span>
          <select
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            value={statusFilter}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <label className="filter-field">
          <span>Sort clients</span>
          <select
            onChange={(event) =>
              setSortOrder(event.target.value as ClientSort)
            }
            value={sortOrder}
          >
            <option value="name">Name A–Z</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>

        {hasActiveFilters && (
          <button
            className="secondary-button"
            onClick={clearFilters}
            type="button"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="result-count" id="client-results" aria-live="polite">
        Showing {visibleClients.length} of {clients.length}{' '}
        {clients.length === 1 ? 'client' : 'clients'}
      </p>

      <div
        className="table-scroll"
        tabIndex={0}
        aria-label="Scrollable client directory"
      >
        <table className="client-table">
          <caption className="sr-only">
            WorkLedger client directory
          </caption>

          <thead>
            <tr>
              <th scope="col">Client</th>
              <th scope="col">Company</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col">Joined</th>
            </tr>
          </thead>

          <tbody>
            {visibleClients.length > 0 ? (
              visibleClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className="client-identity">
                      <span className="client-avatar" aria-hidden="true">
                        {getInitials(client.name)}
                      </span>
                      <strong>{client.name}</strong>
                    </div>
                  </td>

                  <td>{client.company}</td>

                  <td>
                    <a className="email-link" href={`mailto:${client.email}`}>
                      {client.email}
                    </a>
                  </td>

                  <td>
                    <span
                      className={`status-badge status-${client.status}`}
                    >
                      {client.status}
                    </span>
                  </td>

                  <td>{formatDate(client.joinedOn)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty-table-cell" colSpan={5}>
                  <strong>No clients found</strong>
                  <span>Try a different search term or status.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}