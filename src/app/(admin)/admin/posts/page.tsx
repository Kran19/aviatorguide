import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic';
import Link from "next/link"
import { Button } from "@/components/ui/button"

import { auth } from "@/lib/auth"

export default async function AdminPostsPage() {
  const session = await auth()
  
  const posts = await prisma.post.findMany({
    where: session?.user?.role === "AUTHOR" ? { authorId: session.user.id } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground mt-2">Manage your blog posts here.</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">Create Post</Link>
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  No posts found. Create one to get started.
                </td>
              </tr>
            ) : (
              posts.map((post: any) => (
                <tr key={post.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                      ${post.status === 'PUBLISHED' ? 'bg-primary/10 text-primary' : 
                        post.status === 'PENDING_APPROVAL' ? 'bg-yellow-500/10 text-yellow-500' :
                        post.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' :
                        'bg-muted text-muted-foreground'}`}>
                      {post.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{post.author?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                    </Button>
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
