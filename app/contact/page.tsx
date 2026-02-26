"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2, Instagram, Check, X } from "lucide-react"
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
      animation: "animate-bounce",
    },
    {
      icon: Phone,
      label: t.contact.phoneLabel,
      value: "0622945571",
      href: "tel:0622945571",
      color: "bg-misspo-blue-pale text-misspo-blue-dark",
      animation: "animate-pulse",
    },
    {
      icon: Mail,
      label: t.contact.emailLabel,
      value: "wafaaoubouali91@gmail.com",
      href: "mailto:wafaaoubouali91@gmail.com",
      color: "bg-misspo-rose-pale text-misspo-rose-dark",
      animation: "animate-spin-slow",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@misspo_casablanca",
      href: "https://www.instagram.com/misspo_casablanca",
      color: "bg-misspo-blue-pale text-misspo-blue-dark",
      animation: "animate-wiggle",
    },
  ]

  const getIconAnimation = (index: number) => {
    const animations = [
      'group-hover:animate-bounce',
      'group-hover:animate-ring', 
      'group-hover:animate-envelope',
      'group-hover:animate-wiggle'
    ]
    return animations[index] || ''
  }

  return (
    <div ref={ref} className="flex h-full flex-col justify-between" dir={dir}>
      {contacts.map((item, index) => (
        <div
          key={item.label}
          className={`group flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-500 hover:shadow-md ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
            <item.icon className={`h-5 w-5 ${getIconAnimation(index)}`} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            {item.href ? (
              <a 
                href={item.href} 
                className="text-sm font-semibold text-foreground transition-colors"
                style={{ 
                  color: 'inherit'
                }}
                onMouseEnter={(e) => {
                  if (item.label === t.contact.emailLabel) {
                    e.currentTarget.style.color = '#2DA1CA'
                  } else if (item.label === "Instagram") {
                    e.currentTarget.style.color = '#ED7A97'
                  } else {
                    e.currentTarget.style.color = '#ED7A97'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'inherit'
                }}
              >
                {item.value}
              </a>
            ) : (
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            )}
          </div>
        </div>
      ))}

      {/* Quick action buttons */}
      <div className="mt-2 hidden md:flex flex-col gap-3 sm:flex-row">
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
          <Button className="w-full bg-misspo-rose-dark text-white hover:bg-misspo-rose shadow-md">
            <MessageCircle className="h-4 w-4" />
            {t.contact.whatsappBtn}
          </Button>
        </a>
        <a href="mailto:wafaaoubouali91@gmail.com" className="flex-1">
          <Button className="w-full bg-misspo-blue-dark text-white hover:bg-misspo-blue shadow-md">
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
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [values, setValues] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    email: "",
    message: ""
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "lastName":
      case "firstName":
        return value.trim().length >= 2
      case "phone":
        return /^0[67]\d{8}$/.test(value.trim()) && value.trim().length === 10
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      default:
        return true
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      const isValid = validateField(name, value)
      if (isValid) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const isValid = validateField(name, value)
    if (!isValid) {
      let errorMsg = t.booking.required
      if (name === "phone") errorMsg = "Le numéro doit contenir exactement 10 chiffres"
      if (name === "email") errorMsg = t.booking.invalidEmail
      setErrors(prev => ({ ...prev, [name]: errorMsg }))
    }
  }

  const getFieldStatus = (name: string) => {
    if (!touched[name] || !values[name as keyof typeof values]) return null
    return validateField(name, values[name as keyof typeof values]) ? "valid" : "invalid"
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    if (!values.lastName || values.lastName.length < 2) newErrors.lastName = t.booking.required
    if (!values.firstName || values.firstName.length < 2) newErrors.firstName = t.booking.required
    if (!values.phone || !/^0[67]\d{8}$/.test(values.phone) || values.phone.length !== 10) newErrors.phone = "Le numéro doit contenir exactement 10 chiffres"
    if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) newErrors.email = t.booking.invalidEmail

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched({ lastName: true, firstName: true, phone: true, email: true })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      console.log('Envoi vers:', `${API_URL}/contact`)
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nom: values.lastName,
          prenom: values.firstName,
          telephone: values.phone,
          email: values.email,
          message: values.message
        }),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok && data.success) {
        setSent(true)
        setValues({
          lastName: "",
          firstName: "",
          phone: "",
          email: "",
          message: ""
        })
        setTouched({})
      } else {
        setErrors({ submit: data.message || 'Erreur lors de l\'envoi du message' })
      }
    } catch (error) {
      console.error("Erreur complète:", error)
      setErrors({ 
        submit: `Impossible de contacter le serveur (${API_URL}). Vérifiez que le serveur Laravel est démarré avec "php artisan serve".` 
      })
    } finally {
      setLoading(false)
    }
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
    <div ref={ref} dir={dir} className="h-full">
      <div className={`h-full rounded-2xl border border-misspo-rose-light bg-gradient-to-br from-misspo-rose-pale/30 to-white p-6 shadow-sm transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h3 className="text-lg font-bold text-foreground">{t.contact.formTitle}</h3>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact-lastName" className="text-sm font-medium text-foreground">
                {t.contact.lastNameField} *
              </Label>
              <div className="relative">
                <Input
                  id="contact-lastName"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`mt-1 pr-10 border-misspo-rose-light focus-visible:ring-misspo-rose ${
                    getFieldStatus("lastName") === "valid" ? "border-green-500" : 
                    getFieldStatus("lastName") === "invalid" ? "border-red-500" : ""
                  }`}
                  placeholder={t.contact.lastNameField}
                />
                {getFieldStatus("lastName") === "valid" && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
                {getFieldStatus("lastName") === "invalid" && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                )}
              </div>
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
            </div>
            <div>
              <Label htmlFor="contact-firstName" className="text-sm font-medium text-foreground">
                {t.contact.firstNameField} *
              </Label>
              <div className="relative">
                <Input
                  id="contact-firstName"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`mt-1 pr-10 border-misspo-rose-light focus-visible:ring-misspo-rose ${
                    getFieldStatus("firstName") === "valid" ? "border-green-500" : 
                    getFieldStatus("firstName") === "invalid" ? "border-red-500" : ""
                  }`}
                  placeholder={t.contact.firstNameField}
                />
                {getFieldStatus("firstName") === "valid" && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
                {getFieldStatus("firstName") === "invalid" && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                )}
              </div>
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact-phone" className="text-sm font-medium text-foreground">
                {t.contact.phoneField} *
              </Label>
              <div className="relative">
                <Input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  maxLength={10}
                  className={`mt-1 pr-10 border-misspo-rose-light focus-visible:ring-misspo-rose ${
                    getFieldStatus("phone") === "valid" ? "border-green-500" : 
                    getFieldStatus("phone") === "invalid" ? "border-red-500" : ""
                  }`}
                  placeholder="06XXXXXXXX"
                />
                {getFieldStatus("phone") === "valid" && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
                {getFieldStatus("phone") === "invalid" && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                )}
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                {t.contact.emailField} *
              </Label>
              <div className="relative">
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`mt-1 pr-10 border-misspo-rose-light focus-visible:ring-misspo-rose ${
                    getFieldStatus("email") === "valid" ? "border-green-500" : 
                    getFieldStatus("email") === "invalid" ? "border-red-500" : ""
                  }`}
                  placeholder="email@exemple.com"
                />
                {getFieldStatus("email") === "valid" && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
                {getFieldStatus("email") === "invalid" && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                )}
              </div>
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
              value={values.message}
              onChange={handleChange}
              rows={4}
              className="mt-1 border-misspo-rose-light focus-visible:ring-misspo-rose resize-none"
              placeholder={t.contact.messageField}
            />
          </div>
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{errors.submit}</p>
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="group w-full bg-misspo-rose-dark text-white shadow-md hover:bg-misspo-rose hover:shadow-lg transition-all overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 group-hover:animate-send-arrow" />
                <span className="opacity-100 group-hover:opacity-0 group-hover:animate-blur-in">
                  {t.contact.sendBtn}
                </span>
              </>
            )}
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
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-wider text-misspo-blue-dark" style={{ fontWeight: 900 }}>
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
          <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
