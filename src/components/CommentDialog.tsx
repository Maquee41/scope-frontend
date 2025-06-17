import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getComments, postComment } from '@/services/commentService'
import { useAuthStore } from '@/store/auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface CommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: number
  taskId: number
  taskTitle: string
}

export const CommentDialog = ({
  open,
  onOpenChange,
  workspaceId,
  taskId,
  taskTitle,
}: CommentDialogProps) => {
  const access = useAuthStore((s) => s.access)
  const queryClient = useQueryClient()
  const [newComment, setNewComment] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', workspaceId, taskId],
    queryFn: () => getComments({ workspaceId, taskId, access }),
    enabled: open && !!access,
  })

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () => postComment({ taskId, text: newComment, access }),
    onSuccess: () => {
      setNewComment('')
      queryClient.invalidateQueries({
        queryKey: ['comments', workspaceId, taskId],
      })
    },
  })
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Comments for Task "{taskTitle}"</DialogTitle>
          <DialogDescription>
            Read feedback and updates related to this task.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[300px] mt-4 pr-2">
          {isLoading && <p className="text-sm">Loading comments...</p>}
          {error && <p className="text-red-500">Failed to load comments.</p>}
          {!isLoading && !error && data?.length === 0 && (
            <p className="text-muted-foreground">No comments yet.</p>
          )}
          <ul className="space-y-3">
            {data?.map((comment: any) => (
              <li key={comment.id} className="border rounded p-3 text-left">
                <p className="text-sm font-semibold text-primary mb-1">
                  {comment.author_name || 'Anonymous'}
                </p>
                <p className="text-sm">{comment.text}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </ScrollArea>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (newComment.trim()) mutate()
          }}
          className="flex items-center gap-2 mt-4"
        >
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
