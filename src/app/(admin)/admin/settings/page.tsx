import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import SettingsForm from "./SettingsForm"

export default async function SettingsPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin")
  }

  const settings = await prisma.globalSettings.findUnique({
    where: { id: "global" }
  })

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Settings</h1>
        <p className="text-muted-foreground">Manage your website's global SEO and configuration.</p>
      </div>

      <div className="rounded-md border p-6 bg-card">
        <SettingsForm initialData={settings} />
      </div>
    </div>
  )
}
