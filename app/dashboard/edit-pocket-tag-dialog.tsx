"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import * as z from "zod/v4"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { PocketTag } from "./dashboard-wrapper"
import { cn } from "@/lib/utils"

import { editPocketTag } from "./edit-pocket-tag.action"
import { deletePocketTag } from "./delete-pocket-tag.action"

const editPocketTagSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "name is required")
})

export type EditPocketTagSchema = z.infer<typeof editPocketTagSchema>

export function EditPocketTagDialog({
  open,
  onOpenChange,
  onEditSuccess,
  onDeleteSuccess,
  pocketTags
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditSuccess: (pocketTag: EditPocketTagSchema) => void
  onDeleteSuccess: (id: string) => void
  pocketTags: PocketTag[]
}) {
  const [editPocketTag, setEditPocketTag] = useState<PocketTag>()

  const handleFormDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditPocketTag(undefined)
    }
  }

  const handleEditPocketTagSuccess = (pocketTag: EditPocketTagSchema) => {
    onEditSuccess(pocketTag)
    setEditPocketTag(undefined)
  }

  const handlePocketTagDelete = (id: string) => {
    onDeleteSuccess(id)
    setEditPocketTag(undefined)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-0">
        <DialogHeader>
          <DialogTitle className="px-4">
            Select a Pocket Tag to Edit
          </DialogTitle>
        </DialogHeader>
        <PocketTagsList selectPocketTag={setEditPocketTag} pocketTags={pocketTags}/>
        <FormDialog 
          open={editPocketTag !== undefined}
          onOpenChange={handleFormDialogOpenChange}
          onSuccess={handleEditPocketTagSuccess}
          onDeleteSuccess={handlePocketTagDelete}
          pocketTags={pocketTags}
          pocketTag={editPocketTag || {
            id: uuidv4(),
            name: ""
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function PocketTagsList({
  selectPocketTag,
  pocketTags
}: {
  selectPocketTag: (pocketTag: PocketTag) => void
  pocketTags: PocketTag[]
}) {
  const [nameFilter, setNameFilter] = useState("")
  const parentRef = useRef(null)

  const filteredPocketTags = useMemo(() => {
    return pocketTags.filter(tag => tag.name.toLowerCase().includes(nameFilter.toLowerCase()))
  }, [pocketTags, nameFilter, open])

  const getItemKey = useCallback(
    (index: number) => filteredPocketTags[index].id, 
    [filteredPocketTags]
  )

  const virtualizer = useVirtualizer({
    count: filteredPocketTags.length,
    getScrollElement: () => parentRef.current,
    getItemKey,
    estimateSize: () => 45,
    paddingStart: 10
  })

  return (
    <>
      <div className="px-4">
        <Input value={nameFilter} onChange={(e => setNameFilter(e.target.value))} />
      </div>
      <div
        ref={parentRef}
        className="h-86 relative w-full overflow-auto mask-b-from-95% mask-t-from-95%"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative"
          }}
        >
          {virtualizer.getVirtualItems().map(virtualItem => (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "45px",
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`
              }}
              className={cn("py-1 border-b hover:bg-accent px-4 flex flex-col justify-center",
                virtualItem.index === 0 && "border-t"
              )}
            >
              <p
                className="transition-all duration-300 text-muted-foreground hover:text-foreground truncate"
                onClick={() => selectPocketTag(filteredPocketTags[virtualItem.index])}
              >
                {filteredPocketTags[virtualItem.index].name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function FormDialog({
  open,
  onOpenChange,
  onSuccess,
  onDeleteSuccess,
  pocketTag,
  pocketTags
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (pocketTag: EditPocketTagSchema) => void
  onDeleteSuccess: (id: string) => void
  pocketTag: PocketTag
  pocketTags: PocketTag[]
}) {
  const [deletePocketTagDialogOpen, setDeletePocketTagDialogOpen] = useState(false)

  const form = useForm<EditPocketTagSchema>({
    resolver: zodResolver(editPocketTagSchema),
    defaultValues: pocketTag
  })

  useEffect(() => {
    form.reset(pocketTag)
  }, [pocketTag, form])

  const onSubmit = (values: EditPocketTagSchema) => {
    if (
      pocketTags.some(tag => (tag.name.toLowerCase() === values.name.toLowerCase() && tag.id !== values.id))
    ) {
      form.setError("name", {
        type: "manual",
        message: `Pocket Tag "${values.name}" already exists`
      })
    } else {
      editPocketTag(values)
      form.reset({
        id: uuidv4(),
        name: ""
      })
      onSuccess(values)
    }
  }

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }

  const handleDeleteSuccess = (id: string) => {
    onDeleteSuccess(id)
    setDeletePocketTagDialogOpen(false)
  }

  return (
    <>
      <DeleteDialog 
        open={deletePocketTagDialogOpen}
        onOpenChange={setDeletePocketTagDialogOpen}
        onSuccess={handleDeleteSuccess}
        id={pocketTag.id}
        name={pocketTag.name}
      />
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Pocket Tag
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
            <div className="flex w-full justify-between">
              <Button 
                variant="destructive" 
                disabled={form.formState.isDirty}
                onClick={() => setDeletePocketTagDialogOpen(true)}
              >
                Delete
              </Button>
              <Button disabled={!form.formState.isDirty}>
                Save
              </Button>
            </div>
          </Form> 
        </DialogContent>
      </Dialog>
    </>
  )
}

function DeleteDialog({
  open,
  onOpenChange,
  onSuccess,
  id,
  name
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (id: string) => void
  id: string
  name: string
}) {
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }

  const handleDelete = () => {
    deletePocketTag(id)
    onSuccess(id)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Pocket Tag
          </DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you would like to delete pocket item{" "}
          <span className="text-destructive">{name}</span>?{" "}
          This action cannot be undone.
        </p>
        <div className="flex gap-x-2 ml-auto">
          <Button 
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}