import { useState } from 'react'
import type {
  Client,
  TaskPriority,
  TaskStatus,
  WorkTask,
} from '../types'

interface TaskBoardProps {
  clients: Client[]
  tasks: WorkTask[]
}

type PriorityFilter = TaskPriority | 'all'

const taskColumns: Array<{ status: TaskStatus; label: string }> = [
  { status: 'todo', label: 'To do' },
  { status: 'in-progress', label: 'In progress' },
  { status: 'done', label: 'Done' },
]

const dateFormatter = new Intl.DateTimeFormat('en-KE', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

const formatDate = (date: string) =>
  dateFormatter.format(new Date(`${date}T00:00:00Z`))

export function TaskBoard({ clients, tasks }: TaskBoardProps) {
  const [query, setQuery] = useState('')
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>('all')

  const clientNames = new Map(
    clients.map((client) => [client.id, client.name]),
  )

  const normalizedQuery = query.trim().toLowerCase()

  const filteredTasks = tasks.filter((task) => {
    const clientName = clientNames.get(task.clientId) ?? ''

    const matchesQuery =
      normalizedQuery.length === 0 ||
      task.title.toLowerCase().includes(normalizedQuery) ||
      clientName.toLowerCase().includes(normalizedQuery)

    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter

    return matchesQuery && matchesPriority
  })

  const hasActiveFilters =
    normalizedQuery.length > 0 || priorityFilter !== 'all'

  const clearFilters = () => {
    setQuery('')
    setPriorityFilter('all')
  }

  return (
    <div className="task-board-layout">
      <div className="task-toolbar" role="search">
        <label className="filter-field">
          <span>Search tasks</span>
          <input
            aria-describedby="task-results"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Task title or client"
            type="search"
            value={query}
          />
        </label>

        <label className="filter-field">
          <span>Priority</span>
          <select
            onChange={(event) =>
              setPriorityFilter(event.target.value as PriorityFilter)
            }
            value={priorityFilter}
          >
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
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

      <p className="task-result-count" id="task-results" aria-live="polite">
        Showing {filteredTasks.length} of {tasks.length}{' '}
        {tasks.length === 1 ? 'task' : 'tasks'}
      </p>

      <div className="task-board" aria-label="Task board">
        {taskColumns.map((column) => {
          const columnTasks = filteredTasks.filter(
            (task) => task.status === column.status,
          )

          return (
            <section
              className="task-column"
              data-status={column.status}
              key={column.status}
              aria-labelledby={`task-column-${column.status}`}
            >
              <header className="task-column-header">
                <h3 id={`task-column-${column.status}`}>
                  {column.label}
                </h3>

                <span
                  className="task-count"
                  aria-label={`${columnTasks.length} tasks`}
                >
                  {columnTasks.length}
                </span>
              </header>

              <ul className="task-list">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <li className="task-card" key={task.id}>
                      <div className="task-card-topline">
                        <span
                          className={`priority-badge priority-${task.priority}`}
                        >
                          {task.priority}
                        </span>

                        <time
                          className="task-due-date"
                          dateTime={task.dueDate}
                        >
                          Due {formatDate(task.dueDate)}
                        </time>
                      </div>

                      <h4>{task.title}</h4>

                      <p className="task-client">
                        {clientNames.get(task.clientId) ?? 'Unknown client'}
                      </p>
                    </li>
                  ))
                ) : (
                  <li className="task-column-empty">
                    No matching tasks
                  </li>
                )}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}