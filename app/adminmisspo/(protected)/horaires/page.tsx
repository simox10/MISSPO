"use client"

import { useState, useEffect } from "react"
import { Clock, Save, Plus, Edit, Trash2, X, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
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
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle')
  
  // Creneaux state
  const [creneaux, setCreneaux] = useState<Creneau[]>([])
  const [editingCreneau, setEditingCreneau] = useState<Creneau | null>(null)
  const [showInlineAdd, setShowInlineAdd] = useState(false)
  const [creneauForm, setCreneauForm] = useState({
    jour_semaine: 'lundi',
    heure_debut: '09:00',
    heure_fin: '10:00',
  })

  // Auto-save timer
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null)

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
      toast.error('Erreur de chargement des horaires')
    } finally {
      setLoading(false)
    }
  }

  const updateSchedule = (index: number, field: keyof DaySchedule, value: any) => {
    const newSchedule = [...schedule]
    newSchedule[index] = { ...newSchedule[index], [field]: value }
    setSchedule(newSchedule)
    
    // Trigger auto-save
    triggerAutoSave(newSchedule)
  }

  const triggerAutoSave = (scheduleData: DaySchedule[]) => {
    if (saveTimer) {
      clearTimeout(saveTimer)
    }
    
    setAutoSaveStatus('saving')
    
    const timer = setTimeout(() => {
      saveScheduleAuto(scheduleData)
    }, 1500)
    
    setSaveTimer(timer)
  }

  const saveScheduleAuto = async (scheduleData: DaySchedule[]) => {
    try {
      const response = await fetch(`${API_URL}/admin/horaires`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ horaires: scheduleData }),
      })

      const data = await response.json()

      if (data.success) {
        setAutoSaveStatus('saved')
        setTimeout(() => setAutoSaveStatus('idle'), 2000)
      }
    } catch (error) {
      console.error("Erreur:", error)
      setAutoSaveStatus('idle')
    }
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
        toast.success('Horaires sauvegardés avec succès !')
        fetchHoraires()
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error('Erreur de connexion au serveur')
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
        toast.success('Créneau bloqué ajouté')
        setShowInlineAdd(false)
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
      toast.error('Erreur de connexion')
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
        toast.success('Créneau mis à jour')
        setEditingCreneau(null)
        fetchCreneaux()
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error('Erreur de connexion')
    }
  }

  const handleDeleteCreneau = async (id: number) => {
    if (!confirm('Supprimer ce créneau bloqué ?')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/admin/creneaux/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Créneau supprimé')
        fetchCreneaux()
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error('Erreur de connexion')
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
        <div className="text-center">
          <Clock className="h-12 w-12 animate-spin text-misspo-rose-dark mx-auto mb-3" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Modern Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-misspo-rose-pale rounded-xl">
              <Clock className="h-6 w-6 text-misspo-rose-dark" />
            </div>
            Gestion des Horaires
          </h1>
          <p className="text-gray-500 text-sm mt-1">Configurez vos horaires d'ouverture et créneaux bloqués</p>
        </div>
        
        {/* Auto-save indicator */}
        <div className="flex items-center gap-3">
          {autoSaveStatus === 'saving' && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
              Sauvegarde...
            </div>
          )}
          {autoSaveStatus === 'saved' && (
            <div className="flex items-center gap-2 text-sm text-misspo-blue-dark">
              <CheckCircle2 className="h-4 w-4" />
              Sauvegardé
            </div>
          )}
          <Button
            onClick={saveSchedule}
            disabled={saving}
            className="bg-misspo-rose-dark hover:bg-misspo-rose text-white shadow-lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Split-screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
        {/* Left: Weekly Schedule */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-misspo-rose-pale/30 flex flex-col overflow-hidden">
          <CardHeader className="border-b bg-white/50 backdrop-blur py-3">
            <CardTitle className="flex items-center gap-2 text-misspo-rose-dark text-lg">
              <Clock className="h-5 w-5" />
              Horaires Hebdomadaires
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-2">
              {schedule.map((day, index) => (
                <div
                  key={day.id}
                  className={`${index === 6 ? 'col-span-2' : ''} p-3 rounded-lg border-2 transition-all duration-200 ${
                    day.isOpen
                      ? 'bg-white border-misspo-rose-light hover:border-misspo-rose hover:shadow-md'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={day.isOpen}
                        onCheckedChange={(checked) => updateSchedule(index, 'isOpen', checked)}
                        className="data-[state=checked]:bg-misspo-rose-dark"
                      />
                      <span className="font-semibold text-gray-900">{day.dayFr}</span>
                    </div>
                    {!day.isOpen && (
                      <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-full">
                        Fermé
                      </span>
                    )}
                  </div>
                  
                  {day.isOpen && (
                    <div className="grid grid-cols-2 gap-2 ml-8">
                      <div>
                        <Label className="text-xs text-gray-600">Ouverture</Label>
                        <Input
                          type="time"
                          value={day.openTime}
                          onChange={(e) => updateSchedule(index, 'openTime', e.target.value)}
                          className="mt-1 h-9 text-sm border-misspo-rose-light focus:border-misspo-rose-dark focus:ring-misspo-rose-dark"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Fermeture</Label>
                        <Input
                          type="time"
                          value={day.closeTime}
                          onChange={(e) => updateSchedule(index, 'closeTime', e.target.value)}
                          className="mt-1 h-9 text-sm border-misspo-rose-light focus:border-misspo-rose-dark focus:ring-misspo-rose-dark"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: Blocked Slots */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-red-50/30 flex flex-col overflow-hidden">
          <CardHeader className="border-b bg-white/50 backdrop-blur py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-red-600 text-lg">
                <X className="h-5 w-5" />
                Créneaux Bloqués
              </CardTitle>
              <Button
                onClick={() => setShowInlineAdd(!showInlineAdd)}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto flex-1">
            {/* Inline Add Form */}
            {showInlineAdd && (
              <div className="mb-4 p-3 bg-white border-2 border-red-300 rounded-lg">
                <div className="space-y-2">
                  <Select
                    value={creneauForm.jour_semaine}
                    onValueChange={(value) => setCreneauForm({ ...creneauForm, jour_semaine: value })}
                  >
                    <SelectTrigger className="border-red-300 h-9 text-sm">
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
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="time"
                      value={creneauForm.heure_debut}
                      onChange={(e) => setCreneauForm({ ...creneauForm, heure_debut: e.target.value })}
                      className="border-red-300 h-9 text-sm"
                    />
                    <Input
                      type="time"
                      value={creneauForm.heure_fin}
                      onChange={(e) => setCreneauForm({ ...creneauForm, heure_fin: e.target.value })}
                      className="border-red-300 h-9 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddCreneau}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white h-9 text-sm"
                    >
                      Ajouter
                    </Button>
                    <Button
                      onClick={() => setShowInlineAdd(false)}
                      variant="outline"
                      className="flex-1 h-9 text-sm"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Creneaux List */}
            {groupCreneauxByDay().length === 0 && !showInlineAdd ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-gray-500 font-medium">Aucun créneau bloqué</p>
                <p className="text-sm text-gray-400 mt-1">Cliquez sur "Ajouter" pour créer un créneau</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groupCreneauxByDay().map((group) => (
                  <div key={group.day}>
                    <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wide">
                      {group.dayFr}
                    </h3>
                    <div className="space-y-2">
                      {group.creneaux.map((creneau) => (
                        <div
                          key={creneau.id}
                          className="flex items-center justify-between bg-white p-2.5 rounded-lg border-2 border-red-200 hover:border-red-300 hover:shadow-md transition-all"
                        >
                          {editingCreneau?.id === creneau.id ? (
                            <div className="flex-1 flex items-center gap-2">
                              <Input
                                type="time"
                                value={creneauForm.heure_debut}
                                onChange={(e) => setCreneauForm({ ...creneauForm, heure_debut: e.target.value })}
                                className="w-24 h-8 text-sm"
                              />
                              <span className="text-sm">-</span>
                              <Input
                                type="time"
                                value={creneauForm.heure_fin}
                                onChange={(e) => setCreneauForm({ ...creneauForm, heure_fin: e.target.value })}
                                className="w-24 h-8 text-sm"
                              />
                              <Button
                                size="sm"
                                onClick={handleUpdateCreneau}
                                className="bg-red-600 hover:bg-red-700 h-8"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingCreneau(null)}
                                className="h-8"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <div className="p-1 bg-red-100 rounded-lg">
                                  <X className="h-4 w-4 text-red-600" />
                                </div>
                                <span className="font-medium text-gray-900 text-sm">
                                  {creneau.heure_debut.substring(0, 5)} - {creneau.heure_fin.substring(0, 5)}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => openEditDialog(creneau)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteCreneau(creneau.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
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

      {/* Info Banner */}
      <Card className="border-red-300 bg-red-50/50">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Les modifications sont sauvegardées automatiquement
              </p>
              <p className="text-xs text-gray-700 mt-1">
                Les créneaux bloqués seront automatiquement exclus du système de réservation en ligne
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
