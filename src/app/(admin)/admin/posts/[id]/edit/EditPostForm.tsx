"use client"

import * as React from "react"
import { updatePost } from "@/app/actions/post"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type Post = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  published: boolean
}

export default function EditPostForm({ post }: { post: Post }) {
  const [isPending, startTransition] = React.useTransition()
  
  // Create a bound action that includes the post ID
  const updatePostWithId = updatePost.bind(null, post.id)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/posts"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
          <p className="text-muted-foreground mt-2">Update your gaming blog post.</p>
        </div>
      </div>

      <form action={(formData) => startTransition(() => updatePostWithId(formData))} className="space-y-6 bg-card p-6 rounded-xl border">
        <div className="grid gap-4 md:grid-cols-2">
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

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            defaultValue={post.excerpt || ""}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="content">Content (Markdown)</label>
          <textarea
            id="content"
            name="content"
            defaultValue={post.content}
            className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="published"
            name="published"
            defaultChecked={post.published}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="published" className="text-sm font-medium leading-none">
            Published
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild>
            <Link href="/admin/posts">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
