import { cn } from "@/lib/utils"

export function GradientBackground() {
  return (
    <div className={cn(
      "absolute inset-0 bg-gradient-to-br",
      "from-background via-rose-50 to-stone-50", 
      "dark:from-background dark:via-[oklch(0.16_0.03_60)] dark:to-background animate-gradient-shift")}
    >
      <div className={cn(
        "absolute inset-0 bg-gradient-to-tl",
        "from-background via-indigo-50 to-stone-50",
        "dark:from-background dark:via-[oklch(0.16_0.03_120)] dark:to-background opacity-70 animate-gradient-shift-reverse")} 
      />
      <div className={cn("absolute inset-0 bg-gradient-to-r",
      "from-background via-emerald-50 to-stone-50",
      "dark:from-background dark:via-[oklch(0.16_0.03_180)] dark:to-background opacity-50 animate-gradient-shift-slow")} 
      />
    </div>
  )
}