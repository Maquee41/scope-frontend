import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateTaskStatus, type TaskStatus } from '@/services/taskService'
import { useAuthStore } from '@/store/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type Props = {
  status: TaskStatus
  setStatus: (status: TaskStatus) => void
  taskId: number
}

export function TaskStatusSelector({ status, setStatus, taskId }: Props) {
  const accessToken = useAuthStore((s) => s.access)
  const queryClient = useQueryClient()

  const statusMutation = useMutation({
    mutationFn: updateTaskStatus,
    onMutate: async ({ status }) => {
      setStatus(status)
    },
    onError: (error) => {
      console.error('Error updating status:', error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const handleStatusChange = (newStatus: string) => {
    statusMutation.mutate({ id: taskId, status: newStatus as TaskStatus })
  }

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger>
        <SelectValue placeholder="Change status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todo">To Do</SelectItem>
        <SelectItem value="in_progress">In Progress</SelectItem>
        <SelectItem value="done">Done</SelectItem>
      </SelectContent>
    </Select>
  )
}
