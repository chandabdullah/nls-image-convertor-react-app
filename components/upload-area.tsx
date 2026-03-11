"use client"

import { useState, useCallback, DragEvent, ChangeEvent } from "react"
import { CloudUpload, FileImage, Images } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadAreaProps {
  onFiles: (files: File[]) => void
  currentFiles?: File[]
}

const ACCEPTED_FORMATS = [
  "PNG", "JPG", "JPEG", "WEBP", "GIF", "BMP", "TIFF", "AVIF", "HEIC", "HEIF", "ICO", "TGA", "JP2", "SVG"
]

export function UploadArea({ onFiles, currentFiles = [] }: UploadAreaProps) {
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
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith("image/") || 
              file.name.toLowerCase().endsWith(".heic") || 
              file.name.toLowerCase().endsWith(".heif")
    )
    if (files.length > 0) {
      onFiles(files)
    }
  }, [onFiles])

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length > 0) {
      onFiles(files)
    }
    // Reset input so same file can be selected again
    e.target.value = ""
  }, [onFiles])

  const handleClick = () => {
    document.getElementById("file-input")?.click()
  }

  const totalSize = currentFiles.reduce((acc, f) => acc + f.size, 0)
  const hasMultiple = currentFiles.length > 1

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
        currentFiles.length > 0 && "border-primary/40 bg-primary/5"
      )}
    >
      <input
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        className="hidden"
        id="file-input"
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={cn(
          "flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300",
          isDragging || currentFiles.length > 0
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            : "bg-muted text-muted-foreground"
        )}>
          {currentFiles.length > 0 ? (
            hasMultiple ? <Images className="w-8 h-8" /> : <FileImage className="w-8 h-8" />
          ) : (
            <CloudUpload className="w-8 h-8" />
          )}
        </div>
        
        {currentFiles.length > 0 ? (
          <div className="space-y-1">
            {hasMultiple ? (
              <>
                <p className="font-semibold text-foreground">
                  {currentFiles.length} images selected
                </p>
                <p className="text-sm text-muted-foreground">
                  Total: {(totalSize / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="flex flex-wrap justify-center gap-1 mt-2 max-w-md">
                  {currentFiles.slice(0, 3).map((file, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-full truncate max-w-[120px]">
                      {file.name}
                    </span>
                  ))}
                  {currentFiles.length > 3 && (
                    <span className="px-2 py-0.5 text-xs text-muted-foreground">
                      +{currentFiles.length - 3} more
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold text-foreground">{currentFiles[0].name}</p>
                <p className="text-sm text-muted-foreground">
                  {(currentFiles[0].size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            )}
            <p className="text-xs text-primary">Click to change files</p>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                Drag & Drop your images here
              </p>
              <p className="text-muted-foreground">or click to browse (multiple allowed)</p>
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
