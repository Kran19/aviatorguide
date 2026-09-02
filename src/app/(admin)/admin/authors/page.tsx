import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AuthorsClient } from "./AuthorsClient"

export const dynamic = "force-dynamic"

export default async function AuthorsPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin")
  }

  const authors = await prisma.author.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  return <AuthorsClient initialAuthors={authors} />
}
