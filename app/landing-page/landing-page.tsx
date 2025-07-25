"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { BookHeart, Moon, Sun } from "lucide-react"
import { LuGithub } from "react-icons/lu";

import { Profile } from "./profile";

export function LandingPage() {
  const { setTheme, theme } = useTheme()
  const router = useRouter()

  return (
    <div className="h-dvh bg-gradient-to-br from-bg via-foreground/20 dark:via-foreground/50 to-bg relative overflow-hidden flex justify-center items-center">
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center gap-4 p-6 z-40 backdrop-blur-xs">
        <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-x-2 text-foreground/80 dark:text-foreground"><BookHeart />Pocket</h2>
        <div className="flex items-center gap-x-4">
          <a 
            className="text-foreground/80 dark:text-foreground transition-all duration-300 rounded-md hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/50 p-1"
            href="https://github.com/anthonypiegaro/Pocket"
            target="_blank"
          >
            <LuGithub size={28} />
          </a>
          <div 
            className="text-foreground/80 dark:text-foreground relative flex items-center justify-center transition-all duration-300 rounded-md hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/50 p-1" 
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-7 w-7 scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-7 w-7 scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => {
          const colorIndex = i % 8
          const backgroundColor = [
            "oklch(80% 0.16 300)",
            "oklch(85% 0.14 140)",
            "oklch(85% 0.16 30)",
            "oklch(80% 0.18 20)",
            "oklch(85% 0.18 230 / 0.4)",
            "oklch(95% 0.02 270 / 0.4)",
            "oklch(35% 0.02 270 / 0.5)",
            "oklch(85% 0.15 200 / 0.6)"
          ][colorIndex]
          const borderColor = [
            "oklch(90% 0.26 300)",
            "oklch(95% 0.24 140)",
            "oklch(95% 0.26 30)",
            "oklch(90% 0.28 20)",
            "oklch(95% 0.28 230)",
            "oklch(95% 0.1 270 / 0.4)",
            "oklch(55% 0.1 270 / 0.5)",
            "oklch(95% 0.20 200 / 0.6)"
          ][colorIndex]

          return (
            <div 
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-float-${(i % 4) + 1}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor,
                border: `1px solid ${borderColor}`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          )
        })}
      </div>

      <div className="relative z-10 text-center px-6 max-w-md md:max-w-xl rounded-xl backdrop-blur-xs">
        <h1 className="text-foreground/80 dark:text-foreground text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Keep Track of Your Articles and Videos - 
          By Keeping Them in Your{" "}
          <span
            className="bg-gradient-to-r from-[oklch(60%_0.18_300)] via-[oklch(70%_0.16_231)] to-[oklch(65%_0.14_320)] dark:from-[oklch(85%_0.18_230)] dark:from-[oklch(85%_0.18_230)] dark:to-[oklch(85%_0.14_140)] bg-clip-text text-transparent font-extrabold"
          >
            Pocket
          </span>
        </h1>
        <Profile />
      </div>

      <style jsx>
        {
          `
          @keyframes float-1 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-15px); }
            75% { transform: translateY(-30px) translateX(5px); }
          }
          
          @keyframes float-2 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            33% { transform: translateY(-25px) translateX(-10px); }
            66% { transform: translateY(-5px) translateX(20px); }
          }
          
          @keyframes float-3 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            20% { transform: translateY(-15px) translateX(-20px); }
            40% { transform: translateY(-35px) translateX(0px); }
            60% { transform: translateY(-10px) translateX(15px); }
            80% { transform: translateY(-25px) translateX(-5px); }
          }
          
          @keyframes float-4 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-40px) translateX(-25px); }
          }
          
          .animate-float-1 { animation: float-1 infinite ease-in-out; }
          .animate-float-2 { animation: float-2 infinite ease-in-out; }
          .animate-float-3 { animation: float-3 infinite ease-in-out; }
          .animate-float-4 { animation: float-4 infinite ease-in-out; }
          `
        }
      </style>
    </div>
  )
}