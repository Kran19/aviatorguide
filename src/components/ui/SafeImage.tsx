"use client"

import React, { useState, useEffect } from "react"
import Image, { ImageProps } from "next/image"
import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined
  fallbackSrc?: string
  fallbackText?: string
  containerClassName?: string
}

export function SafeImage({
  src,
  fallbackSrc = "/images/default-blog-banner.svg",
  fallbackText = "Image unavailable",
  alt,
  className,
  containerClassName,
  onError,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(src || null)
  const [hasError, setHasError] = useState<boolean>(!src)

  useEffect(() => {
    setImgSrc(src || null)
    setHasError(!src)
  }, [src])

  if (hasError || !imgSrc) {
    if (fallbackSrc) {
      return (
        <Image
          {...props}
          src={fallbackSrc}
          alt={alt || "Fallback image"}
          className={className}
          onError={() => setHasError(true)}
        />
      )
    }

    return (
      <div 
        className={cn(
          "w-full h-full min-h-[100px] bg-gradient-to-br from-muted/80 via-muted to-muted/50 flex flex-col items-center justify-center p-4 text-center select-none rounded-inherit",
          containerClassName
        )}
      >
        <div className="w-10 h-10 rounded-full bg-background/50 border border-border/40 flex items-center justify-center mb-2 shadow-sm">
          <ImageIcon className="w-5 h-5 text-muted-foreground/70" />
        </div>
        <span className="text-xs font-semibold text-muted-foreground/80 line-clamp-2 px-2">
          {alt || fallbackText}
        </span>
      </div>
    )
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Image"}
      className={className}
      onError={(e) => {
        setHasError(true)
        if (onError) onError(e)
      }}
    />
  )
}
