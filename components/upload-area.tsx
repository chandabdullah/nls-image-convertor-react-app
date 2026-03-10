"use client"

import { useState, useCallback, DragEvent, ChangeEvent } from "react"
import { CloudUpload, FileImage } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadAreaProps {
  onFile: (file: File) => void
  currentFile?: File | null
}

const ACCEPTED_FORMATS = [
  "PNG", "JPG", "JPEG", "WEBP", "GIF", "BMP", "TIFF", "AVIF", "HEIC", "HEIF", "ICO", "TGA", "JP2", "SVG"
]

export function UploadArea({ onFile, currentFile }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      onFile(file)
    }
  }, [onFile])

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFile(file)
    }
  }, [onFile])

  const handleClick = () => {
    document.getElementById("file-input")?.click()
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative w-full border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300",
        "hover:border-primary/60 hover:bg-primary/5",
        isDragging 
          ? "border-primary bg-primary/10 scale-[1.02]" 
          : "border-border",
        currentFile && "border-primary/40 bg-primary/5"
      )}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="file-input"
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={cn(
          "flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300",
          isDragging || currentFile
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            : "bg-muted text-muted-foreground"
        )}>
          {currentFile ? (
            <FileImage className="w-8 h-8" />
          ) : (
            <CloudUpload className="w-8 h-8" />
          )}
        </div>
        
        {currentFile ? (
          <div className="space-y-1">
            <p className="font-semibold text-foreground">{currentFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(currentFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-xs text-primary">Click to change file</p>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                Drag & Drop your image here
              </p>
              <p className="text-muted-foreground">or click to browse</p>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 max-w-md">
              {ACCEPTED_FORMATS.slice(0, 8).map((format) => (
                <span 
                  key={format}
                  className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-full"
                >
                  {format}
                </span>
              ))}
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{ACCEPTED_FORMATS.length - 8} more
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
