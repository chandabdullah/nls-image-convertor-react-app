"use client"

import { useState } from "react"
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  src: string
  alt?: string
  className?: string
}

export function ImagePreview({ src, alt = "Preview", className }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5))
  const handleRotate = () => setRotation((r) => (r + 90) % 360)

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative overflow-hidden rounded-xl bg-muted/50 border border-border">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_#e5e7eb_25%,_transparent_25%,_transparent_50%,_#e5e7eb_50%,_#e5e7eb_75%,_transparent_75%,_transparent)] bg-[length:16px_16px] dark:bg-[linear-gradient(45deg,_#374151_25%,_transparent_25%,_transparent_50%,_#374151_50%,_#374151_75%,_transparent_75%,_transparent)]" />
        <div className="relative flex items-center justify-center min-h-[200px] max-h-[400px] p-4 overflow-auto">
          <img
            src={src}
            alt={alt}
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: "transform 0.2s ease-out"
            }}
            className="max-w-full max-h-[360px] object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="rounded-lg"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="rounded-lg"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        <Button
          variant="outline"
          size="sm"
          onClick={handleRotate}
          className="rounded-lg"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
