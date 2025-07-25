import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userName = session.user.name
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {userName}!</p>
    </div>
  )
}