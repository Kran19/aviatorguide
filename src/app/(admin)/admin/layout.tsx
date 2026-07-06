import { ReactNode } from "react"
import Link from "next/link"
import { FileText, LayoutDashboard, Tags, Users, Settings, User } from "lucide-react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session?.user) {
    redirect("/admin/login")
  }

  const isAdmin = session.user.role === "ADMIN"

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30">
        <div className="sticky top-16 p-4">
          <div className="mb-8 px-4 font-bold text-sm tracking-widest text-muted-foreground uppercase">
            {isAdmin ? "Super Admin" : "Author Panel"}
          </div>
          <nav className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link href="/admin/posts" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
              <FileText className="h-4 w-4" />
              Posts
            </Link>
            {isAdmin && (
              <>
                <Link href="/admin/categories" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
                  <Tags className="h-4 w-4" />
                  Categories
                </Link>
                <Link href="/admin/users" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
                  <Users className="h-4 w-4" />
                  Users
                </Link>
                <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </>
            )}
            <Link href="/admin/profile" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}
