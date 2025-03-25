import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { EventsPreview } from "@/components/events-preview"
import { ResourcesPreview } from "@/components/resources-preview"

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroSection />
      <FeaturesSection />
      <EventsPreview />
      <ResourcesPreview />
    </div>
  )
}

