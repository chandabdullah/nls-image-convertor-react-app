"use client"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormatSelectorProps {
  value: string
  onChange: (format: string) => void
  sourceFormat?: string
}

const OUTPUT_FORMATS = [
  { value: "png", label: "PNG", description: "Lossless, transparent" },
  { value: "jpg", label: "JPG", description: "Best for photos" },
  { value: "webp", label: "WebP", description: "Modern, smaller size" },
  { value: "gif", label: "GIF", description: "Animated images" },
  { value: "bmp", label: "BMP", description: "Uncompressed" },
  { value: "tiff", label: "TIFF", description: "High quality" },
  { value: "avif", label: "AVIF", description: "Best compression" },
  { value: "ico", label: "ICO", description: "For favicons" },
]

export function FormatSelector({ value, onChange, sourceFormat }: FormatSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Convert To</Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {OUTPUT_FORMATS.map((format) => {
          const isDisabled = sourceFormat?.toLowerCase() === format.value
          const isSelected = value === format.value
          
          return (
            <button
              key={format.value}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(format.value)}
              className={cn(
                "relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200",
                "hover:border-primary/60 hover:bg-primary/5",
                isSelected && "border-primary bg-primary/10 shadow-sm",
                !isSelected && !isDisabled && "border-border bg-card",
                isDisabled && "opacity-40 cursor-not-allowed border-border bg-muted"
              )}
            >
              <span className={cn(
                "font-semibold text-sm",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {format.label}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {format.description}
              </span>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
