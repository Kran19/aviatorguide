"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function AdminFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("search") || ""
  const currentSort = searchParams.get("sort") || "newest"

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      params.set("search", e.target.value)
    } else {
      params.delete("search")
    }
    params.set("page", "1") // Reset to page 1 on search
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleSort = (val: string | null) => {
    if (!val) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", val)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts..."
          className="pl-8"
          defaultValue={currentSearch}
          onChange={(e) => {
            // Debounce would be ideal, but for simplicity we'll just handle change
            handleSearch(e)
          }}
        />
      </div>
      <Select defaultValue={currentSort} onValueChange={handleSort}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="status_published">Status: Published</SelectItem>
          <SelectItem value="status_pending">Status: Pending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
