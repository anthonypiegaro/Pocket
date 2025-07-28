"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { pocketItem } from "@/db/schema"
import { auth } from "@/lib/auth"

export const deletePocketItem = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  await db.delete(pocketItem).where(and(
    eq(pocketItem.id, id),
    eq(pocketItem.userId, userId)
  ))
}