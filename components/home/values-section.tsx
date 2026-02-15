"use client"

import { ShieldCheck, Baby, EyeOff, Zap, Hand } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"

export function ValuesSection() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  const values = [
    { icon: ShieldCheck, label: t.values.hygiene, color: "bg-misspo-blue-pale text-misspo-blue-dark" },
    { icon: Baby, label: t.values.safety, color: "bg-misspo-rose-pale text-misspo-rose-dark" },
    { icon: EyeOff, label: t.values.discretion, color: "bg-misspo-blue-pale text-misspo-blue-dark" },
    { icon: Zap, label: t.values.efficiency, color: "bg-misspo-rose-pale text-misspo-rose-dark" },
    { icon: Hand, label: t.values.respect, color: "bg-misspo-blue-pale text-misspo-blue-dark" },
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

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {values.map((value, index) => (
            <div
              key={value.label}
              className={`flex items-center gap-3 rounded-2xl border border-transparent px-6 py-4 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md ${value.color} ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-sm">
                <value.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold">{value.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
