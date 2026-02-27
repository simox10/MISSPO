"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, ShieldCheck, BadgeCheck, Heart, Leaf } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Parallax } from "react-scroll-parallax"
import { Button } from "@/components/ui/button"
import SplitText from "@/components/ui/SplitText"
import BlurText from "@/components/ui/BlurText"
import { useState, useEffect } from "react"

export function HeroSection() {
  const { t, dir } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true)
  }, [])

  const badges = [
    { icon: ShieldCheck, label: t.badges.guarantee, color: "bg-gradient-to-br from-blue-400/20 via-cyan-300/15 to-transparent text-misspo-blue-dark backdrop-blur-2xl border-[0.3px] border-white shadow-[0_8px_32px_0_rgba(59,159,199,0.4),inset_0_1px_0_0_rgba(255,255,255,0.5),0_0_15px_rgba(255,255,255,0.8)]" },
    { icon: BadgeCheck, label: t.badges.hygiene, color: "bg-gradient-to-br from-pink-400/20 via-rose-300/15 to-transparent text-misspo-rose-dark backdrop-blur-2xl border-[0.3px] border-white shadow-[0_8px_32px_0_rgba(232,119,165,0.4),inset_0_1px_0_0_rgba(255,255,255,0.5),0_0_15px_rgba(255,255,255,0.8)]" },
    { icon: Heart, label: t.badges.team, color: "bg-gradient-to-br from-blue-400/20 via-cyan-300/15 to-transparent text-misspo-blue-dark backdrop-blur-2xl border-[0.3px] border-white shadow-[0_8px_32px_0_0_rgba(59,159,199,0.4),inset_0_1px_0_0_rgba(255,255,255,0.5),0_0_15px_rgba(255,255,255,0.8)]" },
    { icon: Leaf, label: t.badges.method, color: "bg-gradient-to-br from-pink-400/20 via-rose-300/15 to-transparent text-misspo-rose-dark backdrop-blur-2xl border-[0.3px] border-white shadow-[0_8px_32px_0_rgba(232,119,165,0.4),inset_0_1px_0_0_rgba(255,255,255,0.5),0_0_15px_rgba(255,255,255,0.8)]" },
  ]

  return (
    <section className="relative overflow-hidden min-h-[500px] lg:min-h-[550px]" dir={dir}>
      {/* Desktop Version */}
      <div className="hidden lg:block">
        {/* Gradient Overlay - En arrière-plan */}
        <div className="absolute inset-0 bg-gradient-to-r from-misspo-rose-pale/95 via-white/80 to-[#E1EDEC]/95" />
        
        {/* Background Image - Au premier plan avec Parallax */}
        <Parallax speed={-15} className="absolute inset-0">
          <Image
            src="/oncom.png"
            alt="MISSPO - Traitement anti-poux professionnel"
            fill
            className="object-contain"
            style={{ objectPosition: '120% center' }}
            priority
            quality={90}
          />
        </Parallax>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:py-32">
          <div className={`max-w-2xl ${dir === 'rtl' ? 'mr-auto ml-0' : ''}`}>
            {/* Text Content */}
            <Parallax speed={5}>
              <div className={`flex flex-col ${dir === 'rtl' ? 'items-end text-end' : 'items-start text-start'}`}>
                <h1 className="text-balance text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
                  <SplitText
                    text={t.hero.title}
                    className="text-misspo-rose-dark inline-block"
                    delay={0.10}
                    duration={0.6}
                    isVisible={isVisible}
                  />
                  {" "}
                  <span className="block mt-12 text-xl md:text-2xl lg:text-3xl">
                    <BlurText
                      text={t.hero.subtitle2}
                      delay={150}
                      animateBy="words"
                      direction="bottom"
                      tag="span"
                      className="text-black inline"
                    />
                    {" "}
                    <SplitText
                      text={t.hero.antiPoux}
                      tag="span"
                      className="inline text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#3B9FC7] to-[#A8D5E2] bg-clip-text text-transparent"
                      delay={0.08}
                      duration={0.6}
                      isVisible={isVisible}
                    />
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
                  {badges.map((badge, index) => (
                    <Parallax key={badge.label} speed={index * 2} style={{ display: 'inline-block' }}>
                      <div
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium shadow-sm ${badge.color} transition-transform hover:scale-105`}
                      >
                        <badge.icon className="h-3.5 w-3.5" />
                        {badge.label}
                      </div>
                    </Parallax>
                  ))}
                </div>
              </div>
            </Parallax>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden relative min-h-[600px] bg-gradient-to-b from-misspo-rose-pale/50 to-white overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-3 py-6">
          {/* Title - Centered */}
          <h1 className="text-4xl font-bold text-misspo-rose-dark text-center">
            {t.hero.title}
          </h1>

          {/* Subtitle - Centered */}
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-black">
              {t.hero.subtitle2}
            </h2>
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#3B9FC7] to-[#A8D5E2] bg-clip-text text-transparent">
              {t.hero.antiPoux}
            </h2>
          </div>

          {/* Image - Moved up with negative margin and reduced bottom padding */}
          <div className="relative -mt-4 h-[280px] -mb-4">
            <Image
              src="/oncom.png"
              alt="MISSPO"
              fill
              className="object-contain"
              priority
              quality={90}
            />
          </div>

          {/* Description */}
          <p className="mt-2 text-base leading-relaxed text-foreground/90 text-center">
            {t.hero.description}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/booking" className="w-full">
              <Button
                size="lg"
                className="w-full bg-misspo-rose-dark text-white shadow-lg"
              >
                {t.hero.cta}
              </Button>
            </Link>
            <a href="tel:0622945571" className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-white border-misspo-blue text-misspo-blue-dark"
              >
                <Phone className="h-4 w-4" />
                {t.hero.phone}
              </Button>
            </a>
          </div>

          {/* Badges - Horizontal scroll */}
          <div className="mt-8 -mx-3 px-3 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {badges.map((badge) => (
              <div
                key={badge.label}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-medium shadow-sm ${badge.color} snap-center whitespace-nowrap flex-shrink-0`}
              >
                <badge.icon className="h-3 w-3" />
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 -mb-px">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
