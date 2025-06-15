import api from './api'

export type TaskPayload = {
  workspace: number
  title: string
  description: string
  deadline: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in_progress' | 'done'
}

export type Task = {
  id: number
  workspace: number
  title: string
  description: string
  deadline: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in_progress' | 'done'
}

export type TaskStatus = 'todo' | 'in_progress' | 'done'

export const createTask = async (token: string, payload: TaskPayload) => {
  const { data } = await api.post('/api/tasks/', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const fetchTasks = async (
  token: string,
  workflowId?: number,
): Promise<Task[]> => {
  const url = workflowId
    ? `/api/tasks/?workflow_id=${workflowId}`
    : '/api/tasks/'
  const { data } = await api.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

export const updateTaskStatus = async ({
  id,
  status,
}: {
  id: number
  status: TaskStatus
}) => {
  const response = await api.patch(`/api/tasks/${id}/`, { status })
  return response.data
}
