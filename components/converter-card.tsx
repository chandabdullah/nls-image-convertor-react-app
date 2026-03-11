"use client"

import { useState, useCallback } from "react"
import { Download, Sparkles, ArrowRight, Check, Loader2, X, Archive } from "lucide-react"
import { UploadArea } from "@/components/upload-area"
import { FormatSelector } from "@/components/format-selector"
import { ImagePreview } from "@/components/image-preview"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { convertImageFile, formatFileSize, isHeicFile } from "@/lib/image-conversion"
import { cn } from "@/lib/utils"

interface FilePreview {
  file: File
  previewUrl: string
  sourceFormat: string
}

interface ConvertedFile {
  originalName: string
  blob: Blob
  url: string
}

export function ConverterCard() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<FilePreview[]>([])
  const [targetFormat, setTargetFormat] = useState<string>("png")
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([])
  const [loading, setLoading] = useState(false)
  const [isConverted, setIsConverted] = useState(false)
  const [progress, setProgress] = useState(0)

  // Advanced options (keeping for future use)
  const [quality] = useState<number>(90)
  const [bgColor] = useState<string>("")
  const [removeMetadata] = useState<boolean>(true)
  const [autoRotate] = useState<boolean>(true)

  const isMultiple = files.length > 1

  const handleFiles = useCallback(async (newFiles: File[]) => {
    // Cleanup previous preview URLs
    previews.forEach(p => URL.revokeObjectURL(p.previewUrl))
    convertedFiles.forEach(c => URL.revokeObjectURL(c.url))

    setFiles(newFiles)
    setConvertedFiles([])
    setIsConverted(false)
    setProgress(0)

    // Generate previews for all files
    const newPreviews: FilePreview[] = []
    for (const f of newFiles) {
      const format = f.name.split(".").pop()?.toLowerCase() || ""
      let previewUrl: string

      if (isHeicFile(f)) {
        try {
          const heic2any = (await import("heic2any")).default
          const result = await heic2any({
            blob: f,
            toType: "image/png",
            quality: 1,
          })
          const convertedBlob = Array.isArray(result) ? result[0] : result
          previewUrl = URL.createObjectURL(convertedBlob)
        } catch {
          previewUrl = URL.createObjectURL(f)
        }
      } else {
        previewUrl = URL.createObjectURL(f)
      }

      newPreviews.push({ file: f, previewUrl, sourceFormat: format })
    }

    setPreviews(newPreviews)
  }, [previews, convertedFiles])

  const handleConvert = async () => {
    if (files.length === 0) return
    setLoading(true)
    setIsConverted(false)
    setProgress(0)

    try {
      const results: ConvertedFile[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const blob = await convertImageFile(file, targetFormat, {
          quality,
          bgColor,
          removeMetadata,
          autoRotate,
        })
        
        const url = URL.createObjectURL(blob)
        const baseName = file.name.replace(/\.[^/.]+$/, "")
        results.push({
          originalName: `nls_converted_${baseName}`,
          blob,
          url,
        })
        
        setProgress(Math.round(((i + 1) / files.length) * 100))
      }

      // Cleanup old converted URLs
      convertedFiles.forEach(c => URL.revokeObjectURL(c.url))
      
      setConvertedFiles(results)
      setIsConverted(true)
    } catch (e) {
      console.error("Conversion failed:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadSingle = () => {
    if (convertedFiles.length !== 1) return
    const { url, originalName } = convertedFiles[0]
    const link = document.createElement("a")
    link.href = url
    link.download = `${originalName}.${targetFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadZip = async () => {
    if (convertedFiles.length < 2) return
    
    const JSZip = (await import("jszip")).default
    const zip = new JSZip()

    convertedFiles.forEach(({ originalName, blob }) => {
      zip.file(`${originalName}.${targetFormat}`, blob)
    })

    const zipBlob = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `nls_converted_images.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearFiles = () => {
    previews.forEach(p => URL.revokeObjectURL(p.previewUrl))
    convertedFiles.forEach(c => URL.revokeObjectURL(c.url))
    setFiles([])
    setPreviews([])
    setConvertedFiles([])
    setIsConverted(false)
    setProgress(0)
  }

  const totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0)
  const totalConvertedSize = convertedFiles.reduce((acc, c) => acc + c.blob.size, 0)

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Card */}
      <div className="bg-card border border-border rounded-3xl shadow-xl shadow-primary/5 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Convert Image Format</h2>
                <p className="text-sm text-muted-foreground">
                  Upload images and convert them instantly
                </p>
              </div>
            </div>
            {files.length > 0 && (
              <Button variant="ghost" size="icon" onClick={clearFiles} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Area */}
          <UploadArea onFiles={handleFiles} currentFiles={files} />

          {/* Source Format Badges */}
          {previews.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {isMultiple ? "Formats:" : "Current format:"}
              </span>
              {[...new Set(previews.map(p => p.sourceFormat))].map(format => (
                <Badge key={format} variant="secondary" className="uppercase font-mono">
                  {format}
                </Badge>
              ))}
              <span className="text-sm text-muted-foreground ml-auto">
                Total: {formatFileSize(totalOriginalSize)}
              </span>
            </div>
          )}

          {/* Format Selector */}
          <FormatSelector
            value={targetFormat}
            onChange={setTargetFormat}
            sourceFormat={previews[0]?.sourceFormat || ""}
          />

          {/* Image Previews */}
          {previews.length > 0 && (
            <div className="pt-2">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                {isMultiple ? `Original Images (${previews.length})` : "Original Image Preview"}
              </p>
              {isMultiple ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {previews.map((preview, i) => (
                    <div key={i} className="relative aspect-square rounded-none overflow-hidden bg-muted border border-border">
                      <img
                        src={preview.previewUrl}
                        alt={preview.file.name}
                        className="w-full h-full object-cover rounded-none"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-2 py-1">
                        <p className="text-xs text-foreground truncate">{preview.file.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ImagePreview src={previews[0].previewUrl} alt="Original" />
              )}
            </div>
          )}

          {/* Progress Bar */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Converting...</span>
                <span className="text-foreground font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Convert Button */}
          <Button
            size="lg"
            disabled={files.length === 0 || loading}
            onClick={handleConvert}
            className={cn(
              "w-full h-14 text-base font-semibold rounded-xl transition-all",
              "bg-primary hover:bg-primary/90",
              isConverted && "bg-green-600 hover:bg-green-600"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Converting {isMultiple ? `(${Math.round(progress)}%)` : "..."}
              </>
            ) : isConverted ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                {isMultiple ? `${convertedFiles.length} Images Converted!` : "Converted Successfully!"}
              </>
            ) : (
              <>
                Convert {isMultiple ? `${files.length} Images` : ""} to {targetFormat.toUpperCase()}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Result Section */}
        {convertedFiles.length > 0 && (
          <div className="px-6 pb-6 pt-4 border-t border-border bg-muted/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isMultiple ? `Converted Images (${convertedFiles.length})` : "Converted Image Preview"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total size: {formatFileSize(totalConvertedSize)}
                    {totalConvertedSize < totalOriginalSize && (
                      <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                        ({Math.round((1 - totalConvertedSize / totalOriginalSize) * 100)}% smaller)
                      </span>
                    )}
                    {totalConvertedSize >= totalOriginalSize && (
                      <span className="ml-2 text-muted-foreground">
                        ({Math.round((totalConvertedSize / totalOriginalSize - 1) * 100)}% larger)
                      </span>
                    )}
                  </p>
                </div>
                <Badge className="uppercase font-mono bg-green-600 text-white">{targetFormat}</Badge>
              </div>
              
              {/* Converted Previews */}
              {isMultiple ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {convertedFiles.map((converted, i) => (
                    <div key={i} className="relative aspect-square rounded-none overflow-hidden bg-muted border border-border">
                      <img
                        src={converted.url}
                        alt={converted.originalName}
                        className="w-full h-full object-cover rounded-none"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-2 py-1">
                        <p className="text-xs text-foreground truncate">{converted.originalName}.{targetFormat}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ImagePreview src={convertedFiles[0].url} alt="Converted" />
              )}
              
              {/* Download Button */}
              {isMultiple ? (
                <Button
                  size="lg"
                  onClick={handleDownloadZip}
                  className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Archive className="w-5 h-5 mr-2" />
                  Download All as ZIP
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleDownloadSingle}
                  className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download {targetFormat.toUpperCase()}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
