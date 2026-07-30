"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateBlogRedirectAction({
  postId,
  redirectEnabled,
  redirectUrl,
}: {
  postId: string
  redirectEnabled: boolean
  redirectUrl: string | null
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only Super Admin can modify redirect settings.")
  }

  // Fetch current state for audit log
  const currentPost = await prisma.post.findUnique({
    where: { id: postId },
    select: { redirectEnabled: true, redirectUrl: true, title: true },
  })

  if (!currentPost) {
    throw new Error("Blog post not found.")
  }

  // Validate URL format if enabled
  if (redirectEnabled && redirectUrl) {
    try {
      new URL(redirectUrl)
    } catch {
      throw new Error("Invalid Destination URL format. Must be a valid HTTP/HTTPS URL.")
    }
  }

  // Update Post record
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      redirectEnabled,
      redirectUrl: redirectEnabled ? redirectUrl : null,
    },
  })

  // Log in Audit Trail
  await prisma.blogAuditLog.create({
    data: {
      postId,
      action: "UPDATE_REDIRECT_SETTINGS",
      userId: session.user.id,
      userEmail: session.user.email || "admin@betsetgo.xyz",
      oldValue: JSON.stringify({
        redirectEnabled: currentPost.redirectEnabled,
        redirectUrl: currentPost.redirectUrl,
      }),
      newValue: JSON.stringify({
        redirectEnabled,
        redirectUrl: redirectEnabled ? redirectUrl : null,
      }),
    },
  })

  revalidatePath("/admin/blogs")
  revalidatePath(`/admin/blogs/${postId}`)
  revalidatePath("/admin/analytics")

  return { success: true, post: updatedPost }
}

export async function deleteAnalyticsAction({ postId }: { postId?: string }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only Super Admin can delete analytics data.")
  }

  if (postId) {
    await prisma.blogVisitor.deleteMany({ where: { postId } })
    await prisma.blogClick.deleteMany({ where: { postId } })
    await prisma.blogRedirectLog.deleteMany({ where: { postId } })
  } else {
    await prisma.blogVisitor.deleteMany()
    await prisma.blogClick.deleteMany()
    await prisma.blogRedirectLog.deleteMany()
  }

  await prisma.blogAuditLog.create({
    data: {
      postId: postId || null,
      action: "DELETE_ANALYTICS",
      userId: session.user.id,
      userEmail: session.user.email || "admin@betsetgo.xyz",
      oldValue: "All visitor and click telemetry logs",
      newValue: "Purged",
    },
  })

  revalidatePath("/admin/analytics")
  return { success: true }
}
