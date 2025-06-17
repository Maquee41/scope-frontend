import api from './api'
import type { IUserProfile } from './profileService'

export type TaskPayload = {
  workspace: number
  title: string
  description: string
  deadline: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in_progress' | 'done'
  assignee_ids: []
}

export type Task = {
  id: number
  workspace: number
  title: string
  description: string
  deadline: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in_progress' | 'done'
  assignees: IUserProfile[]
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
  token: string | null,
  workflowId?: number,
): Promise<Task[]> => {
  if (!token) throw new Error('No access token')

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

export const updateTaskAssignees = async ({
  id,
  assignee_ids,
  access,
}: {
  id: number
  assignee_ids: number[]
  access: string | null
}) => {
  if (!access) throw new Error('No access token')

  const res = await api.patch(
    `/api/tasks/${id}/`,
    { assignee_ids },
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  )

  return res.data
}

export const getTasksByDay = async ({
  workflowId,
  day,
  access,
}: {
  workflowId: number
  day: string
  access: string | null
}) => {
  if (!access) throw new Error('No access token')

  const res = await api.get(
    `/api/tasks/by-date/?workspace_id=${workflowId}&date=${day}`,
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  )

  return res.data
}
