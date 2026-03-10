import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
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
