import { getWorkspacesMembers } from '@/services/workspaceService'
import { useAuthStore } from '@/store/auth'
import { useQuery } from '@tanstack/react-query'

export const useWorkspace = (workspaceId: number) => {
  const access = useAuthStore((state) => state.access)

  return useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => getWorkspacesMembers(access, workspaceId),
    enabled: !!access && !!workspaceId,
  })
}
