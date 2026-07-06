"use client"

import * as React from "react"
import { createPost } from "@/app/actions/post"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import RichTextEditor from "@/components/editor/RichTextEditor"

export default function NewPostForm({ userRole }: { userRole: string }) {
  const [isPending, startTransition] = React.useTransition()
  const [content, setContent] = React.useState("")

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/posts"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
          <p className="text-muted-foreground mt-2">Write a new post for your gaming blog.</p>
        </div>
      </div>

      <form action={(formData) => {
        formData.set("content", content)
        startTransition(() => createPost(formData))
      }} className="grid gap-6 md:grid-cols-[2fr_1fr]">
        
        {/* Main Content Area */}
        <div className="space-y-6 bg-card p-6 rounded-xl border">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
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
                  defaultValue="DRAFT"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">New posts start as <span className="font-semibold text-foreground">DRAFT</span>.</p>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="submitForApproval"
                    name="submitForApproval"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="submitForApproval" className="text-sm font-medium leading-none">
                    Submit for Approval immediately
                  </label>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create Post"}
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
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="metaDescription">Meta Description</label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="focusKeyword">Focus Keyword</label>
              <input
                id="focusKeyword"
                name="focusKeyword"
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="featuredImage">Featured Image URL</label>
              <input
                id="featuredImage"
                name="featuredImage"
                type="url"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
