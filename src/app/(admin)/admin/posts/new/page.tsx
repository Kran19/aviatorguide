import { auth } from "@/lib/auth"
import NewPostForm from "./NewPostForm"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const session = await auth()
  
  if (!session?.user?.role) {
    redirect("/")
  }

  const [categories, authors] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.author.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  return (
    <div className="container mx-auto py-10">
      <NewPostForm userRole={session.user.role} categories={categories} authors={authors} />
    </div>
  )
}
