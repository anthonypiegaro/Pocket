"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";

import { CreateTagSchema, createTagSchema } from "./create-tag.schema"
import { PocketTag } from "../dashboard-wrapper";
import { createTag } from "./create-tag.action";

export function CreateTagForm({
  tags,
  onSuccess
}: {
  tags: PocketTag[]
  onSuccess: (values: CreateTagSchema) => void
}) {
  const form = useForm<CreateTagSchema>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      id: uuidv4(),
      name: "",
    }
  })

  const onSubmit = (values: CreateTagSchema) => {
    if (!tags.some(tag => tag.name.trim().toLowerCase() === values.name.trim().toLowerCase())) {
      form.setError("name", {
        type: "manuel",
        message: "Tag is a duplicate name"
      })

      return
    }

    createTag(values)
    form.reset({
      id: uuidv4(),
      name: ""
    })
    onSuccess(values)
  }

  return (
    <Form {...form}>
      <form>
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
      <Button className="ml-auto" onClick={form.handleSubmit(onSubmit)}>
        Create Tag
      </Button>
    </Form>
  )
}