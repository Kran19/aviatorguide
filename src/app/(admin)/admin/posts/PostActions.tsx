"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deletePost, quickApprovePost, rejectPost } from "@/app/actions/post"
import { Loader2, Trash2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

export function PostActions({ postId, status, isAdmin }: { postId: string, status: string, isAdmin: boolean }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

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
      toast.success(status === "PENDING_APPROVAL" ? "Post approved and published." : "Post published successfully.")
    } catch (error) {
      console.error(error)
      toast.error(status === "PENDING_APPROVAL" ? "Failed to approve post" : "Failed to publish post")
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this post?")) return
    setIsRejecting(true)
    try {
      await rejectPost(postId)
      toast.success("Post rejected.")
    } catch (error) {
      console.error(error)
      toast.error("Failed to reject post")
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {status !== "PUBLISHED" && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleApprove}
          disabled={isApproving || isDeleting || isRejecting}
          className="text-green-600 border-green-600 hover:bg-green-50"
          title={status === "PENDING_APPROVAL" ? "Approve & Publish" : "Publish directly"}
        >
          {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
        </Button>
      )}
      {status === "PENDING_APPROVAL" && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReject}
          disabled={isApproving || isDeleting || isRejecting}
          className="text-orange-600 border-orange-600 hover:bg-orange-50"
          title="Reject Post"
        >
          {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting || isApproving || isRejecting}
        className="text-destructive border-destructive hover:bg-destructive/10"
        title="Delete Post"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
