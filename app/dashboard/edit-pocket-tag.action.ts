"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { pocketTag } from "@/db/schema"
import { auth } from "@/lib/auth"

import { EditPocketTagSchema } from "./edit-pocket-tag-dialog"

export const editPocketTag = async (values: EditPocketTagSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  await db.update(pocketTag).set({
    name: values.name
  }).where(and(
    eq(pocketTag.id, values.id),
    eq(pocketTag.userId, userId)
  ))
}