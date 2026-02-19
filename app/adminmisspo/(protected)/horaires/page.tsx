"use client"

import { useState } from "react"
import { Clock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

type DaySchedule = {
  day: string
  dayFr: string
  isOpen: boolean
  openTime: string
  closeTime: string
}

export default function HorairesPage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: "monday", dayFr: "Lundi", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { day: "tuesday", dayFr: "Mardi", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { day: "wednesday", dayFr: "Mercredi", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { day: "thursday", dayFr: "Jeudi", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { day: "friday", dayFr: "Vendredi", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { day: "saturday", dayFr: "Samedi", isOpen: true, openTime: "09:00", closeTime: "14:00" },
    { day: "sunday", dayFr: "Dimanche", isOpen: false, openTime: "09:00", closeTime: "18:00" },
  ])

  const updateSchedule = (index: number, field: keyof DaySchedule, value: any) => {
    const newSchedule = [...schedule]
    newSchedule[index] = { ...newSchedule[index], [field]: value }
    setSchedule(newSchedule)
  }

  const saveSchedule = () => {
    // Logique de sauvegarde à implémenter
    console.log("Sauvegarder horaires", schedule)
    alert("Horaires sauvegardés avec succès !")
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Horaires</h1>
        <p className="text-muted-foreground mt-1">Configurez vos horaires d'ouverture</p>
      </div>

      <div>
        {/* Horaires hebdomadaires */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#ED7A97]" />
                Horaires de la semaine
              </CardTitle>
              <Button
                onClick={saveSchedule}
                style={{ backgroundColor: '#ED7A97' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F29CB1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ED7A97'
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedule.map((day, index) => (
              <div key={day.day} className="p-4 border rounded-lg" style={{ backgroundColor: day.isOpen ? '#FBDEE5' : '#f3f4f6' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={day.isOpen}
                      onCheckedChange={(checked) => updateSchedule(index, 'isOpen', checked)}
                    />
                    <span className="font-semibold text-gray-900">{day.dayFr}</span>
                  </div>
                  {!day.isOpen && (
                    <span className="text-sm text-gray-500 font-medium">Fermé</span>
                  )}
                </div>
                
                {day.isOpen && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-600">Ouverture</Label>
                      <Input
                        type="time"
                        value={day.openTime}
                        onChange={(e) => updateSchedule(index, 'openTime', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Fermeture</Label>
                      <Input
                        type="time"
                        value={day.closeTime}
                        onChange={(e) => updateSchedule(index, 'closeTime', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
