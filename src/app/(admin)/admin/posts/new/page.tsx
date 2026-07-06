import { auth } from "@/lib/auth"
import NewPostForm from "./NewPostForm"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const session = await auth()
  
  if (!session?.user?.role) {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10">
      <NewPostForm userRole={session.user.role} />
    </div>
  )
}
