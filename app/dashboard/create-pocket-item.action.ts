"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { db } from "@/db/db"
import { pocketItem, pocketItemToPocketTag } from "@/db/schema"
import { auth } from "@/lib/auth"

import { PocketItemSchema } from "./create-pocket-item-dialog"

export const createPocketItem = async (values: PocketItemSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  await db.transaction(async tx => {
    await tx.insert(pocketItem).values({
      id: values.id,
      name: values.name,
      type: values.type,
      description: values.description,
      url: values.url,
      userId
    })

    if (values.tags.length > 0) {
      const tags = values.tags.map(tag => ({
        pocketItemId: values.id,
        pocketTagId: tag
      }))

      await tx.insert(pocketItemToPocketTag).values(tags)
    }
  })
}