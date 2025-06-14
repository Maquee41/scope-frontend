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

const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Editor',
    status: 'Inactive',
  },
  {
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    role: 'Viewer',
    status: 'Active',
  },
  {
    name: 'Dana White',
    email: 'dana@example.com',
    role: 'Editor',
    status: 'Active',
  },
  {
    name: 'Eve Black',
    email: 'eve@example.com',
    role: 'Admin',
    status: 'Inactive',
  },
]

export function UserTable() {
  return (
    <Table>
      <TableCaption>A list of your team members</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell className="text-right">{user.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Users</TableCell>
          <TableCell className="text-right">{users.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
