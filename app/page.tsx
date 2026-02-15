"use client"

import { HeroSection } from "@/components/home/hero-section"
import { PresentationSection } from "@/components/home/presentation-section"
import { ServicesPreview } from "@/components/home/services-preview"
import { ValuesSection } from "@/components/home/values-section"
import { CtaSection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PresentationSection />
      <ServicesPreview />
      <ValuesSection />
      <CtaSection />
    </>
  )
}
