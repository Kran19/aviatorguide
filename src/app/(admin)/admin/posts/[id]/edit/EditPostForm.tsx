import * as React from "react"
import { updatePost } from "@/app/actions/post"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import RichTextEditor from "@/components/editor/RichTextEditor"

type Post = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  status: string
  adminRemarks: string | null
  metaTitle: string | null
  metaDescription: string | null
  focusKeyword: string | null
}

export default function EditPostForm({ post, userRole }: { post: Post, userRole: string }) {
  const [isPending, startTransition] = React.useTransition()
  const [content, setContent] = React.useState(post.content)
  
  const updatePostWithId = updatePost.bind(null, post.id)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/posts"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
          <p className="text-muted-foreground mt-2">Update your gaming blog post.</p>
        </div>
      </div>

      <form action={(formData) => {
        formData.set("content", content)
        startTransition(() => updatePostWithId(formData))
      }} className="grid gap-6 md:grid-cols-[2fr_1fr]">
        
        {/* Main Content Area */}
        <div className="space-y-6 bg-card p-6 rounded-xl border">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={post.title}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="content">Content</label>
            <RichTextEditor 
              content={content} 
              onChange={setContent} 
              onImageClick={() => {
                // We will open the Media Library modal here
                const url = prompt("Enter Image URL:")
                if (url) {
                  // @ts-ignore
                  window.insertImageIntoEditor?.(url)
                }
              }}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              defaultValue={post.excerpt || ""}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border space-y-4">
            <h3 className="font-semibold text-lg">Publishing</h3>
            
            {userRole === "ADMIN" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="status">Status</label>
                <select 
                  name="status" 
                  id="status" 
                  defaultValue={post.status}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING_APPROVAL">Pending Approval</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Status: <span className="font-semibold text-foreground">{post.status.replace("_", " ")}</span></p>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="submitForApproval"
                    name="submitForApproval"
                    defaultChecked={post.status === "PENDING_APPROVAL"}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="submitForApproval" className="text-sm font-medium leading-none">
                    Submit for Approval
                  </label>
                </div>
              </div>
            )}
            
            {userRole === "ADMIN" && (
              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-destructive" htmlFor="adminRemarks">Admin Remarks</label>
                <textarea
                  id="adminRemarks"
                  name="adminRemarks"
                  defaultValue={post.adminRemarks || ""}
                  placeholder="Feedback for the author..."
                  className="flex min-h-[80px] w-full rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                />
              </div>
            )}

            {userRole !== "ADMIN" && post.adminRemarks && (
              <div className="space-y-2 pt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm font-semibold text-destructive">Admin Remarks:</p>
                <p className="text-sm text-destructive">{post.adminRemarks}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="bg-card p-6 rounded-xl border space-y-4">
            <h3 className="font-semibold text-lg">SEO & Meta</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="slug">Slug</label>
              <input
                id="slug"
                name="slug"
                type="text"
                defaultValue={post.slug}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="metaTitle">Meta Title</label>
              <input
                id="metaTitle"
                name="metaTitle"
                type="text"
                defaultValue={post.metaTitle || ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="metaDescription">Meta Description</label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                defaultValue={post.metaDescription || ""}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="focusKeyword">Focus Keyword</label>
              <input
                id="focusKeyword"
                name="focusKeyword"
                type="text"
                defaultValue={post.focusKeyword || ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="featuredImage">Featured Image URL</label>
              <input
                id="featuredImage"
                name="featuredImage"
                type="url"
                defaultValue={post.featuredImage || ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
