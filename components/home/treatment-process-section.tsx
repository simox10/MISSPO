"use client"

import Image from "next/image"
import { Sparkles, Droplet, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useRef, useState } from "react"
import SplitText from "@/components/ui/SplitText"

export function TreatmentProcessSection() {
  const { t, dir } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const steps = [
    {
      number: 1,
      icon: Sparkles,
      title: t.treatmentProcess.step1.title,
      description: t.treatmentProcess.step1.description,
      image: "/traite1.jpg",
      color: "misspo-blue",
      textColor: "text-misspo-blue-dark",
      bgColor: "bg-misspo-blue-dark",
    },
    {
      number: 2,
      icon: Droplet,
      title: t.treatmentProcess.step2.title,
      description: t.treatmentProcess.step2.description,
      image: "/traite2.jpg",
      color: "misspo-rose",
      textColor: "text-misspo-rose-dark",
      bgColor: "bg-misspo-rose-dark",
    },
    {
      number: 3,
      icon: CheckCircle2,
      title: t.treatmentProcess.step3.title,
      description: t.treatmentProcess.step3.description,
      image: "/traite3.jpg",
      color: "misspo-blue",
      textColor: "text-misspo-blue-dark",
      bgColor: "bg-misspo-blue-dark",
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const containerHeight = container.offsetHeight
      const windowHeight = window.innerHeight

      // Calculate how much of the container has been scrolled through
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        // We're in the sticky zone
        const progress = Math.abs(rect.top) / (containerHeight - windowHeight)
        setScrollProgress(Math.min(progress, 1))
      } else if (rect.top > 0) {
        // Before the section
        setScrollProgress(0)
      } else {
        // After the section
        setScrollProgress(1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate which step should be visible based on scroll progress
  const getStepProgress = (index: number) => {
    const stepStart = index / steps.length
    const stepEnd = (index + 1) / steps.length
    
    if (scrollProgress < stepStart) return 0
    if (scrollProgress >= stepEnd) return 1
    
    return (scrollProgress - stepStart) / (stepEnd - stepStart)
  }

  return (
    <div ref={containerRef} style={{ height: '400vh' }} dir={dir}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-b from-white to-gray-50">
        {/* Fixed Header */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-20 pb-8 bg-gradient-to-b from-white to-transparent">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t.treatmentProcess.title}
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.treatmentProcess.subtitle}
              </p>
              <br />
            </div>
          </div>
        </div>

        {/* Stacking Cards */}
        <div className="absolute inset-0 flex items-center justify-center px-4 pt-32">
          <div className="relative w-full max-w-4xl" style={{ height: '70vh', maxHeight: '600px' }}>
            {steps.map((step, index) => (
              <TreatmentCard 
                key={step.number} 
                step={step} 
                index={index}
                progress={getStepProgress(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


function TreatmentCard({ step, index, progress }: { step: any; index: number; progress: number }) {
  const [isHovered, setIsHovered] = useState(false)

  // Calculate opacity and transform based on progress
  const opacity = Math.min(progress * 2, 1)
  const translateY = (1 - Math.min(progress * 1.5, 1)) * 100
  const scale = 0.9 + (Math.min(progress, 1) * 0.1)

  // Calculate fade for description
  const descriptionOpacity = Math.min(progress * 1.5, 1)

  return (
    <div
      className="absolute inset-0"
      style={{ 
        zIndex: 10 + index,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden h-full">
        {/* Image Background */}
        <div className="absolute inset-0">
          <Image
            src={step.image}
            alt={step.title}
            fill
            className="object-cover"
            quality={75}
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
          {/* Title with SplitText Animation */}
          <div className="mb-6 px-4">
            <SplitText
              text={step.title}
              className="text-2xl md:text-4xl font-bold text-center text-white break-words"
              delay={0.03}
              duration={0.5}
              isVisible={progress > 0.1}
            />
          </div>

          {/* Description with simple fade */}
          <p
            className="text-base md:text-lg text-center text-white leading-relaxed max-w-md transition-opacity duration-700"
            style={{ opacity: descriptionOpacity }}
          >
            {step.description}
          </p>

          {/* Number Badge - Bottom Right */}
          <div
            className={`absolute bottom-8 right-8 w-14 h-14 rounded-full ${step.bgColor} shadow-lg flex items-center justify-center transition-all duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          >
            <span className="text-2xl font-bold text-white">{step.number}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

