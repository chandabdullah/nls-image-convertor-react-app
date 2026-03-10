import { Zap, Shield, Smartphone, FileImage, Settings, Download } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Convert images instantly in your browser. No waiting for uploads or server processing."
  },
  {
    icon: Shield,
    title: "100% Private",
    description: "Your images never leave your device. All processing happens locally in your browser."
  },
  {
    icon: FileImage,
    title: "Multiple Formats",
    description: "Support for PNG, JPG, WebP, GIF, BMP, TIFF, AVIF, and more popular formats."
  },
  {
    icon: Settings,
    title: "Advanced Options",
    description: "Fine-tune quality, set background colors, remove metadata, and more."
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Fully responsive design that works perfectly on desktop, tablet, and mobile."
  },
  {
    icon: Download,
    title: "No Limits",
    description: "Convert as many images as you want. No file size limits, no daily caps."
  }
]

export function FeatureGrid() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Why Choose Our Converter?</h2>
        <p className="text-muted-foreground">Powerful features that make image conversion effortless</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group p-5 rounded-2xl border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
