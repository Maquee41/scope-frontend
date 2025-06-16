import api from '@/services/api'

export const getProfileData = async (access: string | null) => {
  if (!access) throw new Error('No access token')
  const res = await api.get(`/users/me/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  })
  return res.data
}

export interface IUserProfile {
  id: number
  username: string
  first_name: string
  last_name: string
}

export async function updateProfileData(token: string, data: IUserProfile) {
  const response = await api.put('/users/me/', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
