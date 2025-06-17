import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { IUserProfile } from '@/services/profileService'
import { updateTaskAssignees } from '@/services/taskService'
import { useAuthStore } from '@/store/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Ellipsis } from 'lucide-react'
import React from 'react'

type Props = {
  members: IUserProfile[]
  assignees: number[]
  setAssignees: React.Dispatch<React.SetStateAction<number[]>>
  taskId: number
}

export function AssigneesDialog({
  members,
  assignees,
  setAssignees,
  taskId,
}: Props) {
  const accessToken = useAuthStore((s) => s.access)
  const queryClient = useQueryClient()
  const [open, setOpen] = React.useState(false)

  const toggleAssignee = (userId: number) => {
    setAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    )
  }

  const assigneeMutation = useMutation({
    mutationFn: ({
      id,
      assignee_ids,
    }: {
      id: number
      assignee_ids: number[]
    }) => updateTaskAssignees({ id, assignee_ids, access: accessToken }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setOpen(false) // Close dialog after success
    },
    onError: (err) => {
      console.error('Error updating assignees:', err)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Ellipsis />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Users</DialogTitle>
          <DialogDescription>
            Select the users who will be working on this task.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-60 pr-4">
          <div className="flex flex-col gap-3">
            {members.map((user) => (
              <Label
                key={user.id}
                htmlFor={`user-${user.id}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  id={`user-${user.id}`}
                  checked={assignees.includes(user.id)}
                  onCheckedChange={() => toggleAssignee(user.id)}
                />
                {user.username}
              </Label>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() =>
              assigneeMutation.mutate({ id: taskId, assignee_ids: assignees })
            }
            disabled={assigneeMutation.isPending}
          >
            {assigneeMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
