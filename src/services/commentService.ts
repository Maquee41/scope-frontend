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
  files = [],
}: {
  taskId: number
  text: string
  access: string | null
  files?: File[]
}) => {
  if (!access) throw new Error('No access token')

  const formData = new FormData()
  formData.append('text', text)
  formData.append('task', taskId.toString())
  files.forEach((file) => {
    formData.append('uploaded_files', file)
  })

  const response = await api.post('/api/comments/', formData, {
    headers: {
      Authorization: `Bearer ${access}`,
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
