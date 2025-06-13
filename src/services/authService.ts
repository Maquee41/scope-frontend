import api from '@/services/api'

export const login = async (username: string, password: string) => {
  const { data } = await api.post('/users/token/', { username, password })
  return data
}

export const refreshToken = async (refresh: string) => {
  const { data } = await api.post('/users/token/refresh/', { refresh })
  return data
}

interface RegisterPayload {
  username: string
  password: string
  password2: string
}

export const registerUser = async (data: RegisterPayload) => {
  const response = await api.post('/users/register/', data)
  return response.data
}
