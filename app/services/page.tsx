"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowRight, ChevronRight, Users, Shield, Clock, FileCheck, Home, Heart, MessageCircle, Zap, TrendingUp, Droplet, School, Timer, ArrowDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function PackCards() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  const packs = [
    {
      ...t.packs.school,
      image: "/service-ecole.jpg",
      imageAlt: "Service MISSPO en milieu scolaire",
      borderColor: "border-misspo-blue-light",
      bgGradient: "from-misspo-blue-pale to-white",
      btnClass: "bg-misspo-blue-dark text-white hover:bg-misspo-blue",
      href: "/contact",
    },
    {
      ...t.packs.home,
      image: "/service-domicile.jpg",
      imageAlt: "Service MISSPO a domicile",
      borderColor: "border-misspo-rose-light",
      bgGradient: "from-misspo-rose-pale to-white",
      btnClass: "bg-misspo-rose-dark text-white hover:bg-misspo-rose",
      href: "/booking",
    },
  ]

  return (
    <div ref={ref} className="mt-12 hidden gap-8 md:grid md:grid-cols-2" dir={dir}>
      {packs.map((pack, index) => (
        <div key={pack.title} style={{ willChange: 'transform', transform: `translateY(${index % 2 === 0 ? -1.13856 : 1.13857}px)` }}>
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
        </div>
      ))}
    </div>
  )
}

function TrustIndicators() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()
  const [counts, setCounts] = useState({ children: 0, chemicals: 0, schools: 0, time: 5 })

  const indicators = [
    { icon: TrendingUp, value: "99+", target: 99, label: t.trustIndicators.childrenTreated, type: "children" },
    { icon: Droplet, value: "100%", target: 100, label: t.trustIndicators.noChemicals, type: "chemicals" },
    { icon: School, value: "20+", target: 20, label: t.trustIndicators.schoolPartners, type: "schools" },
    { icon: Timer, value: "<1h", target: 60, label: t.trustIndicators.avgDuration, type: "time" },
  ]

  useEffect(() => {
    if (!isInView) return

    const duration = 2500 // 2.5 seconds for smoother animation
    const frameRate = 1000 / 60 // 60fps
    const totalFrames = Math.round(duration / frameRate)
    let frame = 0

    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4)
    }

    const timer = setInterval(() => {
      frame++
      const progress = easeOutQuart(frame / totalFrames)

      setCounts({
        children: Math.round(progress * 99),
        chemicals: Math.round(progress * 100),
        schools: Math.round(progress * 20),
        time: Math.round(5 + progress * 55), // from 5 to 60
      })

      if (frame >= totalFrames) {
        clearInterval(timer)
        setCounts({ children: 99, chemicals: 100, schools: 20, time: 60 })
      }
    }, frameRate)

    return () => clearInterval(timer)
  }, [isInView])

  const formatValue = (type: string, count: number) => {
    switch(type) {
      case "children":
        return count >= 99 ? "99+" : count.toString()
      case "chemicals":
        return `${count}%`
      case "schools":
        return count >= 20 ? "20+" : count.toString()
      case "time":
        if (count >= 60) return "<1h"
        return `${count}min`
      default:
        return count.toString()
    }
  }

  return (
    <section className="py-12 bg-misspo-blue-pale/30" dir={dir} ref={ref}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {indicators.map((item, index) => {
            const Icon = item.icon
            const count = counts[item.type as keyof typeof counts]
            return (
              <div
                key={item.label}
                className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-misspo-blue-pale mb-3">
                  <Icon className="h-6 w-6 text-misspo-blue-dark" />
                </div>
                <p className="text-3xl font-bold text-foreground">{formatValue(item.type, count)}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ProtocolSection() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  const icons = [Users, Wind, Sparkles, Shield]

  return (
    <section className="py-16 bg-white" dir={dir} ref={ref}>
      <div className="mx-auto max-w-4xl px-4">
        <div className={`text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold uppercase tracking-wider text-misspo-rose-dark">
            {t.protocol.title}
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-4xl">
            {t.protocol.subtitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            {t.protocol.description}
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {t.protocol.steps.map((step, index) => {
            const Icon = icons[index]
            const isRose = index % 2 === 1

            return (
              <div
                key={step.title}
                className={`relative transition-all duration-700 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`rounded-2xl border p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${
                  isRose ? "border-misspo-rose-light" : "border-misspo-blue-light"
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-full ${
                      isRose ? "bg-misspo-rose-dark" : "bg-misspo-blue-dark"
                    }`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-sm font-bold ${
                          isRose ? "text-misspo-rose-dark" : "text-misspo-blue-dark"
                        }`}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
                {index < t.protocol.steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowDown className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className={`mt-12 text-center transition-all duration-700 delay-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="mx-auto inline-block rounded-full bg-gradient-to-r from-misspo-rose-pale to-misspo-blue-pale px-6 py-3 text-sm font-semibold text-foreground shadow-sm">
            {t.protocol.message}
          </p>
        </div>
      </div>
    </section>
  )
}




function Check({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function Wind({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  )
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
    </svg>
  )
}

export default function ServicesPage() {
  const { t, dir } = useLanguage()

  return (
    <div dir={dir}>
      {/* Hero */}
      <section className="bg-gradient-to-br from-misspo-rose-pale via-white to-misspo-blue-pale py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-misspo-blue-dark">
              {t.servicesPreview.title}
            </span>
            <h1 className="mt-2 text-balance text-4xl font-bold text-foreground md:text-5xl">
              {t.servicesPreview.subtitle}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              {t.servicesPreview.description}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-misspo-blue-dark bg-white px-4 py-2 rounded-full shadow-sm">
              <Check className="h-4 w-4" />
              {t.servicesPreview.trustBadge}
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <PackCards />
        </div>
      </section>

      <TrustIndicators />
      <ProtocolSection />
    </div>
  )
}
