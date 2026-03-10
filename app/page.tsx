import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ConverterCard } from "@/components/converter-card"
import { FeatureGrid } from "@/components/feature-grid"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24 pb-12 px-4">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Convert Images
            <span className="text-primary"> Instantly</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Fast, free, and secure image conversion. Transform your images between formats 
            with just a few clicks. No upload limits, no registration required.
          </p>
        </section>

        {/* Converter */}
        <section className="mb-16">
          <ConverterCard />
        </section>

        {/* Features */}
        <section className="max-w-4xl mx-auto">
          <FeatureGrid />
        </section>
      </main>

      <Footer />
    </div>
  )
}
