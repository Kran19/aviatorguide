"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { SafeImage } from "@/components/ui/SafeImage"
import { useBlogTracker } from "@/hooks/useBlogTracker"
import { ExternalLink } from "lucide-react"

interface PostCardItemProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string | null
    content?: string | null
    featuredImage?: string | null
    featuredImageAlt?: string | null
    createdAt: Date | string
    redirectEnabled?: boolean | null
    redirectUrl?: string | null
    categories?: { id: string; name: string }[]
  }
}

export function PostCardItem({ post }: PostCardItemProps) {
  const { trackAndRedirect } = useBlogTracker({ postId: post.id, slug: post.slug })

  const handleClick = (e: React.MouseEvent) => {
    // If redirect is enabled in DB, intercept click and trigger dynamic redirect
    if (post.redirectEnabled && post.redirectUrl) {
      e.preventDefault()
      trackAndRedirect("Read More Card Link", post.redirectUrl)
    }
  }

  const excerptText =
    post.excerpt ||
    (post.content ? post.content.replace(/<[^>]*>?/gm, "").substring(0, 140) + "..." : "Read more about this article...")

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const targetUrl = post.redirectEnabled && post.redirectUrl ? post.redirectUrl : `/blog/${post.slug}`
  const isExternal = !!(post.redirectEnabled && post.redirectUrl)

  return (
    <a
      href={targetUrl}
      onClick={handleClick}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group block h-full cursor-pointer"
    >
      <div className="h-full flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-xl backdrop-blur-xl bg-background/40 hover:bg-background/60 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 group-hover:border-primary/50 relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Featured Image */}
        <div className="w-full h-56 overflow-hidden bg-muted relative">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
          <SafeImage
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            fallbackText={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 flex flex-col">
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="text-xs font-bold text-primary-foreground bg-primary/90 px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm group-hover:bg-primary transition-colors"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h3>

          <p className="text-muted-foreground line-clamp-3 mb-6 flex-1 text-sm md:text-base leading-relaxed">
            {excerptText}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground font-medium pt-4 border-t border-border/50 mt-auto">
            <span>{formattedDate}</span>
            <span className="text-primary font-bold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
              <span>Read more</span>
              {isExternal ? <ExternalLink className="w-4 h-4 ml-0.5" /> : <span>&rarr;</span>}
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}
