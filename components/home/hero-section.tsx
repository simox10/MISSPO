"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, ShieldCheck, Sparkles, Heart, Leaf } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const { t, dir } = useLanguage()

  const badges = [
    { icon: ShieldCheck, label: t.badges.guarantee, color: "bg-misspo-blue-pale text-misspo-blue-dark" },
    { icon: Sparkles, label: t.badges.hygiene, color: "bg-misspo-rose-pale text-misspo-rose-dark" },
    { icon: Heart, label: t.badges.team, color: "bg-misspo-blue-pale text-misspo-blue-dark" },
    { icon: Leaf, label: t.badges.method, color: "bg-misspo-rose-pale text-misspo-rose-dark" },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-misspo-rose-pale via-white to-misspo-blue-pale" dir={dir}>
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-8 px-4 py-16 lg:flex-row lg:gap-12 lg:py-24">
        {/* Text Content */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-start">
          <span className="mb-4 inline-block rounded-full bg-misspo-blue-pale px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-misspo-blue-dark">
            Casablanca
          </span>
          <h1 className="text-balance text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            {t.hero.title}{" "}
            <span className="block text-misspo-rose-dark">
              {t.hero.subtitle}
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            {t.hero.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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
                className="border-misspo-blue text-misspo-blue-dark hover:bg-misspo-blue-pale"
              >
                <Phone className="h-4 w-4" />
                {t.hero.phone}
              </Button>
            </a>
          </div>

          {/* Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ${badge.color} transition-transform hover:scale-105`}
              >
                <badge.icon className="h-3.5 w-3.5" />
                {badge.label}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative flex-1">
          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl shadow-2xl lg:max-w-lg">
            <Image
              src="/hero-misspo.jpg"
              alt="MISSPO - Traitement anti-poux professionnel pour enfants"
              width={600}
              height={500}
              className="h-auto w-full object-cover"
              priority
            />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-misspo-blue/30 blur-2xl" />
          <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-misspo-rose-light/40 blur-2xl" />
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
