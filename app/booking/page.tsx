"use client"

import { useState, useEffect } from "react"
import {
  School, Home, User, Phone, Mail, MapPin, CalendarDays, Clock,
  Send, CheckCircle2, MessageCircle, FileText, Loader2,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useInView } from "@/hooks/use-in-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { api, WorkingHours } from "@/lib/api"
import { getRealtimeManager } from "@/lib/realtime-manager"
import { RealtimeStatus } from "@/components/realtime-status"
import { toast } from "sonner"

type Pack = "school" | "home" | ""

export default function BookingPage() {
  const { t, dir } = useLanguage()
  const { ref, isInView } = useInView()
  const [pack, setPack] = useState<Pack>("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [apiError, setApiError] = useState<string>("")

  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const hours = await api.getWorkingHours()
        setWorkingHours(hours)
      } catch (error) {
        console.error("Failed to fetch working hours:", error)
        setApiError("Impossible de charger les horaires. Veuillez réessayer.")
      }
    }
    fetchWorkingHours()
  }, [])

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !pack) {
        setAvailableSlots([])
        return
      }
      setLoadingSlots(true)
      setApiError("")
      try {
        const dateStr = selectedDate.toLocaleDateString('en-CA')
        const slots = await api.getAvailableSlots(dateStr, pack)
        setAvailableSlots(slots)
      } catch (error) {
        console.error("Failed to fetch slots:", error)
        setApiError("Impossible de charger les créneaux disponibles.")
        setAvailableSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }
    
    fetchSlots()
    
    // Hybrid WebSocket/Polling subscription for real-time slot updates
    if (selectedDate && pack) {
      const manager = getRealtimeManager()
      const dateStr = selectedDate.toLocaleDateString('en-CA')
      const packValue = pack === 'school' ? 'ecole' : 'domicile' // Sanitized for channel names
      const channelName = `slots.${dateStr}.${packValue}`
      
      console.log('Subscribing to channel:', channelName)
      
      manager.subscribe(
        channelName,
        '.slots.updated',
        (data: any) => {
          console.log('Slots updated:', data)
          setAvailableSlots(data.slots)
          
          // Clear selected time if it's no longer available
          if (selectedTime && !data.slots.includes(selectedTime)) {
            setSelectedTime("")
            toast.info("Le créneau sélectionné n'est plus disponible")
          }
        },
        // Polling callback
        async () => {
          const slots = await api.getAvailableSlots(dateStr, packValue)
          setAvailableSlots(slots)
          
          // Clear selected time if it's no longer available
          if (selectedTime && !slots.includes(selectedTime)) {
            setSelectedTime("")
            toast.info("Le créneau sélectionné n'est plus disponible")
          }
        }
      )
      
      // Cleanup
      return () => {
        manager.unsubscribe(channelName)
      }
    }
  }, [selectedDate, pack])

  const isDayDisabled = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true
    if (!workingHours) return false
    const dayOfWeek = date.getDay()
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    const dayName = dayNames[dayOfWeek]
    return workingHours[dayName]?.ferme !== false
  }

  const morningSlots = availableSlots.filter((s) => parseInt(s.split(":")[0]) < 12)
  const afternoonSlots = availableSlots.filter((s) => parseInt(s.split(":")[0]) >= 14)

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!pack) newErrors.pack = t.booking.required
    if (!name || name.length < 3) newErrors.name = t.booking.required
    if (!phone || !/^0[67]\d{8}$/.test(phone)) newErrors.phone = t.booking.invalidPhone
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t.booking.invalidEmail
    if (pack === "home" && (!address || address.length < 10)) newErrors.address = t.booking.required
    if (pack === "school" && (!schoolName || schoolName.length < 3)) newErrors.schoolName = t.booking.required
    if (!selectedDate) newErrors.date = t.booking.required
    if (!selectedTime) newErrors.time = t.booking.required
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoadingSubmit(true)
    setApiError("")
    try {
      const packValue = pack === "school" ? "École" : "Domicile"
      const dateStr = selectedDate!.toLocaleDateString('en-CA')
      const appointmentData = {
        pack: packValue, nom: name, telephone: phone, email: email,
        ...(pack === "home" && { adresse: address }),
        ...(pack === "school" && { ecole: schoolName }),
        date: dateStr, heure: selectedTime, notes: notes || undefined
      }
      const response = await api.createAppointment(appointmentData)
      if (response.success) setSubmitted(true)
    } catch (error: any) {
      console.error("Failed to create appointment:", error)
      setApiError(error.message || "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoadingSubmit(false)
    }
  }

  function buildWhatsAppUrl(): string {
    const packLabel = pack === "school" ? t.booking.packSchool : t.booking.packHome
    const dateStr = selectedDate ? selectedDate.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : ""
    const msg = `Bonjour MISSPO,\n\nJe souhaite prendre un rendez-vous.\n\nPack: ${packLabel}\nNom: ${name}\nTel: ${phone}\nEmail: ${email}\n${pack === "home" ? `Adresse: ${address}\n` : ""}${pack === "school" ? `Ecole: ${schoolName}\n` : ""}Date: ${dateStr}\nHeure: ${selectedTime}\n${notes ? `Notes: ${notes}` : ""}`
    return `https://wa.me/212622945571?text=${encodeURIComponent(msg)}`
  }

  if (submitted) {
    return (
      <div dir={dir}>
        <section className="bg-gradient-to-br from-misspo-rose-pale via-white to-misspo-blue-pale py-16">
          <div className="mx-auto max-w-lg px-4 text-center">
            <div className="rounded-3xl border border-misspo-blue-light bg-white p-10 shadow-lg animate-scale-in">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-misspo-blue-dark text-white">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-foreground">{t.booking.successTitle}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{t.booking.successMessage}</p>
              <div className="mt-8 flex flex-col gap-3">
                <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-green-600 text-white hover:bg-green-700 shadow-md">
                    <MessageCircle className="h-4 w-4" />
                    {t.booking.whatsappBtn}
                  </Button>
                </a>
                <Button variant="outline" onClick={() => {
                  setSubmitted(false); setPack(""); setName(""); setPhone(""); setEmail("");
                  setAddress(""); setSchoolName(""); setSelectedDate(undefined); setSelectedTime("");
                  setNotes(""); setApiError("");
                }} className="border-misspo-rose text-misspo-rose-dark hover:bg-misspo-rose-pale">OK</Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div dir={dir}>
      {/* Realtime Status Indicator - Development Only */}
      {process.env.NODE_ENV === 'development' && <RealtimeStatus />}
      
      <section className="bg-gradient-to-br from-misspo-rose-pale via-white to-misspo-blue-pale py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-misspo-blue-dark">MISSPO</span>
          <h1 className="mt-2 text-balance text-4xl font-bold text-foreground md:text-5xl">{t.booking.title}</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">{t.booking.subtitle}</p>
        </div>
      </section>
      <section className="py-16 bg-white" ref={ref}>
        <div className="mx-auto max-w-3xl px-4">
          {apiError && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{apiError}</div>}
          <form onSubmit={handleSubmit} className={`flex flex-col gap-8 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="rounded-2xl border border-misspo-rose-light bg-gradient-to-br from-misspo-rose-pale/30 to-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-misspo-rose-dark">
                <FileText className="h-5 w-5" />
                <h2 className="text-lg font-bold">{t.booking.packChoice}</h2>
              </div>
              <RadioGroup value={pack} onValueChange={(v) => { setPack(v as Pack); setSelectedTime(""); }} className="mt-4 grid grid-cols-2 gap-3 md:gap-4">
                <label htmlFor="pack-school" className={`flex cursor-pointer flex-col items-center gap-2 md:gap-3 rounded-2xl border-2 p-3 md:p-5 transition-all ${pack === "school" ? "border-misspo-blue-dark bg-misspo-blue-pale shadow-md" : "border-misspo-blue-light bg-white hover:border-misspo-blue hover:shadow-sm"}`}>
                  <RadioGroupItem value="school" id="pack-school" className="sr-only" />
                  <div className={`flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-xl ${pack === "school" ? "bg-misspo-blue-dark text-white" : "bg-misspo-blue-pale text-misspo-blue-dark"}`}>
                    <School className="h-4 w-4 md:h-6 md:w-6" />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-foreground text-center">{t.booking.packSchool}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground text-center">{t.booking.priceQuote}</span>
                </label>
                <label htmlFor="pack-home" className={`flex cursor-pointer flex-col items-center gap-2 md:gap-3 rounded-2xl border-2 p-3 md:p-5 transition-all ${pack === "home" ? "border-misspo-rose-dark bg-misspo-rose-pale shadow-md" : "border-misspo-rose-light bg-white hover:border-misspo-rose hover:shadow-sm"}`}>
                  <RadioGroupItem value="home" id="pack-home" className="sr-only" />
                  <div className={`flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-xl ${pack === "home" ? "bg-misspo-rose-dark text-white" : "bg-misspo-rose-pale text-misspo-rose-dark"}`}>
                    <Home className="h-4 w-4 md:h-6 md:w-6" />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-foreground text-center">{t.booking.packHome}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground text-center">{t.booking.priceHome}</span>
                </label>
              </RadioGroup>
              {errors.pack && <p className="mt-2 text-xs text-red-500">{errors.pack}</p>}
            </div>
            <div className="rounded-2xl border border-misspo-blue-light bg-gradient-to-br from-misspo-blue-pale/30 to-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-misspo-blue-dark">
                <User className="h-5 w-5" />
                <h2 className="text-lg font-bold">{t.booking.clientInfo}</h2>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <Label htmlFor="booking-name" className="text-sm font-medium">{t.booking.nameField} *</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="booking-name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 border-misspo-blue-light focus-visible:ring-misspo-blue" placeholder={t.booking.nameField} />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="booking-phone" className="text-sm font-medium">{t.booking.phoneField} *</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="booking-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 border-misspo-blue-light focus-visible:ring-misspo-blue" placeholder="06XXXXXXXX" />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="booking-email" className="text-sm font-medium">{t.booking.emailField} *</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="booking-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 border-misspo-blue-light focus-visible:ring-misspo-blue" placeholder="email@exemple.com" />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>
                {pack === "home" && (
                  <div className="animate-fade-in-up">
                    <Label htmlFor="booking-address" className="text-sm font-medium">{t.booking.addressField} *</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="booking-address" value={address} onChange={(e) => setAddress(e.target.value)} className="pl-10 border-misspo-blue-light focus-visible:ring-misspo-blue" placeholder={t.booking.addressField} />
                    </div>
                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                  </div>
                )}
                {pack === "school" && (
                  <div className="animate-fade-in-up">
                    <Label htmlFor="booking-school" className="text-sm font-medium">{t.booking.schoolField} *</Label>
                    <div className="relative mt-1">
                      <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="booking-school" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="pl-10 border-misspo-blue-light focus-visible:ring-misspo-blue" placeholder={t.booking.schoolField} />
                    </div>
                    {errors.schoolName && <p className="mt-1 text-xs text-red-500">{errors.schoolName}</p>}
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-misspo-rose-light bg-gradient-to-br from-misspo-rose-pale/30 to-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-misspo-rose-dark">
                <CalendarDays className="h-5 w-5" />
                <h2 className="text-lg font-bold">{t.booking.dateTime}</h2>
              </div>
              <div className="mt-4 flex flex-col gap-6 lg:flex-row">
                <div className="flex-1">
                  <Label className="text-sm font-medium">{t.booking.selectDate} *</Label>
                  <div className="mt-2 flex justify-center rounded-xl border border-misspo-rose-light bg-white p-2">
                    <Calendar mode="single" selected={selectedDate} onSelect={(date) => { setSelectedDate(date); setSelectedTime(""); }} disabled={isDayDisabled} className="rounded-lg" classNames={{ day_selected: "bg-misspo-rose-dark text-white hover:bg-misspo-rose hover:text-white focus:bg-misspo-rose-dark focus:text-white", day_today: "bg-misspo-blue-pale text-misspo-blue-dark" }} />
                  </div>
                  {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-medium">{t.booking.selectTime} *</Label>
                  {loadingSlots ? (
                    <div className="mt-2 flex items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 p-10">
                      <Loader2 className="h-6 w-6 animate-spin text-misspo-blue-dark" />
                    </div>
                  ) : selectedDate && pack ? (
                    availableSlots.length > 0 ? (
                      <div className="mt-2 flex flex-col gap-4">
                        {morningSlots.length > 0 && (
                          <div>
                            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-misspo-blue-dark">
                              <Clock className="h-3.5 w-3.5" />{t.booking.morning}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {morningSlots.map((slot) => (
                                <button key={slot} type="button" onClick={() => setSelectedTime(slot)} className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${selectedTime === slot ? "border-misspo-rose-dark bg-misspo-rose-dark text-white shadow-md" : "border-misspo-rose-light bg-white text-foreground hover:border-misspo-rose hover:bg-misspo-rose-pale"}`}>{slot}</button>
                              ))}
                            </div>
                          </div>
                        )}
                        {afternoonSlots.length > 0 && (
                          <div>
                            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-misspo-rose-dark">
                              <Clock className="h-3.5 w-3.5" />{t.booking.afternoon}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {afternoonSlots.map((slot) => (
                                <button key={slot} type="button" onClick={() => setSelectedTime(slot)} className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${selectedTime === slot ? "border-misspo-blue-dark bg-misspo-blue-dark text-white shadow-md" : "border-misspo-blue-light bg-white text-foreground hover:border-misspo-blue hover:bg-misspo-blue-pale"}`}>{slot}</button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 p-10 text-sm text-muted-foreground">{t.booking.closed}</div>
                    )
                  ) : (
                    <div className="mt-2 flex items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 p-10 text-sm text-muted-foreground">{!pack ? "Sélectionnez d'abord un pack" : t.booking.selectDate}</div>
                  )}
                  {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-misspo-blue-light bg-gradient-to-br from-misspo-blue-pale/30 to-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-misspo-blue-dark">
                <FileText className="h-5 w-5" />
                <h2 className="text-lg font-bold">{t.booking.notes}</h2>
              </div>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-3 border-misspo-blue-light focus-visible:ring-misspo-blue resize-none" placeholder={t.booking.notesPlaceholder} />
            </div>
            <Button type="submit" size="lg" disabled={loadingSubmit} className="w-full bg-misspo-rose-dark text-white shadow-lg hover:bg-misspo-rose hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
              {loadingSubmit ? (<><Loader2 className="h-4 w-4 animate-spin" />Envoi en cours...</>) : (<><Send className="h-4 w-4" />{t.booking.submitBtn}</>)}
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
