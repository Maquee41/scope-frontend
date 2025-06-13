import { login } from '@/services/authService'
import { useAuthStore } from '@/store/auth'
import { useMutation } from '@tanstack/react-query'

export const useLogin = () => {
  const setTokens = useAuthStore((s) => s.setTokens)

  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string
      password: string
    }) => login(username, password),
    onSuccess: (data) => {
      setTokens(data.access, data.refresh)
    },
  })
}
