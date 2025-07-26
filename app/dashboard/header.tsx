"use client"

import { useTheme } from "next-themes"
import { BookHeart, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

import { ProfileButton } from "./profile-button"

export function Header() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="w-full flex justify-between items-center gap-4 p-6 z-40 backdrop-blur-xs">
      <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-x-2 text-foreground/80 dark:text-foreground"><BookHeart />Pocket</h2>
      <div className="flex items-center gap-x-4">
        <div
          role="button"
          className="text-foreground/80 dark:text-foreground relative flex items-center justify-center transition-all duration-300 rounded-md hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/50 p-1" 
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-7 w-7 scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-7 w-7 scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </div>
        <ProfileButton />
      </div>
    </div>
  )
}