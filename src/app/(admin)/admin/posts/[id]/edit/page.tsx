import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditPostForm from "./EditPostForm"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!post) {
    notFound()
  }

  return <EditPostForm post={post} />
}
