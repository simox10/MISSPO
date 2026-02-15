"use client"

import Link from "next/link"
import { Phone, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-misspo-rose-dark via-misspo-rose to-misspo-blue-dark py-20"
      dir={dir}
      ref={ref}
    >
      {/* Decorative */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-white blur-3xl" />
      </div>

      <div className={`relative mx-auto max-w-3xl px-4 text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h2 className="text-balance text-3xl font-bold text-white md:text-4xl">
          {t.ctaSection.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/80 leading-relaxed md:text-lg">
          {t.ctaSection.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/booking">
            <Button
              size="lg"
              className="bg-white text-misspo-rose-dark shadow-xl transition-all hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              {t.ctaSection.cta}
            </Button>
          </Link>
          <a
            href="https://wa.me/212622945571"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 bg-transparent"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </a>
          <a href="tel:0622945571">
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 bg-transparent"
            >
              <Phone className="h-4 w-4" />
              0622945571
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
