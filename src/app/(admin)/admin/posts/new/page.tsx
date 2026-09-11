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

  let categories: any[] = []
  let authors: any[] = []
  try {
    const res = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.author.findMany({
        orderBy: { name: 'asc' }
      })
    ])
    categories = res[0] || []
    authors = res[1] || []
  } catch (e: any) {
    console.warn("Database offline or unreachable; using fallback categories/authors:", e?.message || e)
    categories = [{ id: "cat-default", name: "General", slug: "general" }]
    authors = [{ id: "auth-default", name: "Default Admin Author", email: "admin@betsetgo.xyz" }]
  }

  return (
    <div className="container mx-auto py-10">
      <NewPostForm userRole={session.user.role} categories={categories} authors={authors} />
    </div>
  )
}
