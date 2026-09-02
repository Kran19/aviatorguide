"use client"

import * as React from "react"
import { createAuthor, updateAuthor, deleteAuthor } from "@/actions/author.actions"
import { Button } from "@/components/ui/button"
import { SafeImage } from "@/components/ui/SafeImage"
import { MediaLibraryModal } from "@/components/editor/MediaLibraryModal"
import { toast } from "sonner"
import {
  UserPlus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  BookOpen,
  User,
  Globe,
  ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react"

interface AuthorItem {
  id: string
  name: string
  slug: string
  designation: string | null
  bio: string | null
  image: string | null
  coverImage: string | null
  expertise: string[]
  socialLinks: any
  createdAt: Date | string
  _count?: {
    posts: number
  }
}

interface AuthorsClientProps {
  initialAuthors: AuthorItem[]
}

export function AuthorsClient({ initialAuthors }: AuthorsClientProps) {
  const [authors, setAuthors] = React.useState<AuthorItem[]>(initialAuthors)
  const [search, setSearch] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingAuthor, setEditingAuthor] = React.useState<AuthorItem | null>(null)
  const [isPending, startTransition] = React.useTransition()

  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    designation: "Gaming Journalist & Analyst",
    bio: "",
    image: "",
    coverImage: "",
    expertise: "",
    twitter: "",
    linkedin: "",
    github: "",
    website: "",
    instagram: "",
    youtube: "",
  })

  const resetForm = () => {
    setEditingAuthor(null)
    setFormData({
      name: "",
      slug: "",
      designation: "Gaming Journalist & Analyst",
      bio: "",
      image: "",
      coverImage: "",
      expertise: "",
      twitter: "",
      linkedin: "",
      github: "",
      website: "",
      instagram: "",
      youtube: "",
    })
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (author: AuthorItem) => {
    setEditingAuthor(author)
    const links = author.socialLinks || {}
    setFormData({
      name: author.name,
      slug: author.slug,
      designation: author.designation || "",
      bio: author.bio || "",
      image: author.image || "",
      coverImage: author.coverImage || "",
      expertise: Array.isArray(author.expertise) ? author.expertise.join(", ") : "",
      twitter: links.twitter || "",
      linkedin: links.linkedin || "",
      github: links.github || "",
      website: links.website || "",
      instagram: links.instagram || "",
      youtube: links.youtube || "",
    })
    setIsModalOpen(true)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setFormData((prev) => ({
      ...prev,
      name: val,
      // Auto-generate slug when creating
      slug: !editingAuthor
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
        : prev.slug,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData()
    form.set("name", formData.name)
    form.set("slug", formData.slug)
    form.set("designation", formData.designation)
    form.set("bio", formData.bio)
    form.set("image", formData.image)
    form.set("coverImage", formData.coverImage)
    form.set("expertise", formData.expertise)
    form.set("twitter", formData.twitter)
    form.set("linkedin", formData.linkedin)
    form.set("github", formData.github)
    form.set("website", formData.website)
    form.set("instagram", formData.instagram)
    form.set("youtube", formData.youtube)

    startTransition(async () => {
      if (editingAuthor) {
        const res = await updateAuthor(editingAuthor.id, form)
        if (res.success && res.data) {
          setAuthors((prev) =>
            prev.map((a) => (a.id === editingAuthor.id ? { ...a, ...res.data } : a))
          )
          toast.success("Author profile updated successfully!")
          setIsModalOpen(false)
          resetForm()
        } else {
          toast.error(res.error || "Failed to update author")
        }
      } else {
        const res = await createAuthor(form)
        if (res.success && res.data) {
          setAuthors((prev) => [res.data, ...prev])
          toast.success("Author profile created successfully!")
          setIsModalOpen(false)
          resetForm()
        } else {
          toast.error(res.error || "Failed to create author")
        }
      }
    })
  }

  const handleDelete = async (author: AuthorItem) => {
    if (!confirm(`Are you sure you want to delete author "${author.name}"? Articles assigned to this author will remain published.`)) {
      return
    }

    startTransition(async () => {
      const res = await deleteAuthor(author.id)
      if (res.success) {
        setAuthors((prev) => prev.filter((a) => a.id !== author.id))
        toast.success(`Author "${author.name}" deleted successfully`)
      } else {
        toast.error(res.error || "Failed to delete author")
      }
    })
  }

  const filteredAuthors = authors.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase()) ||
      (a.designation && a.designation.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <User className="h-8 w-8 text-primary" />
            <span>Author Management</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create and manage public author profiles. Assign them to articles with 1 click in the post editor.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="rounded-xl px-5 h-11 bg-primary text-primary-foreground font-bold shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Author</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search authors by name, role, or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 h-11 rounded-xl border border-border bg-card/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-colors"
        />
      </div>

      {/* Authors Grid */}
      {filteredAuthors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center bg-card/30">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-bold text-foreground">No Authors Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {search
              ? "No authors match your search criteria. Try a different query."
              : "Get started by adding your first author profile for your gaming blog."}
          </p>
          {!search && (
            <Button onClick={openCreateModal} className="mt-5 rounded-xl gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Create First Author</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author) => {
            const links = author.socialLinks || {}
            return (
              <div
                key={author.id}
                className="group relative rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 shrink-0 bg-muted">
                      {author.image ? (
                        <SafeImage
                          src={author.image}
                          alt={author.name}
                          fallbackText={author.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center text-primary font-bold text-lg">
                          {author.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {author.name}
                      </h3>
                      <p className="text-xs font-semibold text-primary/90 truncate mt-0.5">
                        {author.designation || "Author & Contributor"}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-muted px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground">
                          <BookOpen className="h-3 w-3 text-primary" />
                          <span>{author._count?.posts ?? 0} Articles</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {author.bio && (
                    <p className="text-xs text-muted-foreground mt-4 line-clamp-3 leading-relaxed">
                      {author.bio}
                    </p>
                  )}

                  {/* Expertise tags */}
                  {Array.isArray(author.expertise) && author.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {author.expertise.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                      {author.expertise.length > 3 && (
                        <span className="text-[10px] text-muted-foreground py-0.5">
                          +{author.expertise.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/40 text-muted-foreground">
                    {links.twitter && (
                      <a
                        href={links.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-sky-400 transition-colors"
                        title="Twitter / X"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
                    {links.linkedin && (
                      <a
                        href={links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-blue-500 transition-colors"
                        title="LinkedIn"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                      </a>
                    )}
                    {links.github && (
                      <a
                        href={links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground transition-colors"
                        title="GitHub"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                        </svg>
                      </a>
                    )}
                    {links.website && (
                      <a
                        href={links.website}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-emerald-400 transition-colors"
                        title="Website"
                      >
                        <Globe className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {links.instagram && (
                      <a
                        href={links.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-pink-500 transition-colors"
                        title="Instagram"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    )}
                    {links.youtube && (
                      <a
                        href={links.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-red-500 transition-colors"
                        title="YouTube"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-border/40">
                  <a
                    href={`/author/${author.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(author)}
                      className="h-8 px-2.5 rounded-lg text-xs font-semibold hover:bg-primary/10 hover:text-primary gap-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(author)}
                      className="h-8 px-2.5 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit Author Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  {editingAuthor ? "Edit Author Profile" : "Create Author Profile"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground" htmlFor="authorName">
                    Author Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="authorName"
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground" htmlFor="authorSlug">
                    URL Slug <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="authorSlug"
                    type="text"
                    required
                    placeholder="e.g. alex-mercer"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground" htmlFor="authorDesignation">
                  Designation / Role
                </label>
                <input
                  id="authorDesignation"
                  type="text"
                  placeholder="e.g. Senior Gaming Journalist & eSports Analyst"
                  value={formData.designation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, designation: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground" htmlFor="authorBio">
                  Author Biography
                </label>
                <textarea
                  id="authorBio"
                  rows={3}
                  placeholder="Write a concise, engaging biography about this author's gaming experience, credentials, and achievements..."
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                />
              </div>

              {/* Avatar Image Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Author Avatar Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Avatar image URL or upload from media library..."
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    className="flex-1 h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <MediaLibraryModal
                    onInsert={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                    trigger={
                      <Button type="button" variant="secondary" className="h-10 rounded-xl shrink-0 gap-1.5 text-xs font-semibold">
                        <ImageIcon className="h-4 w-4" />
                        <span>Upload / Select</span>
                      </Button>
                    }
                  />
                </div>
                {formData.image && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary mt-2">
                    <img src={formData.image} alt="Avatar preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Cover Banner Image Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Author Profile Banner Cover</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cover banner image URL (optional)..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                    className="flex-1 h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <MediaLibraryModal
                    onInsert={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
                    trigger={
                      <Button type="button" variant="secondary" className="h-10 rounded-xl shrink-0 gap-1.5 text-xs font-semibold">
                        <ImageIcon className="h-4 w-4" />
                        <span>Upload Banner</span>
                      </Button>
                    }
                  />
                </div>
              </div>

              {/* Expertise Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground" htmlFor="authorExpertise">
                  Expertise Tags (Comma separated)
                </label>
                <input
                  id="authorExpertise"
                  type="text"
                  placeholder="e.g. eSports, Crash Games, Slot Reviews, RPGs"
                  value={formData.expertise}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expertise: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Social Profiles */}
              <div className="space-y-3 pt-2 border-t border-border/40">
                <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Social Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">Twitter / X URL</label>
                    <input
                      type="text"
                      placeholder="https://twitter.com/..."
                      value={formData.twitter}
                      onChange={(e) => setFormData((prev) => ({ ...prev, twitter: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">LinkedIn URL</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin}
                      onChange={(e) => setFormData((prev) => ({ ...prev, linkedin: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">Personal Website</label>
                    <input
                      type="text"
                      placeholder="https://author.com"
                      value={formData.website}
                      onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-muted-foreground">Instagram URL</label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={formData.instagram}
                      onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isPending}
                  className="rounded-xl h-10 px-5 text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl h-10 px-6 text-xs font-bold bg-primary text-primary-foreground gap-2"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingAuthor ? "Update Author" : "Create Author"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
