import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/workflow/')({
  component: Workflow,
})

function Workflow() {
  return (
    <div className="flex justify-center">
      <h1>Workflow Main Page</h1>
    </div>
  )
}
