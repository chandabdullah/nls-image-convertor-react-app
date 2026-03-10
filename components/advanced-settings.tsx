"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdvancedSettingsProps {
  quality: number
  setQuality: (q: number) => void
  bgColor: string
  setBgColor: (c: string) => void
  removeMetadata: boolean
  setRemoveMetadata: (v: boolean) => void
  autoRotate: boolean
  setAutoRotate: (v: boolean) => void
}

const PRESET_COLORS = [
  { value: "", label: "None", color: "transparent" },
  { value: "#ffffff", label: "White", color: "#ffffff" },
  { value: "#000000", label: "Black", color: "#000000" },
  { value: "#f3f4f6", label: "Gray", color: "#f3f4f6" },
]

export function AdvancedSettings({
  quality,
  setQuality,
  bgColor,
  setBgColor,
  removeMetadata,
  setRemoveMetadata,
  autoRotate,
  setAutoRotate,
}: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState("#ffffff")

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between px-4 py-3 h-auto rounded-xl border border-border hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Advanced Settings</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </Button>

      {isOpen && (
        <div className="mt-4 p-4 space-y-6 bg-muted/30 rounded-xl border border-border">
          {/* Quality Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Quality</Label>
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {quality}%
              </span>
            </div>
            <Slider
              value={[quality]}
              onValueChange={([v]) => setQuality(v)}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Background Fill (for JPG)</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setBgColor(preset.value)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all",
                    bgColor === preset.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border border-border",
                      preset.value === "" && "bg-[linear-gradient(45deg,_#fff_50%,_#e5e7eb_50%)]"
                    )}
                    style={{ backgroundColor: preset.value || undefined }}
                  />
                  <span className="text-sm">{preset.label}</span>
                </button>
              ))}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-border">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value)
                    setBgColor(e.target.value)
                  }}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-sm">Custom</span>
              </div>
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Remove EXIF Metadata</Label>
                <p className="text-xs text-muted-foreground">Strip location, camera info, etc.</p>
              </div>
              <Switch
                checked={removeMetadata}
                onCheckedChange={setRemoveMetadata}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Auto Rotate</Label>
                <p className="text-xs text-muted-foreground">Fix orientation based on EXIF</p>
              </div>
              <Switch
                checked={autoRotate}
                onCheckedChange={setAutoRotate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
