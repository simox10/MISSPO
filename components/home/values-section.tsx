"use client"

import { ShieldCheck, Baby, EyeOff, Zap, Hand } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"
import { useState, useRef, useEffect } from "react"

export function ValuesSection() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()
  const [activeSlide, setActiveSlide] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const values = [
    { icon: ShieldCheck, label: t.values.hygiene },
    { icon: Baby, label: t.values.safety },
    { icon: EyeOff, label: t.values.discretion },
    { icon: Zap, label: t.values.efficiency },
    { icon: Hand, label: t.values.respect },
  ]

  // Handle scroll to update active slide
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const itemWidth = 200 + 32 // min-w-[200px] + gap-8 (32px)
      const newActiveSlide = Math.round(scrollLeft / itemWidth)
      setActiveSlide(newActiveSlide)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="py-20 bg-white" dir={dir} ref={ref}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={`text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold uppercase tracking-wider text-misspo-blue-dark">
            {t.values.title}
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-4xl">
            {t.values.subtitle}
          </h2>
        </div>

        {/* Values - Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="mt-16 max-w-5xl mx-auto">
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden">
            <div 
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {values.map((value, index) => (
                <div
                  key={value.label}
                  className={`flex flex-col items-center gap-4 min-w-[200px] snap-center transition-all duration-700 ${
                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                >
                  {/* Icon */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-misspo-blue-pale text-misspo-blue-dark transition-transform duration-300 hover:scale-110">
                    <value.icon className="h-8 w-8" />
                  </div>
                  
                  {/* Label */}
                  <span className="text-sm font-semibold text-center text-foreground">
                    {value.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="mt-6 flex justify-center gap-2">
              {values.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const container = scrollContainerRef.current
                    if (container) {
                      const itemWidth = 200 + 32 // min-w-[200px] + gap-8
                      container.scrollTo({
                        left: index * itemWidth,
                        behavior: 'smooth'
                      })
                    }
                  }}
                  className={`h-2 rounded-full transition-all ${
                    activeSlide === index 
                      ? 'w-8 bg-misspo-blue-dark' 
                      : 'w-2 bg-misspo-blue-dark/30'
                  }`}
                  aria-label={`Aller à la valeur ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-5 gap-8">
            {values.map((value, index) => (
              <div
                key={value.label}
                className={`flex flex-col items-center gap-4 transition-all duration-700 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-misspo-blue-pale text-misspo-blue-dark transition-transform duration-300 hover:scale-110">
                  <value.icon className="h-8 w-8" />
                </div>
                
                {/* Label */}
                <span className="text-sm font-semibold text-center text-foreground">
                  {value.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
