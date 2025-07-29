"use client"

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
import { createPocketTag } from "./create-pocket-tag.action"

const createPocketTagSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "name is required")
})

export type CreatePocketTagSchema = z.infer<typeof createPocketTagSchema>

export function CreatePocketTagDialog({
  open,
  onOpenChange,
  onSuccess,
  pocketTags
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (pocketTag: CreatePocketTagSchema) => void
  pocketTags: PocketTag[]
}) {
  const form = useForm<CreatePocketTagSchema>({
    resolver: zodResolver(createPocketTagSchema),
    defaultValues: {
      id: uuidv4(),
      name: ""
    }
  })

  const handleOpenChange = (open: boolean) => {
    form.reset({
      id: uuidv4(),
      name: ""
    })
    onOpenChange(open)
  }

  const onSubmit = (values: CreatePocketTagSchema) => {
    if (
      pocketTags.some(tag => tag.name.toLowerCase() === values.name.toLowerCase())
    ) {
      form.setError("name", {
        type: "manual",
        message: `Pocket Tag ${values.name} already exists`
      })
    } else {
      createPocketTag(values)
      form.reset({
        id: uuidv4(),
        name: ""
      })
      onSuccess(values)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Pocket Tag
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
            <Button className="ml-auto">
              Add Pocket Tag
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}