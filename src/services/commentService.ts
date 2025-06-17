import api from '@/services/api'

export const getComments = async ({
  workspaceId,
  taskId,
  access,
}: {
  workspaceId: number
  taskId?: number
  access: string | null
}) => {
  if (!access) throw new Error('No access token')

  const params = new URLSearchParams({ workspace_id: workspaceId.toString() })
  if (taskId) {
    params.append('task_id', taskId.toString())
  }

  const res = await api.get(
    `/api/comments/by-workspace/?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  )

  return res.data
}

export const postComment = async ({
  taskId,
  text,
  access,
}: {
  taskId: number
  text: string
  access: string | null
}) => {
  if (!access) throw new Error('No access token')

  const response = await api.post(
    'http://127.0.0.1:8000/api/comments/',
    {
      text,
      task: taskId,
    },
    {
      headers: {
        Authorization: `Bearer ${access}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  )
  return response.data
}
