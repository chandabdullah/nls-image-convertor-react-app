export interface ConversionOptions {
  quality?: number
  bgColor?: string
  removeMetadata?: boolean
  autoRotate?: boolean
}

export async function convertImageFile(
  file: File,
  targetFormat: string,
  options: ConversionOptions = {}
): Promise<Blob> {
  const { quality = 100, bgColor = "" } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Fill background for formats that don't support transparency
      if (bgColor && (targetFormat === "jpg" || targetFormat === "jpeg")) {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)

      // Determine MIME type
      const mimeTypes: Record<string, string> = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        webp: "image/webp",
        gif: "image/gif",
        bmp: "image/bmp",
        avif: "image/avif",
        ico: "image/x-icon",
        tiff: "image/tiff",
      }

      const mimeType = mimeTypes[targetFormat.toLowerCase()] || "image/png"
      const qualityValue = quality / 100

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Failed to convert image"))
          }
        },
        mimeType,
        qualityValue
      )
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = URL.createObjectURL(file)
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
