"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, Shield, Users } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"
import { Parallax } from "react-scroll-parallax"
import { Button } from "@/components/ui/button"

export function MissionSection() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  const highlights = [
    { icon: Heart, label: "Méthode douce" },
    { icon: Shield, label: "100% naturel" },
    { icon: Users, label: "Équipe experte" },
  ]

  return (
    <section className="relative py-20 bg-white overflow-hidden" dir={dir} ref={ref}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side with Parallax */}
          <div className={`relative transition-all duration-700 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <Parallax speed={-10}>
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero-misspo.jpg" // Placeholder - remplacer par image de famille/enfants
                  alt="Notre Mission MISSPO"
                  fill
                  className="object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-misspo-blue-dark/20 via-transparent to-misspo-rose-dark/20" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center justify-around">
                      {highlights.map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-misspo-blue-pale flex items-center justify-center">
                            <item.icon className="h-5 w-5 text-misspo-blue-dark" />
                          </div>
                          <span className="text-xs font-semibold text-foreground">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Parallax>

            {/* Decorative Elements */}
            <Parallax speed={5}>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-misspo-rose-pale rounded-full blur-3xl opacity-50" />
            </Parallax>
            <Parallax speed={-5}>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-misspo-blue-pale rounded-full blur-3xl opacity-50" />
            </Parallax>
          </div>

          {/* Content Side */}
          <div className={`transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <Parallax speed={3}>
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-misspo-blue-dark">
                  {t.mission.title}
                </span>
                <h2 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-4xl leading-tight">
                  {t.mission.subtitle}
                </h2>
                
                <div className="mt-6 space-y-4">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {t.mission.description}
                  </p>
                </div>

                {/* Key Points */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-misspo-blue-pale/50 border border-misspo-blue-light">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <span className="text-lg font-bold text-misspo-blue-dark">30m</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-misspo-blue-dark">Traitement rapide</p>
                      <p className="text-xs text-muted-foreground">30min à 1h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-misspo-rose-pale/50 border border-misspo-rose-light">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <span className="text-lg font-bold text-misspo-rose-dark">1x</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-misspo-rose-dark">Une seule séance</p>
                      <p className="text-xs text-muted-foreground">Efficacité garantie</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/services">
                    <Button
                      size="lg"
                      className="bg-misspo-blue-dark text-white hover:bg-misspo-blue shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                    >
                      {t.mission.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-misspo-rose text-misspo-rose-dark hover:bg-misspo-rose-pale"
                    >
                      Nous Contacter
                    </Button>
                  </Link>
                </div>
              </div>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  )
}
