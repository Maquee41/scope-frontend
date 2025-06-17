import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Paperclip } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'

import { getComments, postComment } from '@/services/commentService'
import { useAuthStore } from '@/store/auth'

interface CommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: number
  taskId: number
  taskTitle: string
}

function truncateFilename(filePath: string, maxLength = 30) {
  const parts = filePath.split('/')
  const filename = parts[parts.length - 1]
  const [name, ext] = filename.split(/\.(?=[^\.]+$)/)

  const truncatedName =
    name.length > maxLength ? name.slice(0, maxLength) + '…' : name

  return ext ? `${truncatedName}.${ext}` : truncatedName
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
  const [files, setFiles] = useState<File[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', workspaceId, taskId],
    queryFn: () => getComments({ workspaceId, taskId, access }),
    enabled: open && !!access,
  })

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () => postComment({ taskId, text: newComment, access, files }),
    onSuccess: () => {
      setNewComment('')
      setFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      queryClient.invalidateQueries({
        queryKey: ['comments', workspaceId, taskId],
      })
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    if (!newComment.trim()) return
    mutate()
  }

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
                {comment.files?.length > 0 && (
                  <ul className="mt-2 text-sm space-y-1">
                    {comment.files.map((file: any) => (
                      <li key={file.id}>
                        <a
                          href={file.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                          download
                        >
                          <Paperclip size={14} />
                          {truncateFilename(file.file)}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            disabled={isSubmitting}
          />

          <div className="flex items-center gap-2">
            <Label
              htmlFor="comment-files"
              className={`cursor-pointer text-sm flex items-center gap-1 ${
                isSubmitting
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:underline'
              }`}
            >
              <Paperclip size={16} />
              Attach files
            </Label>
            <input
              id="comment-files"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isSubmitting}
              ref={fileInputRef}
            />
            {files.length > 0 && (
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {files.map((f) => f.name).join(', ')}
              </span>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
