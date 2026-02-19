"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Phone, MapPin, School } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
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
import { reservations, type Reservation } from "../../data/reservations"

export default function PlanningPage() {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 20)) // 20 février 2026
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  const getReservationsForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    return reservations.filter(r => r.date === dateStr).sort((a, b) => a.heure.localeCompare(b.heure))
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
    }
    return colors[statut as keyof typeof colors] || "border-l-gray-500 bg-gray-50"
  }

  const getStatutBadge = (statut: string) => {
    const variants = {
      "Confirmée": "bg-green-100 text-green-700",
      "En attente": "bg-yellow-100 text-yellow-700",
      "Annulée": "bg-red-100 text-red-700",
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
                const dayReservationsCount = getReservationsForDate(day).length
                
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
        </CardContent>
      </Card>

      {/* Dialog Détails */}
      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Client</p>
                <p className="text-base font-semibold">
                  {selectedReservation.prenom} {selectedReservation.nom}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date & Heure</p>
                <p className="text-base">
                  {new Date(selectedReservation.date).toLocaleDateString('fr-FR')} à {selectedReservation.heure}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contact</p>
                <p className="text-base">{selectedReservation.telephone}</p>
                <p className="text-sm text-gray-600">{selectedReservation.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pack</p>
                <Badge className={getPackBadge(selectedReservation.pack)}>
                  {selectedReservation.pack}
                </Badge>
              </div>
              {selectedReservation.adresse && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Adresse</p>
                  <p className="text-base">{selectedReservation.adresse}</p>
                </div>
              )}
              {selectedReservation.ecole && (
                <div>
                  <p className="text-sm font-medium text-gray-500">École</p>
                  <p className="text-base">{selectedReservation.ecole}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <Badge className={getStatutBadge(selectedReservation.statut)}>
                  {selectedReservation.statut}
                </Badge>
              </div>
              {selectedReservation.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-base">{selectedReservation.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
