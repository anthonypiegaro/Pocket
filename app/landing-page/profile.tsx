"use client"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import GoogleAuthButton from "@/components/google-auth-button"

export function Profile() {
  const session = useSession()

  if (session.data?.user) {
    return <DashboardButton />
  }

  return <SignInButton />
}

function SignInButton() {
  return <GoogleAuthButton />
}

function DashboardButton() {
  return (
    <Button
    asChild
    >
      <Link href="/dashboard">Go To Dashboard</Link>
    </Button>
  )
}