import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/workflow/$id')({
  component: WorkflowDetails,
})

function WorkflowDetails() {
  const { id } = Route.useParams()

  return <div>Hello workflow {id}!</div>
}
