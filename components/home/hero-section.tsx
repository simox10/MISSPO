"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, ShieldCheck, Sparkles, Heart, Leaf } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const { t, dir } = useLanguage()

  const badges = [
    { icon: ShieldCheck, label: t.badges.guarantee, color: "bg-white/90 text-misspo-blue-dark backdrop-blur-sm" },
    { icon: Sparkles, label: t.badges.hygiene, color: "bg-white/90 text-misspo-rose-dark backdrop-blur-sm" },
    { icon: Heart, label: t.badges.team, color: "bg-white/90 text-misspo-blue-dark backdrop-blur-sm" },
    { icon: Leaf, label: t.badges.method, color: "bg-white/90 text-misspo-rose-dark backdrop-blur-sm" },
  ]

  return (
    <section className="relative overflow-hidden min-h-[500px] lg:min-h-[550px]" dir={dir}>
      {/* Gradient Overlay - En arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-r from-misspo-rose-pale/95 via-white/80 to-[#E1EDEC]/95" />
      
      {/* Background Image - Au premier plan */}
      <div className="absolute inset-0">
        <Image
          src="/b.png"
          alt="MISSPO - Traitement anti-poux professionnel"
          fill
          className="object-contain"
          style={{ objectPosition: '120% center' }}
          priority
          quality={90}
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="max-w-2xl">
          {/* Text Content */}
          <div className="flex flex-col items-start text-start">
            <span className="mb-4 inline-block rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-misspo-blue-dark shadow-sm">
              Casablanca
            </span>
            <h1 className="text-balance text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              {t.hero.title}{" "}
              <span className="block text-misspo-rose-dark mt-2">
                {t.hero.subtitle}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/90 md:text-lg font-medium">
              {t.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-misspo-rose-dark text-white shadow-lg transition-all hover:bg-misspo-rose hover:shadow-xl hover:-translate-y-0.5"
                >
                  {t.hero.cta}
                </Button>
              </Link>
              <a href="tel:0622945571">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm border-misspo-blue text-misspo-blue-dark hover:bg-white shadow-md"
                >
                  <Phone className="h-4 w-4" />
                  {t.hero.phone}
                </Button>
              </a>
            </div>

            {/* Badges */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium shadow-sm ${badge.color} transition-transform hover:scale-105`}
                >
                  <badge.icon className="h-3.5 w-3.5" />
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
