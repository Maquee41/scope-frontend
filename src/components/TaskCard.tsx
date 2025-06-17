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
import type { IUserProfile } from '@/services/profileService'
import type { TaskStatus } from '@/services/taskService'
import { Calendar1, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AssigneesDialog } from './AssigneesDialog'
import { AssigneesList } from './AssigneesList'
import { CommentDialog } from './CommentDialog'
import { TaskStatusSelector } from './TaskStatusSelector'
import { Button } from './ui/button'

type TaskCardProps = {
  id: number
  title: string
  description: string
  date: string
  priority: 'low' | 'medium' | 'high'
  status: TaskStatus
  workspaceId: number
  assignee: IUserProfile[]
  members: IUserProfile[]
}

export function TaskCard({
  id,
  title,
  description,
  date,
  priority,
  status,
  assignee,
  members,
  workspaceId,
}: TaskCardProps) {
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(status)
  const [assignees, setAssignees] = useState<number[]>(
    assignee.map((user) => user.id) ?? [],
  )
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    setAssignees(assignee.map((user) => user.id) ?? [])
  }, [assignee])

  const priorityColor = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  }[priority]

  return (
    <>
      <Card className="flex w-full max-w-3xl flex-col text-start shadow-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction>
            <TaskStatusSelector
              status={currentStatus}
              setStatus={setCurrentStatus}
              taskId={id}
            />
          </CardAction>
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Badge className={`${priorityColor} text-white capitalize`}>
                {priority}
              </Badge>
              <Badge className="bg-blue-500 text-white flex items-center gap-1">
                <Calendar1 className="w-4 h-4" />
                <time dateTime={date}>
                  {new Date(date).toLocaleDateString('en-US')}
                </time>
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <AssigneesDialog
                members={members}
                assignees={assignees}
                setAssignees={setAssignees}
                taskId={id}
              />
              <Button variant="ghost" onClick={() => setShowComments(true)}>
                <MessageCircle />
              </Button>
            </div>
          </div>

          <AssigneesList assignedUsers={assignee} />
        </CardContent>
      </Card>

      <CommentDialog
        open={showComments}
        onOpenChange={setShowComments}
        workspaceId={workspaceId}
        taskId={id}
        taskTitle={title}
      />
    </>
  )
}
