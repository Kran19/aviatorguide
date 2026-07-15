"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateUser } from "@/actions/user.actions"
import { Edit2 } from "lucide-react"

export default function EditUserModal({ user }: { user: any }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError("")
    try {
      await updateUser(user.id, formData)
      setOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to update user")
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" size="sm" className="gap-2">
          <Edit2 className="h-4 w-4" />
          Edit
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" required defaultValue={user.name || ""} placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required defaultValue={user.email} placeholder="john@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password (Leave blank to keep current)</Label>
              <Input id="password" name="password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={user.status || "ACTIVE"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue={user.role}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUTHOR">Author (Can write posts)</SelectItem>
                <SelectItem value="ADMIN">Admin (Full access)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2">
            <Label>Permissions (For Authors)</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="perm_publish" name="permissions" value="CAN_PUBLISH_POSTS" defaultChecked={user.permissions?.includes("CAN_PUBLISH_POSTS")} className="rounded border-gray-300" />
                <label htmlFor="perm_publish" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Can Publish Posts Directly
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="perm_category" name="permissions" value="CAN_MANAGE_CATEGORIES" defaultChecked={user.permissions?.includes("CAN_MANAGE_CATEGORIES")} className="rounded border-gray-300" />
                <label htmlFor="perm_category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Can Manage Categories
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
