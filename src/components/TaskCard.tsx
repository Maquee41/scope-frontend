import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { updateTaskStatus, type TaskStatus } from '@/services/taskService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar1 } from 'lucide-react'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

type TaskCardProps = {
  id: number
  title: string
  description: string
  date: string
  priority: 'low' | 'medium' | 'high'
  status: TaskStatus
}

export function TaskCard({
  id,
  title,
  description,
  date,
  priority,
  status,
}: TaskCardProps) {
  const priorityColor = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  }[priority]

  const queryClient = useQueryClient()

  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(status)

  const mutation = useMutation({
    mutationFn: updateTaskStatus,
    onMutate: async ({ status }) => {
      setCurrentStatus(status)
    },
    onError: (error) => {
      console.error('Error updating status:', error)
    },
    onSuccess: (data) => {
      console.log('Updated OK', data)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const handleStatusChange = (newStatus: string) => {
    mutation.mutate({ id, status: newStatus as TaskStatus })
  }

  return (
    <Card className="flex w-4/5 text-start">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent className="flex gap-x-2">
        <Badge className={`${priorityColor} text-white`}>{priority}</Badge>
        <Badge className="bg-blue-500 text-white dark:bg-blue-600 flex items-center gap-1">
          <Calendar1 className="w-4 h-4" />
          <time dateTime={date}>{date}</time>
        </Badge>
      </CardContent>
    </Card>
  )
}
