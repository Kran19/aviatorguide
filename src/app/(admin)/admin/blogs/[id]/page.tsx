import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BlogRedirectEditorClient } from "./BlogRedirectEditorClient"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface BlogEditPageProps {
  params: Promise<{ id: string }>
}

export default async function BlogEditPage({ params }: BlogEditPageProps) {
  const session = await auth()
  if (!session?.user) {
    redirect("/admin/login")
  }

  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="p-6 sm:p-10 bg-slate-950 min-h-screen text-slate-100 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link href="/admin/blogs" className="text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center space-x-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blogs List</span>
        </Link>

        <a
          href={`/blog/${post.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-emerald-400 hover:underline flex items-center space-x-1"
        >
          <span>View Public Blog Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">{post.title}</h1>
        <p className="text-xs font-mono text-slate-500">Slug: /blog/{post.slug}</p>
      </div>

      {/* Super Admin Redirect Settings Card */}
      <BlogRedirectEditorClient post={post} userRole={session.user.role} />
    </div>
  )
}
