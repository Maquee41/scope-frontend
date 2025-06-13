import { Command } from 'lucide-react'
import * as React from 'react'

import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { getProfileData } from '@/services/profileService'
import { getWorkspaces } from '@/services/workspaceService'
import { useAuthStore } from '@/store/auth'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  const access = useAuthStore((s) => s.access)

  const { data: user } = useQuery({
    queryKey: ['me', access],
    queryFn: () => {
      if (!access) return Promise.reject('No access token')
      return getProfileData(access)
    },
    enabled: !!access,
  })

  const { data: projects } = useQuery({
    queryKey: ['workspaces', access],
    queryFn: () => getWorkspaces(access),
    enabled: !!access,
  })

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              onClick={async () => navigate({ to: '/workflow' })}
            >
              <div className="cursor-pointer">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Scope</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser user={user} /> : <div>Error</div>}
      </SidebarFooter>
    </Sidebar>
  )
}
