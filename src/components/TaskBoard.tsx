import type { Client, TaskStatus, WorkTask } from '../types'

interface TaskBoardProps {
  clients: Client[]
  tasks: WorkTask[]
}

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
  const clientNames = new Map(
    clients.map((client) => [client.id, client.name]),
  )

  return (
    <div className="task-board" aria-label="Task board">
      {taskColumns.map((column) => {
        const columnTasks = tasks.filter(
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
              <h3 id={`task-column-${column.status}`}>{column.label}</h3>
              <span
                className="task-count"
                aria-label={`${columnTasks.length} tasks`}
              >
                {columnTasks.length}
              </span>
            </header>

            <ul className="task-list">
              {columnTasks.map((task) => (
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
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}