import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { PostActions } from "./PostActions"
import { AdminFilters } from "./AdminFilters"

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<{ page?: string, search?: string, sort?: string }> }) {
  const resolvedParams = await searchParams;
  const session = await auth()
  
  const page = Number(resolvedParams.page) || 1
  const limit = 10
  const skip = (page - 1) * limit
  const search = resolvedParams.search || ""
  const sort = resolvedParams.sort || "newest"

  const isAdmin = session?.user?.role === "ADMIN"

  const whereCondition: any = {
    ...(session?.user?.role === "AUTHOR" ? { authorId: session.user.id } : {}),
  }

  if (search) {
    whereCondition.title = { contains: search, mode: 'insensitive' }
  }

  if (sort === "status_published") {
    whereCondition.status = "PUBLISHED"
  } else if (sort === "status_pending") {
    whereCondition.status = "PENDING_APPROVAL"
  }

  let orderBy: any = { createdAt: 'desc' }
  if (sort === "oldest") {
    orderBy = { createdAt: 'asc' }
  }

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: whereCondition,
      orderBy,
      include: { author: true, authorProfile: true },
      skip,
      take: limit
    }),
    prisma.post.count({ where: whereCondition })
  ])
  
  const totalPages = Math.ceil(totalCount / limit) || 1

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

      <AdminFilters />

      <div className="rounded-md border bg-card overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b">
            <tr>
              <th className="px-4 py-3 font-medium">Image</th>
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
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No posts found matching your criteria.
                </td>
              </tr>
            ) : (
              posts.map((post: any) => (
                <tr key={post.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    {post.featuredImage ? (
                      <img src={post.featuredImage} alt={post.title} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">No img</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <span className="line-clamp-2">{post.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap
                      ${post.status === 'PUBLISHED' ? 'bg-primary/10 text-primary' : 
                        post.status === 'PENDING_APPROVAL' ? 'bg-yellow-500/10 text-yellow-500' :
                        post.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' :
                        'bg-muted text-muted-foreground'}`}>
                      {post.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{post.authorProfile?.name || post.author?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                      </Button>
                      <PostActions postId={post.id} status={post.status} isAdmin={isAdmin} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalCount > 0 && (
        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {skip + 1} to {Math.min(skip + limit, totalCount)} of {totalCount} posts
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} asChild={page > 1}>
              {page > 1 ? <Link href={`/admin/posts?page=${page - 1}&search=${search}&sort=${sort}`}>Previous</Link> : <span>Previous</span>}
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} asChild={page < totalPages}>
              {page < totalPages ? <Link href={`/admin/posts?page=${page + 1}&search=${search}&sort=${sort}`}>Next</Link> : <span>Next</span>}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
