"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Trash2, Copy, Image as ImageIcon, Check } from "lucide-react"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MediaFile {
  name: string
  url: string
  size: number
  createdAt: string
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [copiedUrl, setCopiedUrl] = useState("")
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)

  const fetchMedia = async () => {
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

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
        fetchMedia()
      } else {
        setError(data.error || "Upload failed.")
      }
    } catch (err) {
      setError("An error occurred during upload.")
    } finally {
      setIsUploading(false)
    }
  }

  const confirmDelete = async () => {
    if (!fileToDelete) return
    const filename = fileToDelete
    setFileToDelete(null)

    try {
      const res = await fetch(`/api/media?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      })
      if (res.ok) {
        fetchMedia()
      } else {
        setError("Failed to delete image.")
      }
    } catch (err) {
      setError("An error occurred during deletion.")
    }
  }

  const copyToClipboard = (url: string) => {
    const fullUrl = window.location.origin + url
    navigator.clipboard.writeText(fullUrl)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(""), 2000)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage your uploaded images and assets.
          </p>
        </div>
        <div>
          <label className="cursor-pointer">
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleUpload} 
              disabled={isUploading}
            />
            <div className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload File"}
            </div>
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm font-medium border border-destructive/20">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-xl bg-muted/20">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-medium">No media files</h3>
          <p className="text-muted-foreground mt-1">Upload an image to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file) => (
            <div key={file.name} className="group relative border rounded-lg overflow-hidden bg-muted/30 aspect-square">
              <Image 
                src={file.url} 
                alt={file.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => copyToClipboard(file.url)}
                    className="p-1.5 bg-white/20 hover:bg-white/40 rounded-md text-white backdrop-blur-sm transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === file.url ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button 
                    onClick={() => setFileToDelete(file.name)}
                    className="p-1.5 bg-destructive/80 hover:bg-destructive rounded-md text-white backdrop-blur-sm transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="text-xs text-white/90 truncate font-medium">{file.name}</p>
                  <p className="text-[10px] text-white/70">{formatBytes(file.size)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image from the server.
              Any blog posts using this image will have broken links!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Image
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
