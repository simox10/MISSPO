"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, ArrowRight, Search, Wind, Sparkles, ShieldCheck } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"
import { Button } from "@/components/ui/button"

function PackCards() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  const packs = [
    {
      ...t.packs.school,
      image: "/service-ecole.jpg",
      imageAlt: "Service MISSPO en milieu scolaire - traitement anti-poux",
      borderColor: "border-misspo-blue-light",
      bgGradient: "from-misspo-blue-pale to-white",
      btnClass: "bg-misspo-blue-dark text-white hover:bg-misspo-blue",
      href: "/contact",
    },
    {
      ...t.packs.home,
      image: "/service-domicile.jpg",
      imageAlt: "Service MISSPO a domicile - traitement anti-poux",
      borderColor: "border-misspo-rose-light",
      bgGradient: "from-misspo-rose-pale to-white",
      btnClass: "bg-misspo-rose-dark text-white hover:bg-misspo-rose",
      href: "/booking",
      popular: true,
    },
  ]

  return (
    <div ref={ref} className="grid gap-8 md:grid-cols-2" dir={dir}>
      {packs.map((pack, index) => (
        <div
          key={pack.title}
          className={`group relative overflow-hidden rounded-3xl border ${pack.borderColor} bg-gradient-to-br ${pack.bgGradient} shadow-sm transition-all duration-500 hover:shadow-xl ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: `${index * 200}ms` }}
        >
          {pack.popular && (
            <div className="absolute right-4 top-4 z-10 rounded-full bg-misspo-rose-dark px-3 py-1 text-xs font-semibold text-white shadow-lg">
              Populaire
            </div>
          )}
          <div className="relative h-56 overflow-hidden">
            <Image
              src={pack.image}
              alt={pack.imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-foreground">{pack.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{pack.subtitle}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {pack.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground/80">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-misspo-blue-pale">
                    <Check className="h-3 w-3 text-misspo-blue-dark" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-5">
              <div>
                <span className="text-xs text-muted-foreground">Tarif</span>
                <p className="text-2xl font-bold text-foreground">{pack.price}</p>
              </div>
              <Link href={pack.href}>
                <Button className={`${pack.btnClass} shadow-md`}>
                  {pack.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProtocolSection() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  const icons = [Search, Wind, Sparkles, ShieldCheck]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-misspo-blue-pale/20" dir={dir} ref={ref}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={`text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold uppercase tracking-wider text-misspo-rose-dark">
            {t.protocol.title}
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-4xl">
            {t.protocol.subtitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {t.protocol.description}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.protocol.steps.map((step, index) => {
            const Icon = icons[index]
            const isRose = index % 2 === 1
            return (
              <div
                key={step.title}
                className={`relative rounded-2xl border p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                  isRose
                    ? "border-misspo-rose-light bg-gradient-to-br from-misspo-rose-pale to-white"
                    : "border-misspo-blue-light bg-gradient-to-br from-misspo-blue-pale to-white"
                } ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${
                  isRose ? "bg-misspo-rose-dark text-white" : "bg-misspo-blue-dark text-white"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`mt-3 inline-block text-xs font-bold ${
                  isRose ? "text-misspo-rose-dark" : "text-misspo-blue-dark"
                }`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>

        <div className={`mt-10 text-center transition-all duration-700 delay-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="mx-auto inline-block rounded-full bg-gradient-to-r from-misspo-rose-pale to-misspo-blue-pale px-6 py-3 text-sm font-semibold text-foreground shadow-sm">
            {t.protocol.message}
          </p>
        </div>
      </div>
    </section>
  )
}

function PricingTable() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  return (
    <section className="py-20 bg-white" dir={dir} ref={ref}>
      <div className="mx-auto max-w-3xl px-4">
        <div className={`text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            {t.pricingTable.title}
          </h2>
        </div>

        <div className={`mt-10 overflow-hidden rounded-2xl border border-misspo-blue-light shadow-sm transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-misspo-rose-dark to-misspo-blue-dark text-white">
                <th className="px-6 py-4 text-start text-sm font-semibold">{t.pricingTable.service}</th>
                <th className="px-6 py-4 text-start text-sm font-semibold">{t.pricingTable.content}</th>
                <th className="px-6 py-4 text-start text-sm font-semibold">{t.pricingTable.price}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-misspo-rose-pale bg-misspo-rose-pale/30">
                <td className="px-6 py-4 text-sm font-semibold text-foreground">{t.packs.school.title}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{t.packs.school.description}</td>
                <td className="px-6 py-4 text-sm font-bold text-misspo-rose-dark">{t.packs.school.price}</td>
              </tr>
              <tr className="bg-misspo-blue-pale/30">
                <td className="px-6 py-4 text-sm font-semibold text-foreground">{t.packs.home.title}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{t.packs.home.description}</td>
                <td className="px-6 py-4 text-sm font-bold text-misspo-blue-dark">{t.packs.home.price}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className={`mt-4 text-center text-sm text-muted-foreground italic transition-all duration-700 delay-400 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {t.pricingTable.note}
        </p>
      </div>
    </section>
  )
}

export default function ServicesPage() {
  const { t, dir } = useLanguage()

  return (
    <div dir={dir}>
      {/* Hero */}
      <section className="bg-gradient-to-br from-misspo-rose-pale via-white to-misspo-blue-pale py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-misspo-blue-dark">
            {t.servicesPreview.title}
          </span>
          <h1 className="mt-2 text-balance text-4xl font-bold text-foreground md:text-5xl">
            {t.servicesPreview.subtitle}
          </h1>
        </div>
      </section>

      {/* Packs */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <PackCards />
        </div>
      </section>

      <ProtocolSection />
      <PricingTable />
    </div>
  )
}
