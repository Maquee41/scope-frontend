import { useAuthStore } from '@/store/auth'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export const useRequireAuth = () => {
  const { isAuthenticated, hydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.navigate({ to: '/login' })
    }
  }, [hydrated, isAuthenticated])
}
