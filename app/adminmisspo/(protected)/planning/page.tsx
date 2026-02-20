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
  notes?: string
}

export default function PlanningPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [availableHoursEdit, setAvailableHoursEdit] = useState<{openTime: string, closeTime: string, available: boolean} | null>(null)
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
      const response = await fetch(`http://localhost:8000/api/admin/appointments/available-hours?date=${date}`)
      const data = await response.json()
      
      if (data.success) {
        setAvailableHoursEdit({
          available: data.available,
          openTime: data.openTime || "09:00",
          closeTime: data.closeTime || "18:00"
        })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des horaires:", error)
    }
  }

  // Générer les créneaux horaires disponibles
  const generateTimeSlots = (openTime: string, closeTime: string) => {
    const slots = []
    const [openHour, openMinute] = openTime.split(':').map(Number)
    const [closeHour, closeMinute] = closeTime.split(':').map(Number)
    
    let currentHour = openHour
    let currentMinute = openMinute
    
    while (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute)) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`
      slots.push(timeStr)
      
      // Incrémenter de 30 minutes
      currentMinute += 30
      if (currentMinute >= 60) {
        currentMinute = 0
        currentHour += 1
      }
    }
    
    return slots
  }

  const fetchReservationsForDate = async (date: Date) => {
    try {
      setLoading(true)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      
      const response = await fetch(`http://localhost:8000/api/admin/appointments/by-date?date=${dateStr}`)
      
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

  // Obtenir les jours de la semaine actuelle
  const getWeekDays = (date: Date) => {
    const days = []
    const currentDay = date.getDay() // 0 = dimanche, 1 = lundi, etc.
    const monday = new Date(date)
    monday.setDate(date.getDate() - (currentDay === 0 ? 6 : currentDay - 1))
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)
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
          const response = await fetch(`http://localhost:8000/api/admin/appointments/by-date?date=${dateStr}`)
          
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
    newDate.setDate(newDate.getDate() - 7)
    setSelectedDate(newDate)
  }

  const nextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 7)
    setSelectedDate(newDate)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Planning des Réservations</h1>
        <p className="text-muted-foreground mt-1">Vue journalière avec créneaux horaires</p>
      </div>

      {/* Planning journalier */}
      <Card>
        <CardHeader>
          {/* Sélecteur de semaine */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={previousWeek} className="text-xs md:text-sm px-2 md:px-3">
                <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span className="hidden sm:inline">Semaine précédente</span>
                <span className="sm:hidden">Préc.</span>
              </Button>
              <Button variant="outline" size="sm" onClick={nextWeek} className="text-xs md:text-sm px-2 md:px-3">
                <span className="hidden sm:inline">Semaine suivante</span>
                <span className="sm:hidden">Suiv.</span>
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {weekDays.map((day, index) => {
                const isSelected = day.toDateString() === selectedDate.toDateString()
                const isDayToday = day.toDateString() === new Date().toDateString()
                const dayReservationsCount = getReservationsCountForDate(day)
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      p-1.5 md:p-3 rounded-lg border-2 transition-all text-center
                      ${isSelected 
                        ? 'border-misspo-rose-dark bg-misspo-rose-pale shadow-md' 
                        : 'border-gray-200 hover:border-misspo-rose-light hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="text-[10px] md:text-xs font-medium text-gray-600 mb-0.5 md:mb-1">
                      {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </div>
                    <div className={`text-sm md:text-lg font-bold ${isSelected ? 'text-misspo-rose-dark' : 'text-gray-900'}`}>
                      {day.getDate()}
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1 hidden sm:block">
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
          </div>

          <div className="flex items-center justify-between flex-col md:flex-row gap-3 md:gap-0">
            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
              <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 text-misspo-rose-dark" />
              <div>
                <CardTitle className="text-lg md:text-2xl text-center md:text-left">
                  {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </CardTitle>
                {isToday && (
                  <Badge className="mt-1 bg-misspo-rose-dark text-white">Aujourd'hui</Badge>
                )}
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Choisir une date
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
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Chargement des rendez-vous...</p>
            </div>
          ) : (
            <>
              {/* Grille horaire */}
              <div className="space-y-2">
            {hours.map((hour) => {
              const hourReservations = getReservationForHour(hour)
              const hasReservations = hourReservations.length > 0

              return (
                <div key={hour} className="flex gap-4">
                  {/* Heure */}
                  <div className="w-20 flex-shrink-0 text-right">
                    <span className="text-sm font-semibold text-gray-600">
                      {String(hour).padStart(2, '0')}:00
                    </span>
                  </div>

                  {/* Créneaux */}
                  <div className="flex-1 min-h-[60px] border-l-2 border-gray-200 pl-4">
                    {hasReservations ? (
                      <div className="space-y-2">
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
                  </div>
                </div>
              )
            })}
          </div>
            </>
          )}
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
• *École :* ${selectedReservation.ecole}` : ''}
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
                const response = await fetch(`http://localhost:8000/api/admin/appointments/${editingReservation.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(editingReservation),
                })

                const data = await response.json()

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
                  toast.error('Erreur lors de la modification', {
                    style: {
                      background: '#FBDEE5',
                      color: '#ED7A97',
                      border: '2px solid #ED7A97',
                    },
                  })
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
                    value={editingReservation.date}
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
                          generateTimeSlots(availableHoursEdit.openTime, availableHoursEdit.closeTime).map((time) => (
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
                </div>
              </div>

              {editingReservation.pack === "École" && (
                <div>
                  <Label htmlFor="edit-ecole">École</Label>
                  <Input
                    id="edit-ecole"
                    value={editingReservation.ecole || ""}
                    onChange={(e) => setEditingReservation({...editingReservation, ecole: e.target.value})}
                    className="mt-1"
                  />
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
    </div>
  )
}
