import { createTask, type TaskPayload } from '@/services/taskService'
import { useAuthStore } from '@/store/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Textarea } from './ui/textarea'
export function TaskDialog({ workspaceId }: { workspaceId: number }) {
  const access = useAuthStore((s) => s.access)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState<Date | undefined>()
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('')

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (task: TaskPayload) => {
      if (!access) {
        return Promise.reject(new Error('No access token found'))
      }
      return createTask(access, task)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] })
      setTitle('')
      setDescription('')
      setDate(undefined)
      setPriority('')
    },
    onError: (error: any) => {
      console.error('Failed to create task:', error)
      alert(`Failed to create task: ${error.message || error}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('handleSubmit called')

    if (!title || !priority || !date) {
      alert('Please fill all required fields')
      return
    }

    if (!access) {
      alert('User not authenticated')
      return
    }

    mutation.mutate({
      workspace: workspaceId,
      title,
      description,
      deadline: date.toISOString(),
      priority,
      status: 'todo',
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Task</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Fill in the task details below including title, description, due
              date, time, priority, and assign responsible users.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />

            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {date ? date.toLocaleDateString('en-US') : 'Pick date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>

            <Label>Priority</Label>
            <Select
              onValueChange={(val) =>
                setPriority(val as 'low' | 'medium' | 'high')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
