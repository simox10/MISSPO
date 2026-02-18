"use client"

import Image from "next/image"
import { Sparkles, Droplet, CheckCircle2, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"
import { Parallax } from "react-scroll-parallax"

export function TreatmentProcessSection() {
  const { t, dir } = useLanguage()

  const steps = [
    {
      number: 1,
      icon: Sparkles,
      title: t.treatmentProcess.step1.title,
      description: t.treatmentProcess.step1.description,
      image: "/service-ecole.jpg", // Placeholder
      color: "misspo-blue",
      textColor: "text-misspo-blue-dark",
      bgColor: "bg-misspo-blue-dark",
    },
    {
      number: 2,
      icon: Droplet,
      title: t.treatmentProcess.step2.title,
      description: t.treatmentProcess.step2.description,
      image: "/service-domicile.jpg", // Placeholder
      color: "misspo-rose",
      textColor: "text-misspo-rose-dark",
      bgColor: "bg-misspo-rose-dark",
    },
    {
      number: 3,
      icon: CheckCircle2,
      title: t.treatmentProcess.step3.title,
      description: t.treatmentProcess.step3.description,
      image: "/hero-misspo.jpg", // Placeholder
      color: "misspo-blue",
      textColor: "text-misspo-blue-dark",
      bgColor: "bg-misspo-blue-dark",
    },
  ]

  return (
    <div className="relative" dir={dir}>
      {steps.map((step, index) => (
        <StepSection key={step.number} step={step} isLast={index === steps.length - 1} />
      ))}
    </div>
  )
}

function StepSection({ step, isLast }: { step: any; isLast: boolean }) {
  const { ref, isInView } = useInView({ threshold: 0.3 })

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <Parallax speed={-20} className="absolute inset-0">
        <div className="relative w-full h-[120vh]">
          <Image
            src={step.image}
            alt={step.title}
            fill
            className="object-cover"
            quality={90}
          />
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </Parallax>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20">
        <Parallax speed={10}>
          <div
            className={`text-center transition-all duration-1000 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Step Number Badge */}
            <div className="flex justify-center mb-8">
              <div
                className={`relative w-24 h-24 rounded-full ${step.bgColor} flex items-center justify-center shadow-2xl`}
              >
                <span className="text-4xl font-bold text-white">{step.number}</span>
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
              </div>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                <step.icon className={`h-8 w-8 ${step.textColor}`} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              {step.title}
            </h2>

            {/* Description - Expanded */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl">
              <p className="text-lg md:text-xl leading-relaxed text-foreground">
                {step.description}
              </p>
              
              {/* Additional context based on step */}
              {step.number === 1 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Notre aspirateur professionnel breveté utilise une technologie de pointe pour aspirer délicatement les poux et les lentes directement à la racine des cheveux. Cette méthode mécanique est totalement indolore et respecte la structure capillaire. Contrairement aux traitements chimiques agressifs, notre approche préserve la santé du cuir chevelu tout en garantissant une efficacité maximale dès la première intervention.
                  </p>
                </div>
              )}
              
              {step.number === 2 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Notre lotion exclusive est formulée à partir d'actifs naturels soigneusement sélectionnés pour leur efficacité prouvée contre les poux et les lentes. Sans insecticides chimiques ni substances toxiques, elle convient parfaitement aux peaux sensibles, aux bébés dès 6 mois, et aux femmes enceintes ou allaitantes. La formule agit en quelques minutes et ne nécessite aucun rinçage prolongé. Vos cheveux restent doux, propres et parfaitement secs à la fin du traitement.
                  </p>
                </div>
              )}
              
              {step.number === 3 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Notre protocole de vérification finale est méticuleux et rigoureux. Nous examinons chaque mèche de cheveux avec un peigne fin professionnel sous un éclairage optimal pour nous assurer qu'aucun pou ni aucune lente n'a survécu au traitement. Cette étape cruciale nous permet de vous garantir une efficacité de 100%. À la fin de la séance, nous vous montrons le résultat de notre intervention pour votre totale tranquillité d'esprit. Vous repartez avec la certitude d'un traitement complet et réussi.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Parallax>
      </div>

      {/* Animated Arrow - Only if not last step */}
      {!isLast && (
        <Parallax speed={5}>
          <div
            className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-1000 delay-500 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                Étape suivante
              </span>
              <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                <ChevronDown className="h-6 w-6 text-gray-800" />
              </div>
            </div>
          </div>
        </Parallax>
      )}

      {/* Step Indicator */}
      <div className="absolute top-8 right-8 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <span className="text-sm font-bold text-gray-800">
            {step.number} / 3
          </span>
        </div>
      </div>
    </section>
  )
}
