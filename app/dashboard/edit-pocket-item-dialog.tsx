"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SquarePen } from "lucide-react"
import { useForm } from "react-hook-form"
import { v4 as uuidv4} from "uuid"
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
import { MultiSelect } from "@/components/ui/multiselect"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { PocketTag } from "./dashboard-wrapper"
import { editPocketItem } from "./edit-pocket-item.action"

const editPocketItemSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  type: z.literal(["article", "video"]),
  url: z.url().min(1, "url is required"),
  description: z.string().max(5000, "Description can be no longer than 5000 characters"),
  tags: z.array(z.string())
})

export type EditPocketItemSchema = z.infer<typeof editPocketItemSchema>

export function EditPocketItemDialog({
  open,
  onOpenChange,
  onSuccess,
  pocketTags,
  pocketItem
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (pocketItem: EditPocketItemSchema) => void
  pocketTags: PocketTag[],
  pocketItem: EditPocketItemSchema
}) {
  const[editModeOn, setEditModeOn] = useState(false)

  const form = useForm<EditPocketItemSchema>({
    resolver: zodResolver(editPocketItemSchema),
    defaultValues: pocketItem
  })

  useEffect(() => {
    form.reset(pocketItem)
  }, [pocketItem, form])

  const onSubmit = (values: EditPocketItemSchema) => {
    editPocketItem(values)
    setEditModeOn(false) 
    onSuccess(values)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditModeOn(false)
    }
    onOpenChange(open)
  }

  const cancelEdit = () => {
    form.reset(pocketItem)
    setEditModeOn(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editModeOn ? "Edit Pocket Item" : "Pocket Item Details"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <FormField 
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={!editModeOn}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!editModeOn}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!editModeOn}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="resize-none h-34" 
                      placeholder="Provide a short overview..."
                      maxLength={5000}
                      disabled={!editModeOn}
                      {...field} 
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground text-right">
                    {field.value.length} / 5000
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pocket Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={pocketTags.map(tag => ({ label: tag.name, value: tag.id }))}
                      onValueChange={selectedTags => field.onChange(selectedTags)}
                      placeholder="Select Pocket tags..."
                      defaultValue={field.value}
                      maxCount={3}
                      modalPopover
                      className="max-w-sm"
                      disabled={!editModeOn}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          {editModeOn && (
            <div className="flex gap-x-2 ml-auto">
              <Button variant="ghost" onClick={cancelEdit}>Cancel</Button>
              <Button className="ml-auto" onClick={form.handleSubmit(onSubmit)}>Save</Button>
            </div>
          )}
          {!editModeOn && <Button className="ml-auto" size="icon" onClick={() => setEditModeOn(true)}><SquarePen /></Button>}
        </Form>
      </DialogContent>
    </Dialog>
  )
}