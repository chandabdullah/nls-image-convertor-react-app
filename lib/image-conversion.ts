export interface ConversionOptions {
  quality?: number
  bgColor?: string
  removeMetadata?: boolean
  autoRotate?: boolean
}

// Check if file is HEIC/HEIF format
export function isHeicFile(file: File): boolean {
  const fileName = file.name.toLowerCase()
  const mimeType = file.type.toLowerCase()
  return (
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif") ||
    mimeType === "image/heic" ||
    mimeType === "image/heif"
  )
}

// Convert HEIC to a standard format (PNG) first - uses dynamic import to avoid SSR issues
async function convertHeicToBlob(file: File): Promise<Blob> {
  // Dynamic import to avoid "window is not defined" error during SSR
  const heic2any = (await import("heic2any")).default
  const result = await heic2any({
    blob: file,
    toType: "image/png",
    quality: 1,
  })
  // heic2any can return a single blob or array of blobs
  return Array.isArray(result) ? result[0] : result
}

export async function convertImageFile(
  file: File,
  targetFormat: string,
  options: ConversionOptions = {}
): Promise<Blob> {
  const { quality = 100, bgColor = "" } = options

  // Handle HEIC/HEIF files - convert to PNG first
  let processedFile: File | Blob = file
  if (isHeicFile(file)) {
    processedFile = await convertHeicToBlob(file)
  }

  // Read the file as a data URL using FileReader (more reliable than blob URLs)
  const dataUrl = await readFileAsDataURL(processedFile)
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        canvas.width = img.naturalWidth || img.width
        canvas.height = img.naturalHeight || img.height
        
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Fill background for formats that don't support transparency
        if (bgColor && (targetFormat === "jpg" || targetFormat === "jpeg")) {
          ctx.fillStyle = bgColor
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        } else if (targetFormat === "jpg" || targetFormat === "jpeg") {
          // JPEG doesn't support transparency, fill with white by default
          ctx.fillStyle = "#FFFFFF"
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
      } catch (err) {
        reject(new Error(`Canvas error: ${err}`))
      }
    }

    img.onerror = (e) => {
      reject(new Error(`Failed to load image: ${e}`))
    }

    img.src = dataUrl
  })
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("Failed to read file as data URL"))
      }
    }
    
    reader.onerror = () => {
      reject(new Error("FileReader error"))
    }
    
    reader.readAsDataURL(file)
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
