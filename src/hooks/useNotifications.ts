import { fetchNotifications } from '@/services/notificationService'
import { useQuery } from '@tanstack/react-query'

export const useNotifications = (access: string | null) => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications({ access }),
    enabled: !!access,
    staleTime: 1000 * 60 * 5,
  })
}
