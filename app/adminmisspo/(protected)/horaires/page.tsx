"use client"

import { useState, useEffect } from "react"
import { Clock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

type DaySchedule = {
  id: number
  day: string
  dayFr: string
  isOpen: boolean
  openTime: string
  closeTime: string
}

export default function HorairesPage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Charger les horaires depuis la base de données
  useEffect(() => {
    fetchHoraires()
  }, [])

  const fetchHoraires = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/admin/horaires`)
      const data = await response.json()
      
      if (data.success) {
        setSchedule(data.horaires)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des horaires:", error)
      toast.error('Erreur de chargement des horaires', {
        style: {
          background: '#FBDEE5',
          color: '#ED7A97',
          border: '2px solid #ED7A97',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSchedule = (index: number, field: keyof DaySchedule, value: any) => {
    const newSchedule = [...schedule]
    newSchedule[index] = { ...newSchedule[index], [field]: value }
    setSchedule(newSchedule)
  }

  const saveSchedule = async () => {
    try {
      setSaving(true)
      const response = await fetch(`${API_URL}/admin/horaires`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ horaires: schedule }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Horaires sauvegardés avec succès !', {
          style: {
            background: '#E5F4F9',
            color: '#2da1ca',
            border: '2px solid #2da1ca',
          },
        })
        // Recharger les horaires
        fetchHoraires()
      } else {
        toast.error('Erreur lors de la sauvegarde', {
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
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Chargement des horaires...</p>
      </div>
    )
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
                disabled={saving}
                style={{ backgroundColor: '#ED7A97' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F29CB1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ED7A97'
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedule.map((day, index) => (
              <div key={day.id} className="p-4 border rounded-lg" style={{ backgroundColor: day.isOpen ? '#FBDEE5' : '#f3f4f6' }}>
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
