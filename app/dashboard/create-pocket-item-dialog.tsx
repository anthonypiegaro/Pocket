"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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

import { createPocketItem } from "./create-pocket-item.action"
import { PocketTag } from "./dashboard-wrapper"

const pocketItemSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  type: z.literal(["article", "video"]),
  url: z.url().min(1, "url is required"),
  description: z.string().max(5000, "Description can be no longer than 5000 characters"),
  tags: z.array(z.string())
})

export type PocketItemSchema = z.infer<typeof pocketItemSchema>

export function CreatePocketItemDialog({
  open,
  onOpenChange,
  onSuccess,
  pocketTags
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (pocketItem: PocketItemSchema) => void
  pocketTags: PocketTag[]
}) {
  const form = useForm<PocketItemSchema>({
    resolver: zodResolver(pocketItemSchema),
    defaultValues: {
      id: uuidv4(),
      name: "",
      type: "article",
      url: "",
      description: "",
      tags: []
    }
  })

  const onSubmit = (values: PocketItemSchema) => {
    createPocketItem(values)
    form.reset({
      id: uuidv4(),
      name: "",
      type: "article",
      url: "",
      description: "",
      tags: []
    })
    onSuccess(values)
  }

  const handleOpenChange = (open: boolean) => {
    form.reset({
      id: uuidv4(),
      name: "",
      type: "article",
      url: "",
      description: "",
      tags: []
    })
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add New Item to Pocket
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
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          <Button className="ml-auto" onClick={form.handleSubmit(onSubmit)}>Add to Pocket</Button>
        </Form>
      </DialogContent>
    </Dialog>
  )
}