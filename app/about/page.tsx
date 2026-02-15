"use client"

import Image from "next/image"
import { ShieldCheck, Baby, EyeOff, Zap, Hand, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function AboutHero() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  return (
    <section className="bg-gradient-to-br from-misspo-rose-pale via-white to-misspo-blue-pale py-16 lg:py-24" dir={dir} ref={ref}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          {/* Image */}
          <div className={`relative flex-1 transition-all duration-700 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/hero-misspo.jpg"
                alt="Equipe MISSPO - traitement professionnel anti-poux"
                width={500}
                height={400}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
            </div>
            <div className="absolute -bottom-3 -left-3 h-20 w-20 rounded-full bg-misspo-blue/30 blur-2xl" />
            <div className="absolute -right-3 -top-3 h-24 w-24 rounded-full bg-misspo-rose-light/40 blur-2xl" />
          </div>

          {/* Text */}
          <div className={`flex-1 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <span className="text-sm font-semibold uppercase tracking-wider text-misspo-rose-dark">
              MISSPO
            </span>
            <h1 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {t.about.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              {t.about.intro}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t.about.accompany}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ValuesGrid() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  const values = [
    { icon: ShieldCheck, label: t.values.hygiene, desc: "", color: "from-misspo-blue-pale to-white border-misspo-blue-light" },
    { icon: Baby, label: t.values.safety, desc: "", color: "from-misspo-rose-pale to-white border-misspo-rose-light" },
    { icon: EyeOff, label: t.values.discretion, desc: "", color: "from-misspo-blue-pale to-white border-misspo-blue-light" },
    { icon: Zap, label: t.values.efficiency, desc: "", color: "from-misspo-rose-pale to-white border-misspo-rose-light" },
    { icon: Hand, label: t.values.respect, desc: "", color: "from-misspo-blue-pale to-white border-misspo-blue-light" },
  ]

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

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {values.map((value, index) => (
            <div
              key={value.label}
              className={`flex flex-col items-center gap-3 rounded-2xl border bg-gradient-to-br p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${value.color} ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <value.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-foreground">{value.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ApproachSection() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  return (
    <section className="py-20 bg-gradient-to-b from-white to-misspo-blue-pale/20" dir={dir} ref={ref}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <div className={`flex-1 transition-all duration-700 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <span className="text-sm font-semibold uppercase tracking-wider text-misspo-blue-dark">
              MISSPO
            </span>
            <h2 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-4xl">
              {t.about.approachTitle}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              {t.about.approachDescription}
            </p>
          </div>
          <div className={`relative flex-1 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/service-ecole.jpg"
                alt="Approche professionnelle MISSPO - intervention en ecole"
                width={500}
                height={400}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  return (
    <section className="py-20 bg-white" dir={dir} ref={ref}>
      <div className="mx-auto max-w-3xl px-4">
        <div className={`text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold uppercase tracking-wider text-misspo-rose-dark">
            FAQ
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-4xl">
            {t.faq.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{t.faq.subtitle}</p>
        </div>

        <div className={`mt-10 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {t.faq.questions.map((item, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="overflow-hidden rounded-2xl border border-misspo-blue-light bg-gradient-to-br from-misspo-blue-pale/30 to-white px-5 shadow-sm transition-shadow data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="py-4 text-start text-sm font-semibold text-foreground hover:no-underline md:text-base [&[data-state=open]>svg]:rotate-180">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <ValuesGrid />
      <ApproachSection />
      <FaqSection />
    </>
  )
}
