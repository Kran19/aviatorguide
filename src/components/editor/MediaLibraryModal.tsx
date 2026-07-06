"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react"

interface MediaLibraryModalProps {
  onInsert: (url: string) => void
  trigger?: React.ReactNode
}

export function MediaLibraryModal({ onInsert, trigger }: MediaLibraryModalProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [urlInput, setUrlInput] = React.useState("")
  const [tab, setTab] = React.useState<"upload" | "url">("upload")

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
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
        alert("Upload failed")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred during upload")
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* @ts-expect-error */}
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" size="sm" className="gap-2">
            <ImageIcon className="h-4 w-4" /> Add Image
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        
        <div className="flex border-b mb-4">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
            onClick={() => setTab("upload")}
          >
            Upload File
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'url' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
            onClick={() => setTab("url")}
          >
            Insert URL
          </button>
        </div>

        {tab === "upload" ? (
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
                disabled={isUploading}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {isUploading ? "Uploading..." : "Click to select a file"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Images will be saved to the media library
                </span>
              </label>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUrlInsert} className="space-y-4 py-4">
            <div className="space-y-2">
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
      </DialogContent>
    </Dialog>
  )
}
