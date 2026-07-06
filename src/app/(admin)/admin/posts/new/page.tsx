"use client"

import * as React from "react"
import { createPost } from "@/app/actions/post"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewPostPage() {
  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/posts"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
          <p className="text-muted-foreground mt-2">Write a new post for your gaming blog.</p>
        </div>
      </div>

      <form action={(formData) => startTransition(() => createPost(formData))} className="space-y-6 bg-card p-6 rounded-xl border">
        <div className="grid gap-4 md:grid-cols-2">
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
            <label className="text-sm font-medium" htmlFor="slug">Slug</label>
            <input
              id="slug"
              name="slug"
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
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

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="content">Content (Markdown)</label>
          <textarea
            id="content"
            name="content"
            className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="published"
            name="published"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="published" className="text-sm font-medium leading-none">
            Publish immediately
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild>
            <Link href="/admin/posts">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  )
}
