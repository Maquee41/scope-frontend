import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { fetchTasks, type Task } from '@/services/taskService'
import { getWorkspacesMembers } from '@/services/workspaceService'
import { useAuthStore } from '@/store/auth'
import { useQuery } from '@tanstack/react-query'
import { TaskCard } from './TaskCard'

type TaskAccordionProps = {
  workspaceId: number
}

type Member = {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export function TaskAccordion({ workspaceId }: TaskAccordionProps) {
  const access = useAuthStore((s) => s.access)

  const {
    data: tasksData,
    isLoading: isTasksLoading,
    isError: isTasksError,
    error: tasksError,
  } = useQuery<Task[], Error>({
    queryKey: ['tasks', workspaceId],
    queryFn: () => {
      if (!access) throw new Error('No access token')
      return fetchTasks(access, workspaceId)
    },
    enabled: !!access && !!workspaceId,
  })

  const {
    data: workspaceData,
    isLoading: isWorkspaceLoading,
    isError: isWorkspaceError,
    error: workspaceError,
  } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => {
      if (!access) throw new Error('No access token')
      return getWorkspacesMembers(access, workspaceId)
    },
    enabled: !!access && !!workspaceId,
  })

  if (isTasksLoading || isWorkspaceLoading) return <div>Loading...</div>
  if (isTasksError) return <div>Error loading tasks: {tasksError?.message}</div>
  if (isWorkspaceError)
    return <div>Error loading workspace: {workspaceError?.message}</div>

  const tasks: Task[] = tasksData ?? []
  const members: Member[] = workspaceData?.members ?? []

  const groupedTasks = {
    todo: tasks.filter((t: Task) => t.status === 'todo'),
    in_progress: tasks.filter((t: Task) => t.status === 'in_progress'),
    done: tasks.filter((t: Task) => t.status === 'done'),
  }

  const statuses = [
    { key: 'todo', label: 'To Do' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
  ] as const

  return (
    <Accordion
      type="multiple"
      defaultValue={['items-to-do', 'items-in-progress', 'items-done']}
      className="w-full"
    >
      {statuses.map(({ key, label }) => (
        <AccordionItem
          value={`items-${label.toLowerCase().replace(' ', '-')}`}
          key={key}
        >
          <AccordionTrigger className="cursor-pointer">
            {label}
          </AccordionTrigger>
          <AccordionContent
            className={`flex flex-col gap-4 text-balance items-center ${
              key === 'done' ? 'opacity-50' : ''
            }`}
          >
            {groupedTasks[key].length === 0 && (
              <div>No tasks in this status</div>
            )}
            {groupedTasks[key].map((task: Task) => (
              <TaskCard
                id={task.id}
                key={task.id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                status={task.status}
                date={new Date(task.deadline).toLocaleDateString('en-US')}
                workspaceId={workspaceId}
                assignee={task.assignees}
                members={members}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
