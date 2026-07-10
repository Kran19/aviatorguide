"use client"

import * as React from "react"
import { createPost } from "@/app/actions/post"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, ImageIcon, Loader2 } from "lucide-react"
import RichTextEditor from "@/components/editor/RichTextEditor"
import { MediaLibraryModal } from "@/components/editor/MediaLibraryModal"

export default function NewPostForm({ userRole, categories }: { userRole: string, categories: any[] }) {
  const [isPending, startTransition] = React.useTransition()
  const [content, setContent] = React.useState("")
  const [featuredImageUrl, setFeaturedImageUrl] = React.useState("")

  return (
    <div className="space-y-8 w-full max-w-none mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full hover:-translate-x-1 transition-transform" asChild>
          <Link href="/admin/posts"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Create Post</h1>
          <p className="text-muted-foreground mt-2">Write a new drop for your gaming blog.</p>
        </div>
      </div>

      <form action={(formData) => {
        formData.set("content", content)
        formData.set("featuredImage", featuredImageUrl)
        startTransition(() => createPost(formData))
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
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground/90" htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. The Future of eSports..."
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
                  defaultValue="DRAFT"
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:border-primary/50 cursor-pointer"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            ) : (
              <div className="space-y-3 bg-muted/50 p-4 rounded-xl">
                <p className="text-sm text-muted-foreground">New posts start as <span className="font-bold text-foreground">DRAFT</span>.</p>
                <div className="flex items-center space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="submitForApproval"
                    name="submitForApproval"
                    className="h-5 w-5 rounded border-input text-primary focus:ring-primary cursor-pointer transition-colors"
                  />
                  <label htmlFor="submitForApproval" className="text-sm font-semibold cursor-pointer select-none">
                    Submit for Approval
                  </label>
                </div>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full rounded-xl text-md h-12 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : "Create Post"}
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
                placeholder="my-awesome-post"
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
                placeholder="Custom SEO Title..."
                className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold" htmlFor="metaDescription">Meta Description</label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                placeholder="Custom SEO Description..."
                className="flex min-h-[80px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y"
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50">
              <label className="text-sm font-semibold text-foreground/90" htmlFor="excerpt">Excerpt</label>
              <textarea
                id="excerpt"
                name="excerpt"
                className="flex min-h-[100px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background resize-y"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/90" htmlFor="categoryId">Category</label>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue=""
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
