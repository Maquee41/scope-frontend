import axios from 'axios'

const API_URL = 'http://localhost:8000'

export const getProfileData = async (access: string | null) => {
  if (!access) throw new Error('No access token')
  const res = await axios.get(`${API_URL}/users/me/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  })
  return res.data
}
