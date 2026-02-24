"use client"

import { useState, useEffect } from "react"
import { Clock, Save, Plus, Edit, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

type Creneau = {
  id: number
  jour_semaine: string
  heure_debut: string
  heure_fin: string
  disponible: boolean
}

export default function HorairesPage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Creneaux state
  const [creneaux, setCreneaux] = useState<Creneau[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCreneau, setEditingCreneau] = useState<Creneau | null>(null)
  const [creneauForm, setCreneauForm] = useState({
    jour_semaine: 'lundi',
    heure_debut: '09:00',
    heure_fin: '10:00',
  })

  // Charger les horaires depuis la base de données
  useEffect(() => {
    fetchHoraires()
    fetchCreneaux()
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

  // Creneaux functions
  const fetchCreneaux = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/creneaux`)
      const data = await response.json()
      
      if (data.success) {
        setCreneaux(data.creneaux)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des créneaux:", error)
    }
  }

  const groupCreneauxByDay = () => {
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
    const daysFr = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    
    return days.map((day, index) => ({
      day,
      dayFr: daysFr[index],
      creneaux: creneaux.filter(c => c.jour_semaine === day)
    })).filter(group => group.creneaux.length > 0)
  }

  const handleAddCreneau = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/creneaux`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creneauForm),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Créneau bloqué ajouté avec succès')
        setShowAddDialog(false)
        fetchCreneaux()
        setCreneauForm({
          jour_semaine: 'lundi',
          heure_debut: '09:00',
          heure_fin: '10:00',
        })
      } else {
        toast.error('Erreur lors de l\'ajout')
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error('Erreur de connexion au serveur')
    }
  }

  const handleUpdateCreneau = async () => {
    if (!editingCreneau) return

    try {
      const response = await fetch(`${API_URL}/admin/creneaux/${editingCreneau.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creneauForm),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Créneau mis à jour avec succès')
        setEditingCreneau(null)
        fetchCreneaux()
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error('Erreur de connexion au serveur')
    }
  }

  const handleDeleteCreneau = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce créneau bloqué ?')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/admin/creneaux/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Créneau supprimé avec succès')
        fetchCreneaux()
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error('Erreur de connexion au serveur')
    }
  }

  const openEditDialog = (creneau: Creneau) => {
    setEditingCreneau(creneau)
    setCreneauForm({
      jour_semaine: creneau.jour_semaine,
      heure_debut: creneau.heure_debut.substring(0, 5),
      heure_fin: creneau.heure_fin.substring(0, 5),
    })
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
        <Card className="mb-6">
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

        {/* Créneaux Bloqués */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                Créneaux Bloqués
              </CardTitle>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {groupCreneauxByDay().length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <X className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Aucun créneau bloqué</p>
              </div>
            ) : (
              <div className="space-y-4">
                {groupCreneauxByDay().map((group) => (
                  <div key={group.day} className="border rounded-lg p-4 bg-red-50">
                    <h3 className="font-semibold text-gray-900 mb-3">{group.dayFr}</h3>
                    <div className="space-y-2">
                      {group.creneaux.map((creneau) => (
                        <div
                          key={creneau.id}
                          className="flex items-center justify-between bg-white p-3 rounded border"
                        >
                          <div className="flex items-center gap-3">
                            <X className="h-4 w-4 text-red-500" />
                            <span className="font-medium">
                              {creneau.heure_debut.substring(0, 5)} - {creneau.heure_fin.substring(0, 5)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => openEditDialog(creneau)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteCreneau(creneau.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Creneau Dialog */}
      <Dialog open={showAddDialog || !!editingCreneau} onOpenChange={() => {
        setShowAddDialog(false)
        setEditingCreneau(null)
        setCreneauForm({
          jour_semaine: 'lundi',
          heure_debut: '09:00',
          heure_fin: '10:00',
        })
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCreneau ? 'Modifier le créneau bloqué' : 'Ajouter un créneau bloqué'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Jour de la semaine</Label>
              <Select
                value={creneauForm.jour_semaine}
                onValueChange={(value) => setCreneauForm({ ...creneauForm, jour_semaine: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lundi">Lundi</SelectItem>
                  <SelectItem value="mardi">Mardi</SelectItem>
                  <SelectItem value="mercredi">Mercredi</SelectItem>
                  <SelectItem value="jeudi">Jeudi</SelectItem>
                  <SelectItem value="vendredi">Vendredi</SelectItem>
                  <SelectItem value="samedi">Samedi</SelectItem>
                  <SelectItem value="dimanche">Dimanche</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Heure début</Label>
                <Input
                  type="time"
                  value={creneauForm.heure_debut}
                  onChange={(e) => setCreneauForm({ ...creneauForm, heure_debut: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Heure fin</Label>
                <Input
                  type="time"
                  value={creneauForm.heure_fin}
                  onChange={(e) => setCreneauForm({ ...creneauForm, heure_fin: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false)
                setEditingCreneau(null)
              }}
            >
              Annuler
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={editingCreneau ? handleUpdateCreneau : handleAddCreneau}
            >
              {editingCreneau ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
