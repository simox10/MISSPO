"use client"

import Image from "next/image"
import { ShieldCheck, Baby, EyeOff, Zap, Hand, Plus, Minus } from "lucide-react"
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
    <section className="bg-gradient-to-br from-misspo-rose-pale via-white to-misspo-blue-pale py-10 lg:py-16" dir={dir} ref={ref}>
      <div className="mx-auto max-w-7xl px-4">  
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          {/* Image */}
          <div className={`relative flex-1 transition-all duration-700 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/hero-misspo.jpg"
                alt="Equipe MISSPO - traitement professionnel anti-poux"
                width={600}
                height={700}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
            </div>
            <div className="absolute -bottom-3 -left-3 h-20 w-20 rounded-full bg-misspo-blue/30 blur-2xl" />
            <div className="absolute -right-3 -top-3 h-24 w-24 rounded-full bg-misspo-rose-light/40 blur-2xl" />
          </div>

          {/* Text */}
          <div className={`flex-1 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <span className="text-lg font-extrabold uppercase tracking-wider text-misspo-rose-dark md:text-xl">
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
    { 
      icon: ShieldCheck, 
      label: t.values.hygiene, 
      color: "from-misspo-rose to-misspo-rose-dark",
      description: t.values.hygieneDesc
    },
    { 
      icon: Baby, 
      label: t.values.safety, 
      color: "from-misspo-blue to-misspo-blue-dark",
      description: t.values.safetyDesc
    },
    { 
      icon: EyeOff, 
      label: t.values.discretion, 
      color: "from-misspo-rose-dark to-misspo-rose",
      description: t.values.discretionDesc
    },
    { 
      icon: Zap, 
      label: t.values.efficiency, 
      color: "from-misspo-blue-dark to-misspo-blue",
      description: t.values.efficiencyDesc
    },
    { 
      icon: Hand, 
      label: t.values.respect, 
      color: "from-misspo-rose to-misspo-blue",
      description: t.values.respectDesc
    },
  ]

  return (
    <section className="py-20 bg-white" dir={dir} ref={ref}>
      <div className="mx-auto max-w-4xl px-4">
        <div className={`text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-base md:text-lg font-extrabold uppercase tracking-wider text-misspo-blue-dark" style={{ fontWeight: 900 }}>
            {t.values.title}
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-4xl">
            {t.values.subtitle}
          </h2>
        </div>

        <div className="relative mt-16 space-y-6">
          {/* Ligne verticale */}
          <div className="absolute left-8 top-0 h-full w-1 bg-gradient-to-b from-misspo-rose via-misspo-blue to-misspo-rose rounded-full" />
          
          {values.map((value, index) => (
            <div
              key={value.label}
              className={`relative flex items-start gap-6 pl-20 transition-all duration-700 ${
                isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              {/* Icône circulaire */}
              <div className={`absolute left-0 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br ${value.color} shadow-xl transition-transform duration-500 hover:scale-125 hover:rotate-12`}>
                <value.icon className="h-7 w-7 text-white" />
              </div>
              
              {/* Carte avec effet flip */}
              <div className="group flex-1 h-24" style={{ perspective: '1000px' }}>
                <div className="relative h-full w-full transition-transform duration-700" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(0deg)' }}>
                  {/* Face avant */}
                  <div 
                    className="absolute inset-0 rounded-2xl border border-misspo-blue-light bg-white p-4 shadow-md flex flex-col items-center justify-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left group-hover:opacity-0 transition-opacity duration-700"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                      <span className="text-xs sm:text-base font-bold uppercase tracking-wider text-misspo-blue-dark">
                        {t.values.valueLabel} {index + 1}
                      </span>
                      <h3 className="text-base md:text-lg font-bold text-foreground">
                        {value.label}
                      </h3>
                    </div>
                    <span className="text-xs text-muted-foreground italic mt-2 sm:mt-0 hidden sm:block">
                      {t.values.hoverText}
                    </span>
                  </div>
                  
                  {/* Face arrière */}
                  <div 
                    className="absolute inset-0 rounded-2xl border border-misspo-rose-light bg-gradient-to-br from-misspo-rose-pale to-misspo-blue-pale p-4 shadow-md flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <p className="text-sm text-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
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
            <span className={`inline-block text-base font-extrabold uppercase tracking-wider text-misspo-blue-dark transition-all duration-700 ${isInView ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-50 translate-y-8"}`} style={{ fontWeight: 900 }}>
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
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl md:text-2xl font-extrabold uppercase tracking-wider text-misspo-rose-dark" style={{ fontWeight: 900 }}>
              FAQ
            </span>
            <span className="inline-block text-2xl md:text-3xl font-bold text-misspo-blue-dark animate-bounce">
              ?
            </span>
          </div>
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
                <AccordionTrigger className="py-4 text-start text-sm font-semibold text-foreground hover:no-underline md:text-base">
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
