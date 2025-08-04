"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { pocketItem, pocketTag, pocketItemToPocketTag } from "@/db/schema"
import { auth } from "@/lib/auth"

import { PocketItem } from "./dashboard-wrapper"

export const getPocketItems = async (): Promise<PocketItem[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  const pocketItemData = await db
    .select({
      id: pocketItem.id,
      name: pocketItem.name,
      url: pocketItem.url,
      type: pocketItem.type,
      description: pocketItem.description,
      createdAt: pocketItem.createdAt,
      updatedAt: pocketItem.updatedAt,
      completed: pocketItem.completed,
      pocketTagId: pocketTag.id,
      pocketTagName: pocketTag.name
    })
    .from(pocketItem)
    .leftJoin(pocketItemToPocketTag, eq(pocketItemToPocketTag.pocketItemId, pocketItem.id))
    .leftJoin(pocketTag, eq(pocketTag.id, pocketItemToPocketTag.pocketTagId))
    .where(eq(pocketItem.userId, userId))

  const pocketItems = pocketItemData.reduce((acc, item) => {
    if (!(item.id in acc)) {
      acc[item.id] = {
        id: item.id,
        name: item.name,
        url: item.url,
        type: item.type,
        description: item.description,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        completed: item.completed,
        tags: []
      }
    }

    if (item.pocketTagId !== null && item.pocketTagName !== null) {
      acc[item.id].tags.push({ id: item.pocketTagId, name: item.pocketTagName})
    }

    return acc
  }, {} as Record<string, PocketItem>)

  return Object.values(pocketItems)
}