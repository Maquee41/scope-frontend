import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar1 } from 'lucide-react'

export function TaskCard({
  title,
  description,
  date,
  priority,
}: {
  title: string
  description: string
  date: string
  priority: 'low' | 'medium' | 'high'
}) {
  return (
    <Card className="flex w-4/5 text-start">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex gap-x-2">
        <Badge variant="destructive">{priority}</Badge>
        <Badge className="bg-blue-500 text-white dark:bg-blue-600">
          <Calendar1 />
          <time dateTime={date}>{date}</time>
        </Badge>
      </CardContent>
    </Card>
  )
}
