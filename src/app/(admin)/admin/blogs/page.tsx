import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit, BarChart2, Globe, ExternalLink, ShieldCheck } from "lucide-react"

export default async function AdminBlogsPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/admin/login")
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: {
        select: { visitors: true, clicks: true },
      },
    },
  })

  const userRole = session.user.role

  return (
    <div className="p-6 sm:p-10 bg-slate-950 min-h-screen text-slate-100 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Blog Management</h1>
          <p className="text-sm text-slate-400">Manage blog articles, custom SEO parameters, and dynamic redirect settings.</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/posts/new"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Blog Post</span>
          </Link>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Title / Slug</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Redirect Status</th>
              <th className="py-3.5 px-4">Destination URL</th>
              <th className="py-3.5 px-4">Views / Clicks</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No blogs found. Create your first blog post!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-white text-sm">{post.title}</div>
                    <div className="text-slate-500 text-xs font-mono">/blog/{post.slug}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        post.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {post.redirectEnabled ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                        <span>REDIRECT ON</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
                        REDIRECT OFF
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-400 truncate max-w-[200px]">
                    {post.redirectEnabled && post.redirectUrl ? (
                      <a href={post.redirectUrl} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center space-x-1">
                        <span className="truncate">{post.redirectUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-600">None</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-white">{post._count.visitors} Visits</div>
                    <div className="text-xs text-purple-400">{post._count.clicks} Clicks</div>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <Link
                      href={`/admin/blogs/${post.id}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>
                    <Link
                      href={`/admin/analytics`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Analytics</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
