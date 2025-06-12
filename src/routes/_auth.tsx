import { useAuthStore } from '@/store/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const isAuth = useAuthStore.getState().isAuthenticated
    if (isAuth) {
      throw redirect({ to: '/workflow' })
    }
  },
})
