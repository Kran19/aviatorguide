"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deletePost, quickApprovePost } from "@/app/actions/post"
import { Loader2, Trash2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export function PostActions({ postId, status, isAdmin }: { postId: string, status: string, isAdmin: boolean }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  if (!isAdmin) return null

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return
    setIsDeleting(true)
    try {
      await deletePost(postId)
      toast.success("Post deleted successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete post")
      setIsDeleting(false)
    }
  }

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      await quickApprovePost(postId)
      toast.success("Post approved and published.")
    } catch (error) {
      console.error(error)
      toast.error("Failed to approve post")
      setIsApproving(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {status === "PENDING_APPROVAL" && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleApprove}
          disabled={isApproving || isDeleting}
          className="text-green-600 border-green-600 hover:bg-green-50"
          title="Quick Approve"
        >
          {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting || isApproving}
        className="text-destructive border-destructive hover:bg-destructive/10"
        title="Delete Post"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
