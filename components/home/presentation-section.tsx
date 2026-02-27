"use client"

import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"

export function PresentationSection() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  return (
    <section className="py-5 md:py-20 bg-white overflow-hidden" dir={dir} ref={ref}>
      <div className="mx-auto max-w-7xl px-3 md:px-4">
        <div className={`text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            {t.presentation.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t.presentation.description}
          </p>
        </div>
      </div>
    </section>
  )
}
