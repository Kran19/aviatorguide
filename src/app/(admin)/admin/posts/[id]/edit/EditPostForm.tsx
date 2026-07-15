"use client"

import * as React from "react"
import { updatePost } from "@/app/actions/post"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ImageIcon, Loader2 } from "lucide-react"
import RichTextEditor from "@/components/editor/RichTextEditor"
import { MediaLibraryModal } from "@/components/editor/MediaLibraryModal"
import { toast } from "sonner"

type Post = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  featuredImageAlt: string | null
  playImage: string | null
  playImageAlt: string | null
  status: string
  adminRemarks: string | null
  metaTitle: string | null
  metaDescription: string | null
  focusKeyword: string | null
  categories?: { name: string }[]
}

export default function EditPostForm({ post, userRole, categories }: { post: any, userRole: string, categories: any[] }) {
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()
  const [content, setContent] = React.useState(post.content)
  const [featuredImageUrl, setFeaturedImageUrl] = React.useState(post.featuredImage || "")
  const [playImageUrl, setPlayImageUrl] = React.useState(post.playImage || "")
  
  const updatePostWithId = updatePost.bind(null, post.id)

  return (
    <div className="space-y-8 w-full max-w-none mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full hover:-translate-x-1 transition-transform" asChild>
          <Link href="/admin/posts"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Edit Post</h1>
          <p className="text-muted-foreground mt-2">Update your gaming blog drop.</p>
        </div>
      </div>

      <form action={(formData) => {
        formData.set("content", content)
        formData.set("featuredImage", featuredImageUrl)
        formData.set("playImage", playImageUrl)
        startTransition(async () => {
          try {
            const res = await updatePostWithId(formData)
            if (res?.success) {
              toast.success("Post updated successfully!")
              router.push("/admin/posts")
            } else {
              toast.error(res?.error || "Failed to update post.")
            }
          } catch (error: any) {
            toast.error(error.message || "Failed to update post.")
          }
        })
      }} className="grid gap-8 md:grid-cols-[2fr_1fr]">
        
        {/* Main Content Area */}
        <div className="space-y-8 bg-card p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="space-y-3">
            <label className="text-sm font-semibold" htmlFor="featuredImage">Featured Image (Cover Photo)</label>
            
            {featuredImageUrl ? (
              <div className="relative w-full h-64 rounded-xl overflow-hidden border border-border bg-muted group">
                <img src={featuredImageUrl} alt="Featured" className="w-full h-full object-cover transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button type="button" variant="destructive" size="sm" onClick={() => setFeaturedImageUrl("")}>Remove Image</Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 bg-muted/20">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No featured image selected</p>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  id="featuredImage"
                  name="featuredImage"
                  type="text"
                  placeholder="Image URL or upload via Media Library..."
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <MediaLibraryModal 
                  onInsert={(url) => setFeaturedImageUrl(url)}
                  trigger={
                    <Button type="button" variant="secondary" className="h-11 rounded-xl shrink-0 gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Upload Image
                    </Button>
                  }
                />
              </div>
              <input
                id="featuredImageAlt"
                name="featuredImageAlt"
                type="text"
                defaultValue={post.featuredImageAlt || ""}
                placeholder="Alt text (describe the featured image)..."
                className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold" htmlFor="playImage">Play Image (Top Thumbnail)</label>
            
            {playImageUrl ? (
              <div className="relative w-full h-64 rounded-xl overflow-hidden border border-border bg-muted group">
                <img src={playImageUrl} alt="Play" className="w-full h-full object-cover transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button type="button" variant="destructive" size="sm" onClick={() => setPlayImageUrl("")}>Remove Image</Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 bg-muted/20">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No play image selected</p>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  id="playImage"
                  name="playImage"
                  type="text"
                  placeholder="Image URL or upload via Media Library..."
                  value={playImageUrl}
                  onChange={(e) => setPlayImageUrl(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <MediaLibraryModal 
                  onInsert={(url) => setPlayImageUrl(url)}
                  trigger={
                    <Button type="button" variant="secondary" className="h-11 rounded-xl shrink-0 gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Upload Image
                    </Button>
                  }
                />
              </div>
              <input
                id="playImageAlt"
                name="playImageAlt"
                type="text"
                defaultValue={post.playImageAlt || ""}
                placeholder="Alt text (describe the play image)..."
                className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground/90" htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={post.title}
              className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background"
              required
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground/90" htmlFor="content">Content</label>
            <RichTextEditor 
              content={content} 
              onChange={setContent} 
            />
          </div>
          
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm space-y-5">
            <h3 className="font-bold text-xl border-b pb-2">Publishing</h3>
            
            {userRole === "ADMIN" ? (
              <div className="space-y-3">
                <label className="text-sm font-semibold" htmlFor="status">Status</label>
                <select 
                  name="status" 
                  id="status" 
                  defaultValue={post.status}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:border-primary/50 cursor-pointer"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING_APPROVAL">Pending Approval</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            ) : (
              <div className="space-y-3 bg-muted/50 p-4 rounded-xl">
                <p className="text-sm text-muted-foreground">Current Status: <span className="font-bold text-foreground">{post.status.replace("_", " ")}</span></p>
                <div className="flex items-center space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="submitForApproval"
                    name="submitForApproval"
                    defaultChecked={post.status === "PENDING_APPROVAL"}
                    className="h-5 w-5 rounded border-input text-primary focus:ring-primary cursor-pointer transition-colors"
                  />
                  <label htmlFor="submitForApproval" className="text-sm font-semibold cursor-pointer select-none">
                    Submit for Approval
                  </label>
                </div>
              </div>
            )}
            
            {userRole === "ADMIN" && (
              <div className="space-y-3 pt-2">
                <label className="text-sm font-semibold text-destructive" htmlFor="adminRemarks">Admin Remarks</label>
                <textarea
                  id="adminRemarks"
                  name="adminRemarks"
                  defaultValue={post.adminRemarks || ""}
                  placeholder="Feedback for the author..."
                  className="flex min-h-[80px] w-full rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive resize-y"
                />
              </div>
            )}

            {userRole !== "ADMIN" && post.adminRemarks && (
              <div className="space-y-3 p-4 bg-destructive/10 border border-destructive/30 rounded-xl mt-4">
                <p className="text-sm font-bold text-destructive">Admin Remarks:</p>
                <p className="text-sm text-destructive font-medium">{post.adminRemarks}</p>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full rounded-xl text-md h-12 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 mt-4" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm space-y-5">
            <h3 className="font-bold text-xl border-b pb-2">SEO & Media</h3>
            


            <div className="space-y-3">
              <label className="text-sm font-semibold" htmlFor="slug">URL Slug</label>
              <input
                id="slug"
                name="slug"
                type="text"
                defaultValue={post.slug}
                className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold" htmlFor="metaTitle">Meta Title</label>
              <input
                id="metaTitle"
                name="metaTitle"
                type="text"
                defaultValue={post.metaTitle || ""}
                placeholder="Custom SEO Title..."
                className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold" htmlFor="metaDescription">Meta Description</label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                defaultValue={post.metaDescription || ""}
                placeholder="Custom SEO Description..."
                className="flex min-h-[80px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y"
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50">
              <label className="text-sm font-semibold text-foreground/90" htmlFor="excerpt">Excerpt</label>
              <textarea
                id="excerpt"
                name="excerpt"
                defaultValue={post.excerpt || ""}
                className="flex min-h-[100px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background resize-y"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/90" htmlFor="categoryId">Category</label>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue={post.categories?.[0]?.name || ""}
                className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background cursor-pointer"
              >
                <option value="" disabled>Select a category...</option>
                <option value="Casino game">Casino game</option>
                <option value="Crash game">Crash game</option>
                <option value="Slot game">Slot game</option>
                <option value="Sports game">Sports game</option>
                <option value="Bonuses">Bonuses</option>
                <option value="Payment">Payment</option>
                <option value="Guides">Guides</option>
                <option value="News">News</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/90" htmlFor="tags">Tags (comma separated)</label>
              <input
                id="tags"
                name="tags"
                type="text"
                defaultValue={post.tags?.map((t: any) => t.name).join(", ")}
                placeholder="e.g. eSports, Reviews, Strategy"
                className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/90" htmlFor="focusKeyword">Focus Keyword</label>
              <input
                id="focusKeyword"
                name="focusKeyword"
                type="text"
                defaultValue={post.focusKeyword || ""}
                placeholder="e.g. esports, review"
                className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
