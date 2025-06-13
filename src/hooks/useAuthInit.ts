import { refreshToken } from '@/services/authService'
import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'

export const useAuthInit = () => {
  const { refresh, setTokens, logout, hydrated } = useAuthStore()

  useEffect(() => {
    if (!hydrated || !refresh) return
    ;(async () => {
      try {
        const data = await refreshToken(refresh)
        setTokens(data.access, refresh)
      } catch {
        logout()
      }
    })()
  }, [hydrated])
}
