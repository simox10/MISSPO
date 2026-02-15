"use client"

import { School, Home, Users, Wrench } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"

export function PresentationSection() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  const features = [
    { icon: School, label: t.presentation.school, color: "bg-misspo-blue-pale text-misspo-blue-dark border-misspo-blue-light" },
    { icon: Home, label: t.presentation.home, color: "bg-misspo-rose-pale text-misspo-rose-dark border-misspo-rose-light" },
    { icon: Users, label: t.presentation.trainedTeam, color: "bg-misspo-blue-pale text-misspo-blue-dark border-misspo-blue-light" },
    { icon: Wrench, label: t.presentation.proEquipment, color: "bg-misspo-rose-pale text-misspo-rose-dark border-misspo-rose-light" },
  ]

  return (
    <section className="py-20 bg-white" dir={dir} ref={ref}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={`text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            {t.presentation.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t.presentation.description}
          </p>
        </div>

        <div className={`mt-6 text-center transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-sm font-semibold uppercase tracking-wider text-misspo-blue-dark">
            {t.presentation.weIntervene}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.label}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${feature.color} ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 shadow-sm">
                <feature.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold">{feature.label}</span>
            </div>
          ))}
        </div>

        <div className={`mt-10 text-center transition-all duration-700 delay-500 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="mx-auto max-w-xl rounded-2xl bg-gradient-to-r from-misspo-rose-pale to-misspo-blue-pale px-6 py-4 text-sm font-medium text-foreground leading-relaxed">
            {t.presentation.keyMessage}
          </p>
        </div>
      </div>
    </section>
  )
}
