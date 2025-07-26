"use client"

import { User } from "lucide-react"

export function ProfileButton() {
  return (
    <div
      role="button"
      className="text-foreground/80 dark:text-foreground relative flex items-center justify-center transition-all duration-300 rounded-md hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/50 p-1"
    >
      <User className="w-7 h-7" />
    </div>
  )
}