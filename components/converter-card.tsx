"use client"

import { useState, useCallback } from "react"
import { Download, Sparkles, ArrowRight, Check, Loader2 } from "lucide-react"
import { UploadArea } from "@/components/upload-area"
import { FormatSelector } from "@/components/format-selector"
import { ImagePreview } from "@/components/image-preview"
// import { AdvancedSettings } from "@/components/advanced-settings"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { convertImageFile, formatFileSize, isHeicFile } from "@/lib/image-conversion"
import { cn } from "@/lib/utils"

export function ConverterCard() {
  const [file, setFile] = useState<File | null>(null)
  const [srcUrl, setSrcUrl] = useState<string | null>(null)
  const [sourceFormat, setSourceFormat] = useState<string>("")
  const [targetFormat, setTargetFormat] = useState<string>("png")
  const [conversionUrl, setConversionUrl] = useState<string | null>(null)
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)
  const [loading, setLoading] = useState(false)
  const [isConverted, setIsConverted] = useState(false)

  // Advanced options
  const [quality, setQuality] = useState<number>(90)
  const [bgColor, setBgColor] = useState<string>("")
  const [removeMetadata, setRemoveMetadata] = useState<boolean>(true)
  const [autoRotate, setAutoRotate] = useState<boolean>(true)

  const handleFile = useCallback(async (f: File) => {
    // Cleanup previous URLs
    if (srcUrl) URL.revokeObjectURL(srcUrl)
    if (conversionUrl) URL.revokeObjectURL(conversionUrl)

    setFile(f)
    const format = f.name.split(".").pop()?.toLowerCase() || ""
    setSourceFormat(format)
    
    // Check if file is HEIC/HEIF and convert for preview
    let previewUrl: string
    if (isHeicFile(f)) {
      try {
        // Dynamic import to avoid SSR issues
        const heic2any = (await import("heic2any")).default
        // Convert HEIC to PNG for preview
        const result = await heic2any({
          blob: f,
          toType: "image/png",
          quality: 1,
        })
        const convertedBlob = Array.isArray(result) ? result[0] : result
        previewUrl = URL.createObjectURL(convertedBlob)
      } catch (err) {
        console.error("Failed to convert HEIC for preview:", err)
        // Fallback to original URL (might not display but won't crash)
        previewUrl = URL.createObjectURL(f)
      }
    } else {
      previewUrl = URL.createObjectURL(f)
    }
    
    setSrcUrl(previewUrl)
    setConversionUrl(null)
    setConvertedBlob(null)
    setIsConverted(false)
  }, [srcUrl, conversionUrl])

  const handleConvert = async () => {
    if (!file) return
    setLoading(true)
    setIsConverted(false)

    try {
      const blob = await convertImageFile(file, targetFormat, {
        quality,
        bgColor,
        removeMetadata,
        autoRotate,
      })
      
      if (conversionUrl) URL.revokeObjectURL(conversionUrl)
      
      const url = URL.createObjectURL(blob)
      setConversionUrl(url)
      setConvertedBlob(blob)
      setIsConverted(true)
    } catch (e) {
      console.error("Conversion failed:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!conversionUrl) return
    const link = document.createElement("a")
    link.href = conversionUrl
    link.download = `converted-image.${targetFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Card */}
      <div className="bg-card border border-border rounded-3xl shadow-xl shadow-primary/5 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Convert Image Format</h2>
              <p className="text-sm text-muted-foreground">
                Upload an image and convert it instantly to another format
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Area */}
          <UploadArea onFile={handleFile} currentFile={file} />

          {/* Source Format Badge */}
          {sourceFormat && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Current format:</span>
              <Badge variant="secondary" className="uppercase font-mono">
                {sourceFormat}
              </Badge>
              {file && (
                <span className="text-sm text-muted-foreground">
                  ({formatFileSize(file.size)})
                </span>
              )}
            </div>
          )}

          {/* Format Selector */}
          <FormatSelector
            value={targetFormat}
            onChange={setTargetFormat}
            sourceFormat={sourceFormat}
          />

          {/* Image Preview - Always show original when file is selected */}
          {srcUrl && (
            <div className="pt-2">
              <p className="text-sm font-medium text-muted-foreground mb-3">Original Image Preview</p>
              <ImagePreview src={srcUrl} alt="Original" />
            </div>
          )}

          {/* Convert Button */}
          <Button
            size="lg"
            disabled={!file || loading}
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
                Converting...
              </>
            ) : isConverted ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Converted Successfully!
              </>
            ) : (
              <>
                Convert to {targetFormat.toUpperCase()}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          {/* Advanced Settings - Commented out for now */}
          {/* <AdvancedSettings
            quality={quality}
            setQuality={setQuality}
            bgColor={bgColor}
            setBgColor={setBgColor}
            removeMetadata={removeMetadata}
            setRemoveMetadata={setRemoveMetadata}
            autoRotate={autoRotate}
            setAutoRotate={setAutoRotate}
          /> */}
        </div>

        {/* Result Section - Converted Image Preview */}
        {conversionUrl && (
          <div className="px-6 pb-6 pt-4 border-t border-border bg-muted/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Converted Image Preview</p>
                  {convertedBlob && (
                    <p className="text-xs text-muted-foreground">
                      New size: {formatFileSize(convertedBlob.size)}
                      {file && convertedBlob.size < file.size && (
                        <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                          ({Math.round((1 - convertedBlob.size / file.size) * 100)}% smaller)
                        </span>
                      )}
                      {file && convertedBlob.size >= file.size && (
                        <span className="ml-2 text-muted-foreground">
                          ({Math.round((convertedBlob.size / file.size - 1) * 100)}% larger)
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <Badge className="uppercase font-mono bg-green-600 text-white">{targetFormat}</Badge>
              </div>
              
              <ImagePreview src={conversionUrl} alt="Converted" />
              
              <Button
                size="lg"
                onClick={handleDownload}
                className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Download className="w-5 h-5 mr-2" />
                Download {targetFormat.toUpperCase()}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
