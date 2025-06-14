import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useWorkspace } from '@/hooks/useWorkspace'
import { UserAddDialog } from './UserAddDialog'

interface WorkspaceMember {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export function UserTable({ workspaceId }: { workspaceId: number }) {
  const { data: workspace, isLoading, isError } = useWorkspace(workspaceId)

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Failed to load users</div>

  const members: WorkspaceMember[] = workspace?.members || []

  return (
    <>
      <UserAddDialog workspaceId={Number(workspaceId)} />
      <Table>
        <TableCaption>A list of your team members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Username</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right">{user.username}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total Users</TableCell>
            <TableCell className="text-right">{members.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  )
}
