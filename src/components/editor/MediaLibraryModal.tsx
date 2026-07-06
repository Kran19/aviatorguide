"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"

interface MediaLibraryModalProps {
  onInsert: (url: string) => void
  trigger?: React.ReactNode
}

interface MediaFile {
  name: string
  url: string
}

export function MediaLibraryModal({ onInsert, trigger }: MediaLibraryModalProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [urlInput, setUrlInput] = React.useState("")
  const [tab, setTab] = React.useState<"upload" | "url" | "gallery">("upload")
  const [error, setError] = React.useState("")
  
  const [files, setFiles] = React.useState<MediaFile[]>([])
  const [isLoadingGallery, setIsLoadingGallery] = React.useState(false)

  // Fetch gallery when tab changes to gallery
  React.useEffect(() => {
    if (tab === "gallery" && isOpen) {
      fetchMedia()
    }
  }, [tab, isOpen])

  const fetchMedia = async () => {
    setIsLoadingGallery(true)
    setError("")
    try {
      const res = await fetch("/api/media")
      const data = await res.json()
      if (data.files) {
        setFiles(data.files)
      }
    } catch (err) {
      console.error(err)
      setError("Failed to load media.")
    } finally {
      setIsLoadingGallery(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      
      const data = await res.json()
      if (data.url) {
        onInsert(data.url)
        setIsOpen(false)
      } else {
        setError(data.error || "Upload failed")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred during upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlInsert = (e: React.FormEvent) => {
    e.preventDefault()
    if (urlInput.trim()) {
      onInsert(urlInput.trim())
      setIsOpen(false)
      setUrlInput("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) setError("")
    }}>
      {/* @ts-expect-error */}
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" size="sm" className="gap-2">
            <ImageIcon className="h-4 w-4" /> Add Image
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        
        <div className="flex border-b mb-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${tab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
            onClick={() => setTab("upload")}
          >
            Upload File
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${tab === 'gallery' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
            onClick={() => setTab("gallery")}
          >
            Media Library
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${tab === 'url' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
            onClick={() => setTab("url")}
          >
            Insert URL
          </button>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm font-medium shrink-0 border border-destructive/20">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-[350px] p-1 relative">
          {tab === "upload" && (
            <div className="h-full flex items-center justify-center py-8">
              <div className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors w-full h-full flex flex-col items-center justify-center min-h-[250px]">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={isUploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                  {isUploading ? (
                    <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                  ) : (
                    <Upload className="h-10 w-10 text-muted-foreground" />
                  )}
                  <div>
                    <span className="text-base font-medium block mb-1">
                      {isUploading ? "Uploading..." : "Click to select a file"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Images will be saved to the media library
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {tab === "gallery" && (
            <div className="h-full">
              {isLoadingGallery ? (
                <div className="h-full flex items-center justify-center min-h-[250px]">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : files.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-xl bg-muted/20 min-h-[250px]">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-medium">No media files</h3>
                  <p className="text-muted-foreground mt-1 text-sm mb-4">You haven't uploaded any images yet.</p>
                  <Button variant="outline" onClick={() => setTab("upload")}>Upload Now</Button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {files.map((file) => (
                    <button
                      key={file.name}
                      type="button"
                      onClick={() => {
                        onInsert(file.url)
                        setIsOpen(false)
                      }}
                      className="relative border rounded-lg overflow-hidden bg-muted/30 aspect-square group hover:ring-2 hover:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                    >
                      <Image 
                        src={file.url} 
                        alt={file.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">Insert</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "url" && (
            <form onSubmit={handleUrlInsert} className="py-4">
              <div className="space-y-3">
                <label htmlFor="image-url" className="text-sm font-medium">Image URL</label>
                <div className="flex gap-2">
                  <input
                    id="image-url"
                    type="url"
                    placeholder="https://example.com/image.png"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  />
                  <Button type="submit">Insert</Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
