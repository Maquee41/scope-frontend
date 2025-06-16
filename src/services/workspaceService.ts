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

export const getWorkspacesMembers = async (
  access: string | null,
  workspaceId: number,
) => {
  if (!access) throw new Error('No access token')
  const res = await api.get(`/api/workspace/${workspaceId}/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  })

  return res.data
}

export const addMemberToWorkspace = async (
  workspaceId: number,
  username: string,
  token: string | null,
) => {
  if (!token) throw new Error('No access token')

  const response = await api.post(
    `/api/workspaces/${workspaceId}/add-member/`,
    { username },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}
