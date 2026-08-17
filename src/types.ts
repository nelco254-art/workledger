export type ClientStatus = 'active' | 'paused' | 'archived'

export interface Client {
  id: string
  name: string
  company: string
  email: string
  status: ClientStatus
  joinedOn: string
}

export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface WorkTask {
  id: string
  clientId: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
}

export type PaymentStatus = 'pending' | 'paid' | 'overdue'

export interface Payment {
  id: string
  clientId: string
  description: string
  amount: number
  status: PaymentStatus
  dueDate: string
  paidOn?: string
}