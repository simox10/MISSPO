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
      className="relative overflow-hidden py-20"
      style={{
        background: 'linear-gradient(to bottom, white 0%, rgba(232, 119, 165, 0.2) 30%, rgba(59, 159, 199, 0.2) 70%, white 100%)'
      }}
      dir={dir}
      ref={ref}
    >
      {/* Decorative */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-misspo-rose blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-misspo-blue blur-3xl" />
      </div>

      <div className={`relative mx-auto max-w-3xl px-4 text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
          {t.ctaSection.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground leading-relaxed md:text-lg">
          {t.ctaSection.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/booking">
            <Button
              size="lg"
              className="bg-misspo-rose-dark text-white shadow-xl transition-all hover:bg-misspo-rose hover:-translate-y-0.5 hover:shadow-2xl"
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
              className="border-misspo-blue text-misspo-blue-dark hover:bg-misspo-blue-pale bg-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </a>
          <a href="tel:0622945571">
            <Button
              size="lg"
              variant="outline"
              className="border-misspo-blue text-misspo-blue-dark hover:bg-misspo-blue-pale bg-white"
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
