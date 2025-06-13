import api from '@/services/api'

export const getWorkspaces = async (access: string | null) => {
  if (!access) throw new Error('No access token')
  const res = await api.get('/api/workspaces/', {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  })
  return res.data
}
