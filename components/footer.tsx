import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/60 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-accent fill-accent" />
            <span>by</span>
            <Link 
              href="https://thenextlevelsoftware.com/" 
              target="_blank" 
              rel="noreferrer"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Next Level Software
            </Link>
          </div>
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
