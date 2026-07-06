"use client"

import * as React from "react"
import { updatePost } from "@/app/actions/post"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, ImageIcon } from "lucide-react"
import RichTextEditor from "@/components/editor/RichTextEditor"
import { MediaLibraryModal } from "@/components/editor/MediaLibraryModal"
import Image from "next/image"

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
  const [featuredImageUrl, setFeaturedImageUrl] = React.useState(post.featuredImage || "")
  
  const updatePostWithId = updatePost.bind(null, post.id)

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
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
        startTransition(() => updatePostWithId(formData))
      }} className="grid gap-8 md:grid-cols-[2fr_1fr]">
        
        {/* Main Content Area */}
        <div className="space-y-8 bg-card p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
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
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground/90" htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              defaultValue={post.excerpt || ""}
              className="flex min-h-[100px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background resize-y"
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
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm space-y-5">
            <h3 className="font-bold text-xl border-b pb-2">SEO & Media</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold" htmlFor="featuredImage">Featured Image</label>
              
              {featuredImageUrl && (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border bg-muted group">
                  <Image src={featuredImageUrl} alt="Featured" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  id="featuredImage"
                  name="featuredImage"
                  type="url"
                  placeholder="https://..."
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <MediaLibraryModal 
                  onInsert={(url) => setFeaturedImageUrl(url)}
                  trigger={
                    <Button type="button" variant="outline" size="icon" className="h-11 w-11 rounded-xl shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors" title="Select from Library">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                  }
                />
              </div>
            </div>

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
            
            <div className="space-y-3">
              <label className="text-sm font-semibold" htmlFor="focusKeyword">Focus Keyword</label>
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
