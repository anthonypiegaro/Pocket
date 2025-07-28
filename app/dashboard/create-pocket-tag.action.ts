"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { db } from "@/db/db"
import { pocketTag } from "@/db/schema"
import { auth } from "@/lib/auth"

import { CreatePocketTagSchema } from "./create-pocket-tag-dialog"

export const createPocketTag = async (values: CreatePocketTagSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  await db.insert(pocketTag).values({
    id: values.id,
    name: values.name,
    userId
  })
}