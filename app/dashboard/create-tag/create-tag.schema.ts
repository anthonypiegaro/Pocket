import * as z from "zod/v4"

export const createTagSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name requried"),
})

export type CreateTagSchema = z.infer<typeof createTagSchema>
