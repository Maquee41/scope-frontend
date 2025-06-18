import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotifications } from '@/hooks/useNotifications'
import { useAuthStore } from '@/store/auth'
import { createFileRoute } from '@tanstack/react-router'
import { BellIcon } from 'lucide-react'

export const Route = createFileRoute('/_private/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  const access = useAuthStore((s) => s.access)
  const { data: notifications, isLoading } = useNotifications(access)

  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <BellIcon className="w-6 h-6 text-primary" />
        Notifications
      </h1>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {notifications?.length === 0 && (
        <p className="text-muted-foreground">You're all caught up!</p>
      )}

      {notifications?.map((notif) => (
        <Card
          key={notif.id}
          className={`transition border ${
            notif.is_read ? 'opacity-60' : 'border-primary'
          }`}
        >
          <CardContent className="py-4 px-5">
            <p className="text-sm">{notif.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(notif.created_at).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
