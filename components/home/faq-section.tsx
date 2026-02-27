"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"
import { useState, useEffect } from "react"
import { getFaqsPreview, type FAQ } from "@/lib/api/faqs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export function FaqSection() {
  const { t, dir, language } = useLanguage()
  const { ref, isInView } = useInView()
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFaqs() {
      setLoading(true)
      const data = await getFaqsPreview(language)
      setFaqs(data)
      setLoading(false)
    }
    loadFaqs()
  }, [language])

  return (
    <section className="py-16 bg-white overflow-hidden" dir={dir} ref={ref}>
      <div className="mx-auto max-w-3xl px-3 md:px-4">
        <div className={`text-center mb-10 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            {t.faqPreview.title}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : (
          <div className={`transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  value={`item-${index}`}
                  className="border-b"
                >
                  <AccordionTrigger className="text-left text-base font-semibold">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        <div className={`mt-8 text-center transition-all duration-700 delay-400 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <Link href="/about#faq">
            <Button variant="outline" className="gap-2">
              {t.faqPreview.seeAll}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
