"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Phone, MapPin, School, Edit, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

type Reservation = {
  id: number
  client_id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  date: string
  heure: string
  pack: string
  statut: string
  adresse?: string
  ecole?: string
  service_type?: string
  notes?: string
}

export default function PlanningPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [availableHoursEdit, setAvailableHoursEdit] = useState<{openTime: string, closeTime: string, available: boolean, bookedSlots?: string[]} | null>(null)
  const [selectedDateForEdit, setSelectedDateForEdit] = useState("")

  // Charger les rendez-vous pour la date sélectionnée
  useEffect(() => {
    fetchReservationsForDate(selectedDate)
  }, [selectedDate])

  // Charger les horaires pour le formulaire d'édition
  useEffect(() => {
    if (selectedDateForEdit) {
      fetchAvailableHoursEdit(selectedDateForEdit)
    }
  }, [selectedDateForEdit])

  const fetchAvailableHoursEdit = async (date: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/appointments/available-hours?date=${date}`)
      const data = await response.json()
      
      if (data.success) {
        setAvailableHoursEdit({
          available: data.available,
          openTime: data.openTime || "09:00",
          closeTime: data.closeTime || "18:00",
          bookedSlots: data.bookedSlots || []
        })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des horaires:", error)
    }
  }

  // Générer les créneaux horaires disponibles (en excluant les créneaux réservés)
  const generateTimeSlots = (openTime: string, closeTime: string, bookedSlots: string[] = []) => {
    const slots = []
    const [openHour, openMinute] = openTime.split(':').map(Number)
    const [closeHour, closeMinute] = closeTime.split(':').map(Number)
    
    let currentHour = openHour
    
    // Commencer à l'heure pleine suivante si l'ouverture n'est pas à l'heure pleine
    if (openMinute > 0) {
      currentHour += 1
    }
    
    while (currentHour < closeHour) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:00`
      
      // Ajouter seulement si le créneau n'est pas réservé
      if (!bookedSlots.includes(timeStr)) {
        slots.push(timeStr)
      }
      
      // Incrémenter d'1 heure
      currentHour += 1
    }
    
    return slots
  }

  const fetchReservationsForDate = async (date: Date) => {
    try {
      setLoading(true)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      
      const response = await fetch(`${API_URL}/admin/appointments/by-date?date=${dateStr}`)
      
      // Vérifier si la réponse est bien du JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("La réponse n'est pas du JSON")
        setReservations([])
        return
      }
      
      const data = await response.json()
      
      if (data.success) {
        setReservations(data.appointments)
      } else {
        setReservations([])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous:", error)
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const getReservationsForDate = (date: Date) => {
    return reservations.sort((a, b) => a.heure.localeCompare(b.heure))
  }

  const previousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  const nextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  const dayReservations = getReservationsForDate(selectedDate)

  // Heures de 8h à 18h
  const hours = Array.from({ length: 11 }, (_, i) => i + 8)

  const getReservationForHour = (hour: number) => {
    return dayReservations.filter(r => {
      const resHour = parseInt(r.heure.split(':')[0])
      return resHour === hour
    })
  }

  const getStatutColor = (statut: string) => {
    const colors = {
      "Confirmée": "border-l-green-500 bg-green-50 hover:bg-green-100",
      "En attente": "border-l-yellow-500 bg-yellow-50 hover:bg-yellow-100",
      "Annulée": "border-l-red-500 bg-red-50 hover:bg-red-100",
      "Refusée": "border-l-red-500 bg-red-50 hover:bg-red-100",
      "Terminée": "border-l-blue-500 bg-blue-50 hover:bg-blue-100",
    }
    return colors[statut as keyof typeof colors] || "border-l-gray-500 bg-gray-50"
  }

  const getStatutBadge = (statut: string) => {
    const variants = {
      "Confirmée": "bg-green-100 text-green-700",
      "En attente": "bg-yellow-100 text-yellow-700",
      "Annulée": "bg-red-100 text-red-700",
      "Refusée": "bg-red-100 text-red-700",
      "Terminée": "bg-blue-100 text-blue-700",
    }
    return variants[statut as keyof typeof variants] || ""
  }

  const getPackBadge = (pack: string) => {
    return pack === "École" 
      ? "bg-misspo-blue-pale text-misspo-blue-dark"
      : "bg-misspo-rose-pale text-misspo-rose-dark"
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString()

  // Obtenir 5 jours centrés sur la date sélectionnée
  const getWeekDays = (date: Date) => {
    const days = []
    // 2 jours avant, le jour actuel, 2 jours après = 5 jours
    for (let i = -2; i <= 2; i++) {
      const day = new Date(date)
      day.setDate(date.getDate() + i)
      days.push(day)
    }
    return days
  }

  const weekDays = getWeekDays(selectedDate)

  // Charger le nombre de rendez-vous pour chaque jour de la semaine
  const [weekReservationsCounts, setWeekReservationsCounts] = useState<{[key: string]: number}>({})

  useEffect(() => {
    const fetchWeekCounts = async () => {
      const counts: {[key: string]: number} = {}
      for (const day of weekDays) {
        const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
        try {
          const response = await fetch(`${API_URL}/admin/appointments/by-date?date=${dateStr}`)
          
          // Vérifier si la réponse est bien du JSON
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json()
            if (data.success) {
              counts[dateStr] = data.appointments.length
            }
          }
        } catch (error) {
          console.error("Erreur:", error)
        }
      }
      setWeekReservationsCounts(counts)
    }
    fetchWeekCounts()
  }, [selectedDate])

  const getReservationsCountForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    return weekReservationsCounts[dateStr] || 0
  }

  const previousWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 5) // Avancer de 5 jours
    setSelectedDate(newDate)
  }

  const nextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 5) // Reculer de 5 jours
    setSelectedDate(newDate)
  }

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="relative">
            {/* Spinner principal */}
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#ED7A97]"></div>
            {/* Spinner secondaire */}
            <div className="absolute top-0 left-0 animate-spin rounded-full h-20 w-20 border-t-4 border-[#2DA1CA] opacity-50" style={{ animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-8 text-gray-700 font-semibold text-lg">Chargement du planning...</p>
          <p className="mt-2 text-sm text-gray-500">Veuillez patienter</p>
        </div>
      ) : (
        <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Planning des Réservations</h1>
        <p className="text-muted-foreground mt-1">Vue journalière avec créneaux horaires</p>
      </div>

      {/* Planning journalier */}
      <Card className="overflow-hidden">
        <CardHeader className="p-3 md:p-6">
          {/* Sélecteur de 5 jours */}
          <div className="mb-6">
            <div className="flex items-stretch gap-1 md:gap-2">
              <Button 
                variant="outline"
                onClick={previousWeek}
                className="h-auto px-2 md:px-3 flex-shrink-0"
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              
              <div className="flex-1 grid grid-cols-5 gap-0.5 md:gap-2 min-w-0">
              {weekDays.map((day, index) => {
                const isSelected = day.toDateString() === selectedDate.toDateString()
                const isDayToday = day.toDateString() === new Date().toDateString()
                const dayReservationsCount = getReservationsCountForDate(day)
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      p-1 md:p-3 rounded-lg border-2 transition-all text-center min-w-0
                      ${isSelected 
                        ? 'border-misspo-rose-dark bg-misspo-rose-pale shadow-md' 
                        : 'border-gray-200 hover:border-misspo-rose-light hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="text-[9px] md:text-xs font-medium text-gray-600 mb-0.5 md:mb-1 truncate">
                      {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </div>
                    <div className={`text-xs md:text-lg font-bold ${isSelected ? 'text-misspo-rose-dark' : 'text-gray-900'}`}>
                      {day.getDate()}
                    </div>
                    <div className="text-[9px] md:text-xs text-gray-500 mt-0.5 md:mt-1 hidden sm:block truncate">
                      {day.toLocaleDateString('fr-FR', { month: 'short' })}
                    </div>
                    {isDayToday && (
                      <Badge className="mt-1 text-[8px] md:text-xs bg-misspo-blue-dark text-white px-1 py-0 hidden sm:inline-flex">
                        Aujourd'hui
                      </Badge>
                    )}
                    {isDayToday && (
                      <div className="mt-0.5 w-1.5 h-1.5 bg-misspo-blue-dark rounded-full mx-auto sm:hidden"></div>
                    )}
                    {dayReservationsCount > 0 && (
                      <div className="mt-0.5 md:mt-1 text-[9px] md:text-xs font-semibold text-misspo-rose-dark">
                        {dayReservationsCount}
                      </div>
                    )}
                  </button>
                )
              })}
              </div>
              
              <Button 
                variant="outline"
                onClick={nextWeek}
                className="h-auto px-2 md:px-3 flex-shrink-0"
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>

          {/* Date avec badge et icône sur une seule ligne */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <CardTitle className="text-base md:text-2xl truncate">
                {selectedDate.toLocaleDateString('fr-FR', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </CardTitle>
              {isToday && (
                <Badge className="bg-misspo-rose-dark text-white text-[10px] md:text-xs px-1.5 md:px-2.5 py-0.5 whitespace-nowrap">Aujourd'hui</Badge>
              )}
            </div>
            
            {/* Icône calendrier */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0"
                >
                  <CalendarIcon className="h-4 md:h-6 w-4 md:w-6 text-misspo-rose-dark" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          {/* Grille horaire */}
          <div className="space-y-2">
            {hours.map((hour) => {
              const hourReservations = getReservationForHour(hour)
              const hasReservations = hourReservations.length > 0
              const confirmedCount = hourReservations.filter(r => r.statut === 'Confirmée').length
              const isFull = confirmedCount >= 2

              return (
                <div key={hour} className="flex gap-4">
                  {/* Heure */}
                  <div className="w-20 flex-shrink-0 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-gray-600">
                        {String(hour).padStart(2, '0')}:00
                      </span>
                      {hasReservations && (
                        <span className={`text-xs font-medium mt-1 ${
                          isFull ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {confirmedCount}/2
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Créneaux */}
                  <div className="flex-1 min-h-[60px] border-l-2 border-gray-200 pl-4">
                    {hasReservations ? (
                      <div className={`grid gap-2 ${
                        hourReservations.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                        'grid-cols-1'
                      }`}>
                        {hourReservations.map((res) => (
                          <div
                            key={res.id}
                            onClick={() => setSelectedReservation(res)}
                            className={`
                              p-3 rounded-lg border-l-4 cursor-pointer transition-all
                              ${getStatutColor(res.statut)}
                            `}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">{res.heure}</span>
                                  <Badge className={getPackBadge(res.pack)}>
                                    {res.pack}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">{res.prenom} {res.nom}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{res.telephone}</span>
                                </div>
                                {res.pack === "École" && res.ecole && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    <School className="h-3 w-3" />
                                    <span>{res.ecole}</span>
                                  </div>
                                )}
                                {res.pack === "Domicile" && res.adresse && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{res.adresse}</span>
                                  </div>
                                )}
                              </div>
                              <Badge className={getStatutBadge(res.statut)}>
                                {res.statut}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center text-sm text-gray-400">
                        Disponible
                      </div>
                    )}
                    {isFull && (
                      <div className="mt-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-xs font-medium text-red-700">
                          ⚠️ Créneau complet (2/2)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialog Détails */}
      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Détails de la réservation</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-5">
              {/* Nom du client */}
              <div className="text-center pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedReservation.prenom} {selectedReservation.nom}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Badge className={getStatutBadge(selectedReservation.statut)}>
                    {selectedReservation.statut}
                  </Badge>
                  <Badge className={getPackBadge(selectedReservation.pack)}>
                    {selectedReservation.pack}
                  </Badge>
                </div>
              </div>

              {/* Informations */}
              <div className="space-y-4">
                {/* Date & Heure */}
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date & Heure</p>
                    <p className="text-base font-medium text-gray-900 capitalize">
                      {new Date(selectedReservation.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                    <p className="text-lg font-bold" style={{ color: '#ED7A97' }}>
                      {selectedReservation.heure}
                    </p>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-base font-medium text-gray-900">{selectedReservation.telephone}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-base text-gray-900">{selectedReservation.email}</p>
                  </div>
                </div>

                {/* Adresse */}
                {selectedReservation.adresse && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="text-base text-gray-900">{selectedReservation.adresse}</p>
                    </div>
                  </div>
                )}

                {/* École */}
                {selectedReservation.ecole && (
                  <div className="flex items-start gap-3">
                    <School className="h-5 w-5 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">École</p>
                      <p className="text-base text-gray-900">{selectedReservation.ecole}</p>
                    </div>
                  </div>
                )}

                {/* Type de Service */}
                {selectedReservation.service_type && (
                  <div className="flex items-start gap-3">
                    <School className="h-5 w-5 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Type de Service</p>
                      <p className="text-base text-gray-900">
                        {selectedReservation.service_type === 'diagnostic' 
                          ? 'Diagnostic' 
                          : selectedReservation.service_type === 'diagnostic_traitement' 
                          ? 'Diagnostic + Traitement' 
                          : 'Diagnostic + Traitement + Lotion'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedReservation.notes && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-500 mb-2">Notes</p>
                    <p className="text-sm text-gray-700 italic">{selectedReservation.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  className="flex-1"
                  style={{ backgroundColor: '#ED7A97', color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F29CB1'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ED7A97'}
                  onClick={() => {
                    setEditingReservation(selectedReservation)
                    setSelectedReservation(null)
                    setSelectedDateForEdit(selectedReservation.date)
                    // Force refresh available hours immediately
                    fetchAvailableHoursEdit(selectedReservation.date)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    const date = new Date(selectedReservation.date)
                    const joursSemaine = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
                    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
                    
                    const jourSemaine = joursSemaine[date.getDay()]
                    const jour = date.getDate()
                    const moisNom = mois[date.getMonth()]
                    const annee = date.getFullYear()
                    
                    const dateFormatee = `${jourSemaine.charAt(0).toUpperCase() + jourSemaine.slice(1)} ${jour} ${moisNom} ${annee}`
                    
                    const message = `Bonjour ${selectedReservation.prenom},

*CONFIRMATION DE RENDEZ-VOUS REQUISE*

*Rendez-vous MISSPO :*
━━━━━━━━━━━━━━━━━━━━━
• *Date :* ${dateFormatee}
• *Heure :* ${selectedReservation.heure}
• *Pack :* ${selectedReservation.pack}${selectedReservation.adresse ? `
• *Adresse :* ${selectedReservation.adresse}` : ''}${selectedReservation.ecole ? `
• *École :* ${selectedReservation.ecole}` : ''}${selectedReservation.service_type ? `
• *Type de Service :* ${selectedReservation.service_type === 'diagnostic' ? 'Diagnostic' : selectedReservation.service_type === 'diagnostic_traitement' ? 'Diagnostic + Traitement' : 'Diagnostic + Traitement + Lotion'}` : ''}
━━━━━━━━━━━━━━━━━━━━━

Merci de confirmer votre présence en répondant à ce message.

*Réponses possibles :*
CONFIRMER
ANNULER
REPORTER

Cordialement,
_L'équipe MISSPO_`
                    
                    window.open(`https://wa.me/${selectedReservation.telephone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Modification */}
      <Dialog open={!!editingReservation} onOpenChange={() => setEditingReservation(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la réservation</DialogTitle>
          </DialogHeader>
          {editingReservation && (
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault()
              
              try {
                const response = await fetch(`${API_URL}/admin/appointments/${editingReservation.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(editingReservation),
                })

                const data = await response.json()

                // Check for slot capacity error (409 Conflict)
                if (response.status === 409) {
                  const errorMsg = data.slot_full 
                    ? `Ce créneau est complet (${data.confirmed_count || 2}/2 rendez-vous confirmés). Veuillez choisir un autre horaire.`
                    : data.message || 'Ce créneau est complet (maximum 2 rendez-vous par heure)'
                  
                  toast.error(errorMsg, {
                    duration: 6000,
                    style: {
                      background: '#FBDEE5',
                      color: '#ED7A97',
                      border: '2px solid #ED7A97',
                    },
                  })
                  // Keep form open with data preserved - admin can change time/date
                  return
                }

                if (data.success) {
                  toast.success('Rendez-vous modifié avec succès !', {
                    style: {
                      background: '#E5F4F9',
                      color: '#2da1ca',
                      border: '2px solid #2da1ca',
                    },
                  })
                  setEditingReservation(null)
                  // Recharger les rendez-vous
                  fetchReservationsForDate(selectedDate)
                } else {
                  // Show specific error message from API
                  toast.error(data.message || 'Erreur lors de la modification', {
                    duration: 5000,
                    style: {
                      background: '#FBDEE5',
                      color: '#ED7A97',
                      border: '2px solid #ED7A97',
                    },
                  })
                  // Keep form open with data preserved
                }
              } catch (error) {
                console.error("Erreur:", error)
                toast.error('Erreur de connexion au serveur', {
                  style: {
                    background: '#FBDEE5',
                    color: '#ED7A97',
                    border: '2px solid #ED7A97',
                  },
                })
                // Keep form open on connection error
              }
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-prenom">Prénom</Label>
                  <Input
                    id="edit-prenom"
                    value={editingReservation.prenom}
                    onChange={(e) => setEditingReservation({...editingReservation, prenom: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-nom">Nom</Label>
                  <Input
                    id="edit-nom"
                    value={editingReservation.nom}
                    onChange={(e) => setEditingReservation({...editingReservation, nom: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingReservation.email}
                    onChange={(e) => setEditingReservation({...editingReservation, email: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-telephone">Téléphone</Label>
                  <Input
                    id="edit-telephone"
                    value={editingReservation.telephone}
                    onChange={(e) => setEditingReservation({...editingReservation, telephone: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingReservation.date.split('T')[0]}
                    onChange={(e) => {
                      setEditingReservation({...editingReservation, date: e.target.value})
                      setSelectedDateForEdit(e.target.value)
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-heure">Heure</Label>
                  {availableHoursEdit && !availableHoursEdit.available ? (
                    <div className="mt-1">
                      <Input
                        disabled
                        value="Fermé ce jour"
                        className="bg-gray-100"
                      />
                    </div>
                  ) : (
                    <Select 
                      value={editingReservation.heure} 
                      onValueChange={(value) => setEditingReservation({...editingReservation, heure: value})}
                      disabled={!editingReservation.date}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner une heure" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableHoursEdit ? (
                          generateTimeSlots(availableHoursEdit.openTime, availableHoursEdit.closeTime, availableHoursEdit.bookedSlots).map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="loading" disabled>
                            Chargement...
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  {availableHoursEdit && availableHoursEdit.available && (
                    <p className="text-xs text-gray-500 mt-1">
                      Horaires: {availableHoursEdit.openTime} - {availableHoursEdit.closeTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-pack">Pack</Label>
                  <Select 
                    value={editingReservation.pack} 
                    onValueChange={(value) => setEditingReservation({...editingReservation, pack: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="École">Pack École</SelectItem>
                      <SelectItem value="Domicile">Pack Domicile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-statut">Statut</Label>
                  <Select 
                    value={editingReservation.statut} 
                    onValueChange={(value) => setEditingReservation({...editingReservation, statut: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Confirmée">Confirmée</SelectItem>
                      <SelectItem value="Terminée">Terminée</SelectItem>
                      <SelectItem value="Refusée">Refusée</SelectItem>
                    </SelectContent>
                  </Select>
                  {editingReservation.statut === "Confirmée" && (() => {
                    const sameTimeSlot = reservations.filter(r => 
                      r.date === editingReservation.date && 
                      r.heure === editingReservation.heure &&
                      r.id !== editingReservation.id &&
                      r.statut === "Confirmée"
                    )
                    if (sameTimeSlot.length >= 2) {
                      return (
                        <p className="text-xs text-red-600 mt-1 font-medium">
                          ⚠️ Ce créneau est déjà complet (2/2)
                        </p>
                      )
                    } else if (sameTimeSlot.length === 1) {
                      return (
                        <p className="text-xs text-orange-600 mt-1 font-medium">
                          ⚠️ 1 rendez-vous déjà confirmé sur ce créneau
                        </p>
                      )
                    }
                    return null
                  })()}
                </div>
              </div>

              {editingReservation.pack === "École" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-ecole">École</Label>
                    <Input
                      id="edit-ecole"
                      value={editingReservation.ecole || ""}
                      onChange={(e) => setEditingReservation({...editingReservation, ecole: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-service-type">Type de Service</Label>
                    <Select
                      value={editingReservation.service_type || ""}
                      onValueChange={(value) => setEditingReservation({...editingReservation, service_type: value})}
                    >
                      <SelectTrigger id="edit-service-type" className="mt-1">
                        <SelectValue placeholder="Sélectionner le service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diagnostic">Diagnostic</SelectItem>
                        <SelectItem value="diagnostic_traitement">Diagnostic + Traitement</SelectItem>
                        <SelectItem value="diagnostic_traitement_lotion">Diagnostic + Traitement + Lotion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {editingReservation.pack === "Domicile" && (
                <div>
                  <Label htmlFor="edit-adresse">Adresse</Label>
                  <Input
                    id="edit-adresse"
                    value={editingReservation.adresse || ""}
                    onChange={(e) => setEditingReservation({...editingReservation, adresse: e.target.value})}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingReservation.notes || ""}
                  onChange={(e) => setEditingReservation({...editingReservation, notes: e.target.value})}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingReservation(null)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  style={{ backgroundColor: '#ED7A97' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F29CB1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ED7A97'
                  }}
                >
                  Enregistrer
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  )
}
