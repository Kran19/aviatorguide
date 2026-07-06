"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/actions/profile.actions"
import { Save } from "lucide-react"

export default function ProfileForm({ initialName, email }: { initialName: string, email: string }) {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setMessage("")
    try {
      await updateProfile(formData)
      setMessage("Profile updated successfully!")
    } catch (err: any) {
      setMessage(err.message || "Failed to update profile")
    } finally {
      setPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {message && (
        <div className={`text-sm p-3 rounded-md ${message.includes("success") ? "bg-green-500/15 text-green-500" : "bg-destructive/15 text-destructive"}`}>
          {message}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input id="name" name="name" required defaultValue={initialName} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">New Password (Optional)</Label>
        <Input id="password" name="password" type="password" placeholder="Leave blank to keep current" />
      </div>
      
      <Button type="submit" disabled={pending} className="gap-2">
        <Save className="h-4 w-4" />
        {pending ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}
