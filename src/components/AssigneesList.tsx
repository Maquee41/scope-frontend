import type { IUserProfile } from '@/services/profileService'

type Props = {
  assignedUsers: IUserProfile[]
}

export function AssigneesList({ assignedUsers }: Props) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-1">Performers:</h4>
      {assignedUsers.length > 0 ? (
        <ul className="list-disc list-inside text-sm">
          {assignedUsers.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Performers not appointed
        </p>
      )}
    </div>
  )
}
