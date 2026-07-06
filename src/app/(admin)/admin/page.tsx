import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  const postsCount = await prisma.post.count()
  const usersCount = await prisma.user.count()
  const categoriesCount = await prisma.category.count()
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your blog's performance and metrics.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Posts</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold">{postsCount}</div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Registered Users</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold">{usersCount}</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Categories</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold">{categoriesCount}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
