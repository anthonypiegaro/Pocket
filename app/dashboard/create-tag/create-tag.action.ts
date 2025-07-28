"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { db } from "@/db/db"
import { pocketTag } from "@/db/schema"
import { auth } from "@/lib/auth"

import { CreateTagSchema } from "./create-tag.schema"

export const createTag = async (values: CreateTagSchema) => {
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