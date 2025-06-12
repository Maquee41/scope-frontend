import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAuthStore } from '@/store/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_private')({
  beforeLoad: async () => {
    const isAuth = useAuthStore.getState().isAuthenticated
    if (!isAuth) {
      throw redirect({ to: '/login' })
    }
  },
  component: PrivateLayout,
})

function PrivateLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-5 w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
