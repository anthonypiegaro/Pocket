"use client"

import { useMemo, useState } from "react"
import { Filter, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog"
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multiselect"

export type PocketTag = {
  id: string
  name: string
}

export type PocketItem = {
  id: string
  name: string
  url: string
  type: "article" | "video"
  description: string
  completed: boolean
  tags: PocketTag[]
}

export function DashboardWrapper({
  pocketItems,
  pocketTags
}: {
  pocketItems: PocketItem[]
  pocketTags: PocketTag[]
}) {
  const [items, setItems] = useState<PocketItem[]>(pocketItems)
  const [nameFilter, setNameFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState<Set<PocketItem["type"]>>(new Set(["article", "video"]))
  const [statusFilter, setStatusFilter] = useState<Set<"completed" | "uncompleted">>(new Set(["completed", "uncompleted"]))
  const [tagFilter, setTagFilter] = useState<string[]>([])

  const filteredItems = useMemo(() => {
    return items
      .filter(item => item.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .filter(item => tagFilter.every(tagId => item.tags.some(itemTag => itemTag.id === tagId)))
  }, [items, nameFilter, tagFilter])

  return (
    <div className="container mx-auto px-4 py-6 z-10 relative">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search articles and videos..."
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="h-4 w-4" />
                Add to Pocket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Item</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Type</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem 
                checked={typeFilter.has("article")}
                onCheckedChange={selected => {
                  if (selected) {
                    setTypeFilter(prev => {
                      const set = new Set(prev)
                      set.add("article")
                      return set
                    })
                  } else {
                    setTypeFilter(prev => {
                      const set = new Set(prev)
                      set.delete("article")
                      return set
                    })
                  }
                }}
              >
                Article
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={typeFilter.has("video")}
                onCheckedChange={selected => {
                  if (selected) {
                    setTypeFilter(prev => {
                      const set = new Set(prev)
                      set.add("video")
                      return set
                    })
                  } else {
                    setTypeFilter(prev => {
                      const set = new Set(prev)
                      set.delete("video")
                      return set
                    })
                  }
                }}
              >
                Video
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={statusFilter.has("completed")}
                onCheckedChange={selected => {
                  if (selected) {
                    setStatusFilter(prev => {
                      const set = new Set(prev)
                      set.add("completed")
                      return set
                    })
                  } else {
                    setStatusFilter(prev => {
                      const set = new Set(prev)
                      set.delete("completed")
                      return set
                    })
                  }
                }}
              >
                Completed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.has("uncompleted")}
                onCheckedChange={selected => {
                  if (selected) {
                    setStatusFilter(prev => {
                      const set = new Set(prev)
                      set.add("uncompleted")
                      return set
                    })
                  } else {
                    setStatusFilter(prev => {
                      const set = new Set(prev)
                      set.delete("uncompleted")
                      return set
                    })
                  }
                }}
              >
                Uncompleted
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="sm:hidden">
                Tags
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Tag Filter
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap gap-2">
                <MultiSelect 
                  options={pocketTags.map(tag => ({ label: tag.name, value: tag.id }))}
                  onValueChange={setTagFilter}
                  defaultValue={tagFilter}
                  placeholder="Select tags..."
                  maxCount={3}
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="shrink-0">
                      <Plus className="h-4 w-4" />
                      Add Pocket Tag
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Tag</DialogTitle>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </DialogContent>
          </Dialog>
          <div className="hidden sm:block flex gap-2">
            <MultiSelect 
              options={pocketTags.map(tag => ({ label: tag.name, value: tag.id }))}
              onValueChange={setTagFilter}
              defaultValue={tagFilter}
              placeholder="Select tags..."
              maxCount={3}
              className="w-sm max-w-sm"
            />
            <Dialog>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="h-4 w-4" />
                Add Pocket Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Tag</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          </div>
        </div>


      </div>
    </div>
  )
}