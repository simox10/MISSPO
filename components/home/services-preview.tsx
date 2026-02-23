"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"
import { Parallax } from "react-scroll-parallax"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"

export function ServicesPreview() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()
  const [activeSlide, setActiveSlide] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const packs = [
    {
      ...t.packs.school,
      image: "/service-ecole.jpg",
      imageAlt: "Service MISSPO en milieu scolaire",
      accent: "misspo-blue",
      bgGradient: "from-misspo-blue-pale to-white",
      borderColor: "border-misspo-blue-light",
      btnClass: "bg-misspo-blue-dark text-white hover:bg-misspo-blue",
      badgeClass: "bg-misspo-blue-pale text-misspo-blue-dark",
      href: "/contact",
    },
    {
      ...t.packs.home,
      image: "/service-domicile.jpg",
      imageAlt: "Service MISSPO a domicile",
      accent: "misspo-rose",
      bgGradient: "from-misspo-rose-pale to-white",
      borderColor: "border-misspo-rose-light",
      btnClass: "bg-misspo-rose-dark text-white hover:bg-misspo-rose",
      badgeClass: "bg-misspo-rose-pale text-misspo-rose-dark",
      href: "/booking",
    },
  ]

  // Handle scroll to update active slide
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.offsetWidth
      const newActiveSlide = Math.round(scrollLeft / cardWidth)
      setActiveSlide(newActiveSlide)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-white to-misspo-blue-pale/20" dir={dir} ref={ref}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={`text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold uppercase tracking-wider text-misspo-rose-dark">
            {t.servicesPreview.title}
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-4xl">
            {t.servicesPreview.subtitle}
          </h2>
        </div>

        {/* Pagination Dots - Mobile only */}
        <div className="mt-8 flex justify-center gap-2 md:hidden">
          {packs.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const container = scrollContainerRef.current
                if (container) {
                  container.scrollTo({
                    left: index * container.offsetWidth,
                    behavior: 'smooth'
                  })
                }
              }}
              className={`h-2 rounded-full transition-all ${
                activeSlide === index 
                  ? 'w-8 bg-misspo-rose-dark' 
                  : 'w-2 bg-misspo-rose-dark/30'
              }`}
              aria-label={`Aller au pack ${index + 1}`}
            />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div 
          ref={scrollContainerRef}
          className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {packs.map((pack, index) => (
            <div
              key={pack.title}
              className="min-w-full snap-center"
            >
              <div
                className={`group overflow-hidden rounded-3xl border ${pack.borderColor} bg-gradient-to-br ${pack.bgGradient} shadow-sm transition-all duration-500 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${(index + 1) * 200}ms` }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={pack.image}
                    alt={pack.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: index === 1 ? '80% 70%' : 'center 70%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground">{pack.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{pack.subtitle}</p>

                  {/* Features */}
                  <ul className="mt-4 flex flex-col gap-2">
                    {pack.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                        <Check className="h-4 w-4 shrink-0 text-misspo-blue-dark" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price & Button */}
                  <div className="mt-4 flex flex-col gap-3">
                    {/* Price Row */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tarif</span>
                      <p className="text-xl font-bold text-foreground">{pack.price}</p>
                    </div>
                    {/* Button Row */}
                    <Link href={pack.href} className="w-full">
                      <Button className={`${pack.btnClass} shadow-md transition-all hover:shadow-lg w-full`}>
                        {pack.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="mt-12 hidden gap-8 md:grid md:grid-cols-2">
          {packs.map((pack, index) => (
            <Parallax key={pack.title} speed={index % 2 === 0 ? -3 : 3}>
              <div
                className={`group overflow-hidden rounded-3xl border ${pack.borderColor} bg-gradient-to-br ${pack.bgGradient} shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${(index + 1) * 200}ms` }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={pack.image}
                    alt={pack.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: index === 1 ? '80% 70%' : 'center 70%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground">{pack.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{pack.subtitle}</p>

                  {/* Features */}
                  <ul className="mt-4 flex flex-col gap-2">
                    {pack.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                        <Check className="h-4 w-4 shrink-0 text-misspo-blue-dark" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price & Button */}
                  <div className="mt-4 flex flex-col gap-3">
                    {/* Price Row */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tarif</span>
                      <p className="text-xl font-bold text-foreground">{pack.price}</p>
                    </div>
                    {/* Button Row */}
                    <Link href={pack.href} className="w-full">
                      <Button className={`${pack.btnClass} shadow-md transition-all hover:shadow-lg w-full`}>
                        {pack.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Parallax>
          ))}
        </div>

        <Parallax speed={-2}>
          <div className={`mt-10 text-center transition-all duration-700 delay-500 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <Link href="/services">
              <Button
                variant="outline"
                size="lg"
                className="border-misspo-rose text-misspo-rose-dark hover:bg-misspo-rose-pale"
              >
                {t.servicesPreview.discoverBtn}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Parallax>
      </div>
    </section>
  )
}
