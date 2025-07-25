import { Suspense } from "react"
import { headers } from "next/headers"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import GoogleAuthButton from "@/components/google-auth-button"

export async function Profile() {
  return (
    <Suspense fallback={<SignInButton />}>
      <ActionButton />
    </Suspense>
  )
}

async function ActionButton() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return <SignInButton />
  }

  return <DashboardButton />
}

function SignInButton() {
  return <GoogleAuthButton />
}

function DashboardButton() {
  return (
    <Button asChild>
      <Link href="/dashboard">Dashboard</Link>
    </Button>
  )
}