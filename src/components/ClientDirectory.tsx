import type { Client } from '../types'

interface ClientDirectoryProps {
  clients: Client[]
}

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

export function ClientDirectory({ clients }: ClientDirectoryProps) {
  return (
    <div className="directory-panel">
      <div className="directory-header">
        <div>
          <h3>Client directory</h3>
          <p>
            {clients.length} {clients.length === 1 ? 'client' : 'clients'} in
            this workspace
          </p>
        </div>
      </div>

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
            {clients.map((client) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}