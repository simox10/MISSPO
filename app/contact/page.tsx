"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

function ContactInfo() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()

  const contacts = [
    {
      icon: MapPin,
      label: t.contact.locationLabel,
      value: t.contact.location,
      color: "bg-misspo-rose-pale text-misspo-rose-dark",
    },
    {
      icon: Phone,
      label: t.contact.phoneLabel,
      value: "0622945571",
      href: "tel:0622945571",
      color: "bg-misspo-blue-pale text-misspo-blue-dark",
    },
    {
      icon: Mail,
      label: t.contact.emailLabel,
      value: "wafaaoubouali91@gmail.com",
      href: "mailto:wafaaoubouali91@gmail.com",
      color: "bg-misspo-rose-pale text-misspo-rose-dark",
    },
  ]

  return (
    <div ref={ref} className="flex flex-col gap-4" dir={dir}>
      {contacts.map((item, index) => (
        <div
          key={item.label}
          className={`flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-500 hover:shadow-md ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
            <item.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            {item.href ? (
              <a href={item.href} className="text-sm font-semibold text-foreground hover:text-misspo-rose-dark transition-colors">
                {item.value}
              </a>
            ) : (
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            )}
          </div>
        </div>
      ))}

      {/* Quick action buttons */}
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <a href="tel:0622945571" className="flex-1">
          <Button className="w-full bg-misspo-blue-dark text-white hover:bg-misspo-blue shadow-md">
            <Phone className="h-4 w-4" />
            {t.contact.callBtn}
          </Button>
        </a>
        <a
          href="https://wa.me/212622945571"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full bg-green-600 text-white hover:bg-green-700 shadow-md">
            <MessageCircle className="h-4 w-4" />
            {t.contact.whatsappBtn}
          </Button>
        </a>
        <a href="mailto:wafaaoubouali91@gmail.com" className="flex-1">
          <Button className="w-full bg-misspo-rose-dark text-white hover:bg-misspo-rose shadow-md">
            <Mail className="h-4 w-4" />
            {t.contact.emailBtn}
          </Button>
        </a>
      </div>
    </div>
  )
}

function ContactForm() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = (data.get("name") as string).trim()
    const phone = (data.get("phone") as string).trim()
    const email = (data.get("email") as string).trim()

    const newErrors: Record<string, string> = {}
    if (!name || name.length < 3) newErrors.name = t.booking.required
    if (!phone || !/^0[67]\d{8}$/.test(phone)) newErrors.phone = t.booking.invalidPhone
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t.booking.invalidEmail

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-misspo-blue-light bg-misspo-blue-pale/30 p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-misspo-blue-dark text-white">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <p className="text-lg font-semibold text-foreground">{t.contact.successMessage}</p>
        <Button
          variant="outline"
          onClick={() => setSent(false)}
          className="border-misspo-blue text-misspo-blue-dark hover:bg-misspo-blue-pale"
        >
          OK
        </Button>
      </div>
    )
  }

  return (
    <div ref={ref} dir={dir}>
      <div className={`rounded-2xl border border-misspo-rose-light bg-gradient-to-br from-misspo-rose-pale/30 to-white p-6 shadow-sm transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h3 className="text-lg font-bold text-foreground">{t.contact.formTitle}</h3>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <Label htmlFor="contact-name" className="text-sm font-medium text-foreground">
              {t.contact.nameField} *
            </Label>
            <Input
              id="contact-name"
              name="name"
              required
              className="mt-1 border-misspo-rose-light focus-visible:ring-misspo-rose"
              placeholder={t.contact.nameField}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact-phone" className="text-sm font-medium text-foreground">
                {t.contact.phoneField} *
              </Label>
              <Input
                id="contact-phone"
                name="phone"
                type="tel"
                required
                className="mt-1 border-misspo-rose-light focus-visible:ring-misspo-rose"
                placeholder="06XXXXXXXX"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                {t.contact.emailField} *
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                className="mt-1 border-misspo-rose-light focus-visible:ring-misspo-rose"
                placeholder="email@exemple.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="contact-message" className="text-sm font-medium text-foreground">
              {t.contact.messageField}
            </Label>
            <Textarea
              id="contact-message"
              name="message"
              rows={4}
              className="mt-1 border-misspo-rose-light focus-visible:ring-misspo-rose resize-none"
              placeholder={t.contact.messageField}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-misspo-rose-dark text-white shadow-md hover:bg-misspo-rose hover:shadow-lg transition-all"
          >
            <Send className="h-4 w-4" />
            {t.contact.sendBtn}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function ContactPage() {
  const { t, dir } = useLanguage()

  return (
    <div dir={dir}>
      {/* Hero */}
      <section className="bg-gradient-to-br from-misspo-rose-pale via-white to-misspo-blue-pale py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-misspo-blue-dark">
            MISSPO
          </span>
          <h1 className="mt-2 text-balance text-4xl font-bold text-foreground md:text-5xl">
            {t.contact.title}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-2">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
