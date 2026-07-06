import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import ProfileForm from "./ProfileForm"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and password.</p>
      </div>

      <div className="rounded-md border p-6 bg-card">
        <ProfileForm initialName={session.user.name || ""} email={session.user.email || ""} />
      </div>
    </div>
  )
}
