import { refreshToken } from '@/services/authService'
import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'

export const useTokenRefresh = () => {
  const { refresh, setTokens, logout, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!refresh || !isAuthenticated) return

    const interval = setInterval(
      async () => {
        try {
          const data = await refreshToken(refresh)
          setTokens(data.access, refresh)
        } catch {
          logout()
        }
      },
      10 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [refresh, isAuthenticated])
}
