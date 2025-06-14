import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { fetchTasks, type Task } from '@/services/taskService'
import { useAuthStore } from '@/store/auth'
import { useQuery } from '@tanstack/react-query'
import { TaskCard } from './TaskCard'

type TaskAccordionProps = {
  workspaceId: number
}

export function TaskAccordion({ workspaceId }: TaskAccordionProps) {
  const access = useAuthStore((s) => s.access)

  const { data, isLoading, isError, error } = useQuery<Task[], Error>({
    queryKey: ['tasks', workspaceId],
    queryFn: () => {
      if (!access) throw new Error('No access token')
      return fetchTasks(access, workspaceId)
    },
    enabled: !!access && !!workspaceId,
  })

  const tasks: Task[] = data ?? []

  if (isLoading) return <div>Loading tasks...</div>
  if (isError) return <div>Error loading tasks: {error?.message}</div>

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
                key={task.id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                date={new Date(task.deadline).toLocaleDateString()}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
