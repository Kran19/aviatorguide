import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = 'force-dynamic';
import { notFound } from "next/navigation"
import EditPostForm from "./EditPostForm"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth()
  const post = await prisma.post.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <EditPostForm post={post} userRole={session?.user?.role || "USER"} />
    </div>
  )
}
