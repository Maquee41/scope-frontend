'use client'

import { Folder, MoreHorizontal, Plus, Share, Trash2 } from 'lucide-react'

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import { useCreateWorkspace } from '@/hooks/useCreateWorkspace'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function NavProjects({
  projects,
}: {
  projects: {
    id: number
    name: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [workspaceName, setWorkspaceName] = useState('Scope Team')
  const createWorkspace = useCreateWorkspace()

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log(`submit: ${workspaceName}`)

    if (!workspaceName.trim()) return

    createWorkspace.mutate(
      { name: workspaceName },
      {
        onSuccess: () => {
          setWorkspaceName('')
        },
        onError: (err) => {
          console.error('Ошибка создания workspace:', err)
        },
      },
    )
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex justify-between items-center">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <Dialog>
          <DialogTrigger asChild>
            <Plus
              width={20}
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground/55 cursor-pointer transition-colors"
            />
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create Workspace</DialogTitle>
                <DialogDescription>
                  Create new workspace for your team and add new members. Click
                  save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-3">
                  <Label htmlFor="workspace-name">Name</Label>
                  <Input
                    id="workspace-name"
                    name="name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={createWorkspace.isPending}>
                  {createWorkspace.isPending ? 'Creating...' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <SidebarMenu>
        {projects?.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <div
                className="cursor-pointer"
                onClick={() => {
                  router.navigate({ to: `/workflow/${item.id}` })
                }}
              >
                <Folder className="mr-2" />
                <span>{item.name}</span>
              </div>
            </SidebarMenuButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-48"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem className="cursor-pointer">
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
