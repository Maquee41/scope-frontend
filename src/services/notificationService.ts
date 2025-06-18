import api from './api'

export type Notification = {
  id: number
  message: string
  is_read: boolean
  created_at: string
  user: number
  task: number | null
}

export const fetchNotifications = async ({
  access,
}: {
  access: string | null
}): Promise<Notification[]> => {
  if (!access) throw new Error('No access token')

  const response = await api.get<Notification[]>('/api/notifications/', {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  })
  return response.data
}
