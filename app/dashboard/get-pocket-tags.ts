"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { pocketTag } from "@/db/schema"
import { auth } from "@/lib/auth"

import { PocketTag } from "./dashboard-wrapper"

export const getPocketTags = async (): Promise<PocketTag[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  const pocketTags = await db
    .select({ id: pocketTag.id, name: pocketTag.name })
    .from(pocketTag)
    .where(eq(pocketTag.userId, userId))
  
  const sortedPocketTags = pocketTags.sort((a, b) => {
    return a.name.toLowerCase().localeCompare(
      b.name.toLocaleLowerCase()
    )
  })

  return pocketTags
}