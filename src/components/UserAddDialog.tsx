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
  return (
    <div className="my-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={'outline'}>Add user</Button>
        </DialogTrigger>
        <form>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new member</DialogTitle>
              <DialogDescription>
                You can add new user to your workspace by unique username
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 my-4">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Write username"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  )
}
