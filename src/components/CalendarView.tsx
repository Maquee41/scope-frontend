import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getTasksByDay } from '@/services/taskService'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

type Task = {
  id: number
  title: string
  description: string
  deadline: string
  status: string
}

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  // Replace with actual access token and workflowId from your context/session
  const access = 'your-access-token'
  const workflowId = 1

  useEffect(() => {
    const fetchTasks = async () => {
      if (!date || !access) return
      setLoading(true)
      try {
        const formattedDate = format(date, 'yyyy-MM-dd')
        const result = await getTasksByDay({
          workflowId,
          day: formattedDate,
          access,
        })
        setTasks(result)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        setTasks([])
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [date])

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <Calendar
        mode="single"
        defaultMonth={date}
        numberOfMonths={2}
        selected={date}
        onSelect={setDate}
        className="rounded-lg border shadow-sm"
      />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Tasks for selected day</CardTitle>
          <CardDescription>
            {date ? format(date, 'PPP') : 'No date selected'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks for this day</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="border rounded p-2">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {task.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    Status: {task.status}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          {tasks.length > 0 && <p>Total tasks: {tasks.length}</p>}
        </CardFooter>
      </Card>
    </div>
  )
}
