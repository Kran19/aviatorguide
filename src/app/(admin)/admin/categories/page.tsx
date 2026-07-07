import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { deleteCategory } from "@/actions/category.actions"
import NewCategoryModal from "./new-category-modal"

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedParams = await searchParams;
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin")
  }

  const page = Number(resolvedParams.page) || 1
  const limit = 10
  const skip = (page - 1) * limit

  const [categories, totalCount] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      skip,
      take: limit,
      include: {
        _count: {
          select: { posts: true }
        }
      }
    }),
    prisma.category.count()
  ])
  
  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage blog categories and topics.</p>
        </div>
        <NewCategoryModal />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat: any) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell>{cat.description || "-"}</TableCell>
                <TableCell>{cat._count.posts}</TableCell>
                <TableCell className="text-right">
                  <form action={async () => {
                    "use server"
                    await deleteCategory(cat.id)
                  }}>
                    <Button 
                      variant="destructive" 
                      size="sm"
                    >
                      Delete
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-muted-foreground">
          Showing {skip + 1} to {Math.min(skip + limit, totalCount)} of {totalCount} categories
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild={page > 1}>
            {page > 1 ? <Link href={`/admin/categories?page=${page - 1}`}>Previous</Link> : <span>Previous</span>}
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild={page < totalPages}>
            {page < totalPages ? <Link href={`/admin/categories?page=${page + 1}`}>Next</Link> : <span>Next</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
