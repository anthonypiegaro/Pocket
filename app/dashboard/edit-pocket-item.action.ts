"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { pocketItem, pocketItemToPocketTag } from "@/db/schema"
import { auth } from "@/lib/auth"

import { EditPocketItemSchema } from "./edit-pocket-item-dialog"

export const editPocketItem = async (values: EditPocketItemSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  await db.transaction(async tx => {
    await tx.update(pocketItem).set({
      name: values.name,
      type: values.type,
      url: values.url,
      description: values.description,
      updatedAt: new Date()
    }).where(and(
      eq(pocketItem.id, values.id),
      eq(pocketItem.userId, userId)
    ))

    await tx.delete(pocketItemToPocketTag).where(and(
      eq(pocketItemToPocketTag.pocketItemId, values.id)
    ))

    if (values.tags.length > 0) {
      const tags = values.tags.map(tagId => ({
        pocketTagId: tagId,
        pocketItemId: values.id
      }))

      await tx.insert(pocketItemToPocketTag).values(tags)
    }
  })
}