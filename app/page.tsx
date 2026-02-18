"use client"

import { HeroSection } from "@/components/home/hero-section"
import { PresentationSection } from "@/components/home/presentation-section"
import { MissionSection } from "@/components/home/mission-section"
import { TreatmentProcessSection } from "@/components/home/treatment-process-section"
import { ServicesPreview } from "@/components/home/services-preview"
import { ValuesSection } from "@/components/home/values-section"
import { CtaSection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PresentationSection />
      <MissionSection />
      <TreatmentProcessSection />
      <ServicesPreview />
      <ValuesSection />
      <CtaSection />
    </>
  )
}
