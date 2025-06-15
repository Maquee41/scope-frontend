import { addMemberToWorkspace } from '@/services/workspaceService'
import { useAuthStore } from '@/store/auth'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { toast, Toaster } from 'sonner'
import { Button } from './ui/button'
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

export function UserAddDialog({ workspaceId }: { workspaceId: number }) {
  const [username, setUsername] = useState('')
  const access = useAuthStore((s) => s.access)
  const closeRef = useRef<HTMLButtonElement>(null)

  const mutation = useMutation({
    mutationFn: (username: string) =>
      addMemberToWorkspace(workspaceId, username, access),
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        'Something went wrong'
      toast.error('Failed to add user', {
        description: message,
      })
    },
    onSuccess: () => {
      toast.success('User added successfully')
      setUsername('')
      // Закрываем модалку
      closeRef.current?.click()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(username)
  }

  return (
    <>
      <Toaster />
      <div className="my-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add user</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add new member</DialogTitle>
                <DialogDescription>
                  You can add a new user to your workspace by unique username
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 my-4">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Write username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" ref={closeRef}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Adding...' : 'Add'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
