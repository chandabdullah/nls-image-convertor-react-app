"use client"

import Link from "next/link"
import Image from "next/image"
import { Sun, Moon, Mail } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        {/* Left side - NLS Image Converter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground text-sm sm:text-base">NLS Image Converter</span>
        </div>

        {/* Center - Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center group">
          {/* Light mode logo (shown when not dark) */}
          <Image
            src="/images/logo-light.png"
            alt="Next Level Software"
            width={160}
            height={44}
            className="h-8 sm:h-10 w-auto dark:hidden"
            priority
          />
          {/* Dark mode logo (shown when dark) */}
          <Image
            src="/images/logo-dark.png"
            alt="Next Level Software"
            width={160}
            height={44}
            className="h-8 sm:h-10 w-auto hidden dark:block"
            priority
          />
        </Link>
        
        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/contact" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
