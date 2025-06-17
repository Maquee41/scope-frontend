import { CalendarView } from '@/components/CalendarView'
import { TaskAccordion } from '@/components/TaskAccordion'
import { TaskDialog } from '@/components/TaskDialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserTable } from '@/components/UserTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/workflow/$id')({
  component: WorkflowDetails,
})

function WorkflowDetails() {
  const { id } = Route.useParams()

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-2xl font-bold mb-6">Workflow {id}</h1>
        <Tabs defaultValue="desk" className="w-full">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="desk">Desk</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="desk">
            <div className="flex flex-col items-center gap-y-2 mt-3">
              <TaskDialog workspaceId={Number(id)} />
              <TaskAccordion workspaceId={Number(id)} />
            </div>
          </TabsContent>
          <TabsContent value="calendar">
            <CalendarView workspaceId={Number(id)} />
          </TabsContent>
          <TabsContent value="users">
            <UserTable workspaceId={Number(id)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
