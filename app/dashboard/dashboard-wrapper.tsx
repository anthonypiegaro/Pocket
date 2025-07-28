"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { BookHeart, ExternalLink, Eye, EyeOff, FileText, Filter, Plus, Search, Video, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card"
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
import { cn } from "@/lib/utils"

import { CreatePocketItemDialog, PocketItemSchema } from "./create-pocket-item-dialog"
import { DeletePocketItemDialog } from "./delete-pocket-item-dialog"
import { CreatePocketTagDialog, CreatePocketTagSchema } from "./create-pocket-tag-dialog"
import { updatePocketItemCompleted } from "./update-pocket-item-complete.action"

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
  createdAt: Date
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
  const [tags, setTags] = useState<PocketTag[]>(pocketTags)
  const [nameFilter, setNameFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState<Set<PocketItem["type"]>>(new Set(["article", "video"]))
  const [statusFilter, setStatusFilter] = useState<Set<"completed" | "uncompleted">>(new Set(["completed", "uncompleted"]))
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [createPocketItemDialogOpen, setCreatePocketItemDialogOpen] = useState(false)
  const [pocketItemDelete, setPocketItemDelete] = useState<{ id: string, name: string }>({ id: "", name: ""})
  const [createPocketTagDialogOpen, setCreatePocketTagDialogOpen] = useState(false)
  const [showSearchButton, setShowSearchButton] = useState(false)
  const filterBar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = document.getElementById("dashboard-scroll") || window

    const handleScroll = () => {
      if (!filterBar.current) return
      const rect = filterBar.current.getBoundingClientRect()
      setShowSearchButton(rect.top <= 0)
    }

    scrollContainer.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [])

  const indexedPocketTags = useMemo(() => {
    return tags.reduce((acc, tag) => {
      acc[tag.id] = {
        id: tag.id,
        name: tag.name
      }

      return acc
    }, {} as Record<string, PocketTag>)
  }, [tags])

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        if (statusFilter.has("completed") && item.completed) {
          return true
        }
        if (statusFilter.has("uncompleted") && !item.completed) {
          return true
        }

        return false
      })
      .filter(item => typeFilter.has(item.type))
      .filter(item => item.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .filter(item => tagFilter.every(tagId => item.tags.some(itemTag => itemTag.id === tagId)))
  }, [items, nameFilter, tagFilter, statusFilter, typeFilter])

  const handleCreatePocketItemSuccess = (values: PocketItemSchema) => {
    const pocketItem: PocketItem = {
      ...values,
      completed: false,
      createdAt: new Date(),
      tags: values.tags.map(tagId => ({ id: tagId, name: indexedPocketTags[tagId].name }))
    }

    setItems(prev => {
      const newItems = [...prev, pocketItem]

      return newItems
    })

    setCreatePocketItemDialogOpen(false)
  }

  const handlePocketItemCompleteUpdate = ({ id, completed }: { id: string, completed: boolean }) => {
    updatePocketItemCompleted({ id, completed })
    setItems(prev => prev.map(item => {
      if (item.id !== id) {
        return item
      }

      const updatedItem = {...item, completed: completed }

      return updatedItem
    }))
  }

  const openDeletePocketItemDialog = ({ id, name }: { id: string, name: string }) => {
    setPocketItemDelete({ id, name })
  }

  const deletePocketItemDialogOpen = pocketItemDelete.id !== ""

  const handleDeletePocketItemDialogOpenChange = (open: boolean) => {
    if (!open) {
      setPocketItemDelete({ id: "", name: "" })
    }
  }

  const handlePocketItemDeleteSuccess = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
    setPocketItemDelete({ id: "", name: "" })
  }

  const handleCreatePocketTagSuccess = (pocketTag: CreatePocketTagSchema) => {
    setTags(prev => {
      const newTags = [...prev, pocketTag]
      return newTags
    })

    setCreatePocketTagDialogOpen(false)
  }

  return (
    <>
    <CreatePocketItemDialog 
      open={createPocketItemDialogOpen}
      onOpenChange={setCreatePocketItemDialogOpen}
      onSuccess={handleCreatePocketItemSuccess}
      pocketTags={tags}
    />
    <DeletePocketItemDialog 
      open={deletePocketItemDialogOpen}
      onOpenChange={handleDeletePocketItemDialogOpenChange}
      onSuccess={handlePocketItemDeleteSuccess}
      id={pocketItemDelete.id}
      name={pocketItemDelete.name}
    />
    <CreatePocketTagDialog 
      open={createPocketTagDialogOpen}
      onOpenChange={setCreatePocketTagDialogOpen}
      onSuccess={handleCreatePocketTagSuccess}
      pocketTags={tags}
    />
    <div className="container mx-auto px-4 py-6 z-10 relative">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search articles and videos..."
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button className="shrink-0" onClick={() => setCreatePocketItemDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add to Pocket
          </Button>
        </div>

        <div 
          className="sticky top-0 z-40 py-4 flex flex-wrap gap-2 items-center backdrop-blur-sm" 
          ref={filterBar}
        >
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
              <Button variant="outline" className="md:hidden">
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
                  options={tags.map(tag => ({ label: tag.name, value: tag.id }))}
                  onValueChange={setTagFilter}
                  defaultValue={tagFilter}
                  placeholder="Select tags..."
                  maxCount={3}
                />
                <Button 
                  variant="ghost"
                  className="text-muted-foreground px-0 ml-auto"
                  onClick={() => setCreatePocketTagDialogOpen(true)}
                >
                  Add Pocket Tag
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="hidden md:flex gap-2">
            <MultiSelect 
              options={tags.map(tag => ({ label: tag.name, value: tag.id }))}
              onValueChange={setTagFilter}
              defaultValue={tagFilter}
              placeholder="Select tags..."
              maxCount={3}
              className="w-sm max-w-sm"
            />
            <Button className="shrink-0" onClick={() => setCreatePocketTagDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Pocket Tag
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className={cn(
                  "transition-all duration-300 opacity-0 -translate-y-2",
                  showSearchButton && "opacity-100 translate-y-0"
                )}
              >
                Search
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group hover:shadow-md transition-shadow bg-card/60 backdrop-blur-sm border-border/20 gap-y-0 hover:scale-101 transition-all duration-300 max-w-full"
            >
              <CardHeader>
                <div className="flex justify-between items-center max-w-full">
                  <div className="flex items-center gap-1 grow truncate">
                    {item.type === "article" && <FileText className="h-4 w-4 text-red-500"/>}
                    {item.type === "video" && <Video className="h-4 w-4 text-blue-500"/>}
                    <p className="truncate">{item.name}</p>
                  </div>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handlePocketItemCompleteUpdate({ id: item.id, completed: !item.completed })}
                    >
                      {item.completed ? <Eye className="text-green-600 h-4 w-4" /> : <EyeOff className="h-4 w-4"/>}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openDeletePocketItemDialog({ id: item.id, name: item.name })}>
                      <X className="text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col justufy-between grow">
                <div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 break-words">{item.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-muted-foreground">{item.createdAt.toLocaleDateString()}</span>
                  <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {items.length === 0 ? (
                <div>
                  <BookHeart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Your pocket is empty</p>
                  <p className="text-sm">Add your first article or video to get started!</p>
                </div>
              ) : (
                <div>
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No items found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}