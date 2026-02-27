"use client"

import { useState, useEffect } from "react"
import { Clock, Save, Plus, Edit, Trash2, X, CheckCircle2, AlertCircle, Repeat, Calendar, CalendarClock, StickyNote, Ban, MoreVertical, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
  date_specifique: string | null
  note: string | null
}

export default function HorairesPage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle')
  const [activeTab, setActiveTab] = useState<string>('horaires')
  
  // Creneaux state
  const [creneaux, setCreneaux] = useState<Creneau[]>([])
  const [editingCreneau, setEditingCreneau] = useState<Creneau | null>(null)
  const [showInlineAdd, setShowInlineAdd] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>(['lundi'])
  const [creneauForm, setCreneauForm] = useState({
    jour_semaine: 'lundi',
    jours_semaine: ['lundi'],
    heure_debut: '09:00',
    heure_fin: '10:00',
    date_specifique: '',
    note: '',
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

  const groupCreneauxByType = () => {
    const recurring = creneaux.filter(c => !c.date_specifique)
    const specific = creneaux.filter(c => c.date_specifique)
    
    return { recurring, specific }
  }

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const formatDayName = (jour: string | null | undefined): string => {
    if (!jour) return ''
    return jour.charAt(0).toUpperCase() + jour.slice(1)
  }

  const handleAddCreneau = async () => {
    try {
      const payload = selectedDays.length > 1 
        ? {
            jours_semaine: selectedDays,
            heure_debut: creneauForm.heure_debut,
            heure_fin: creneauForm.heure_fin,
            date_specifique: creneauForm.date_specifique || null,
            note: creneauForm.note || null,
          }
        : {
            jour_semaine: selectedDays[0],
            heure_debut: creneauForm.heure_debut,
            heure_fin: creneauForm.heure_fin,
            date_specifique: creneauForm.date_specifique || null,
            note: creneauForm.note || null,
          }

      const response = await fetch(`${API_URL}/admin/creneaux`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message || 'Créneau bloqué ajouté')
        setShowInlineAdd(false)
        setShowBottomSheet(false)
        fetchCreneaux()
        setSelectedDays(['lundi'])
        setCreneauForm({
          jour_semaine: 'lundi',
          jours_semaine: ['lundi'],
          heure_debut: '09:00',
          heure_fin: '10:00',
          date_specifique: '',
          note: '',
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
        body: JSON.stringify({
          jour_semaine: creneauForm.jour_semaine,
          heure_debut: creneauForm.heure_debut,
          heure_fin: creneauForm.heure_fin,
          date_specifique: creneauForm.date_specifique || null,
          note: creneauForm.note || null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Créneau mis à jour')
        setEditingCreneau(null)
        setShowBottomSheet(false)
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
    setSelectedDays([creneau.jour_semaine])
    setCreneauForm({
      jour_semaine: creneau.jour_semaine,
      jours_semaine: [creneau.jour_semaine],
      heure_debut: creneau.heure_debut.substring(0, 5),
      heure_fin: creneau.heure_fin.substring(0, 5),
      date_specifique: creneau.date_specifique || '',
      note: creneau.note || '',
    })
    setShowBottomSheet(true)
  }

  const openAddDialog = () => {
    setEditingCreneau(null)
    setSelectedDays(['lundi'])
    setCreneauForm({
      jour_semaine: 'lundi',
      jours_semaine: ['lundi'],
      heure_debut: '09:00',
      heure_fin: '10:00',
      date_specifique: '',
      note: '',
    })
    setShowBottomSheet(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-12 w-12 animate-spin text-misspo-blue-dark mx-auto mb-3" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      {/* Modern Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Horaires
          </h1>
          <p className="text-gray-500 text-sm mt-1">Configurez vos horaires d'ouverture et créneaux bloqués</p>
        </div>
        
        {/* Auto-save indicator - Desktop only */}
        <div className="hidden md:flex items-center gap-3">
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
            className="bg-misspo-blue-dark hover:bg-misspo-blue text-white shadow-lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Tab Navigation for Mobile, Split-screen for Desktop */}
      <Tabs defaultValue="horaires" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:hidden">
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
          <TabsTrigger value="creneaux">Créneaux Bloqués</TabsTrigger>
        </TabsList>

        {/* Desktop: Split-screen Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
        {/* Left: Weekly Schedule */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-misspo-blue-pale/30 flex flex-col overflow-hidden">
          <CardHeader className="border-b bg-white/50 backdrop-blur py-3">
            <CardTitle className="flex items-center gap-2 text-misspo-blue-dark text-lg">
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
                      ? 'bg-white border-misspo-blue-light hover:border-misspo-blue hover:shadow-md'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={day.isOpen}
                        onCheckedChange={(checked) => updateSchedule(index, 'isOpen', checked)}
                        className="data-[state=checked]:bg-misspo-blue-dark"
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
                          className="mt-1 h-9 text-sm border-misspo-blue-light focus:border-misspo-blue-dark focus:ring-misspo-blue-dark"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Fermeture</Label>
                        <Input
                          type="time"
                          value={day.closeTime}
                          onChange={(e) => updateSchedule(index, 'closeTime', e.target.value)}
                          className="mt-1 h-9 text-sm border-misspo-blue-light focus:border-misspo-blue-dark focus:ring-misspo-blue-dark"
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
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-misspo-rose-pale/30 flex flex-col overflow-hidden">
          <CardHeader className="border-b bg-white/50 backdrop-blur py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-misspo-rose-dark text-lg">
                <X className="h-5 w-5" />
                Créneaux Bloqués
              </CardTitle>
              <Button
                onClick={() => setShowInlineAdd(!showInlineAdd)}
                size="sm"
                className="bg-misspo-rose-dark hover:bg-misspo-rose text-white h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto flex-1">
            {/* Inline Add Form */}
            {showInlineAdd && (
              <div className="mb-4 p-4 bg-white border-2 border-misspo-rose rounded-lg space-y-3">
                {/* Date Picker (Optional) */}
                <div>
                  <Label className="text-xs text-gray-700 mb-1 flex items-center gap-1.5">
                    <CalendarClock className="h-4 w-4 text-gray-500" />
                    Date spécifique (optionnel)
                  </Label>
                  <Input
                    type="date"
                    value={creneauForm.date_specifique}
                    onChange={(e) => setCreneauForm({ ...creneauForm, date_specifique: e.target.value })}
                    className="border-misspo-rose h-9 text-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Laissez vide pour un blocage récurrent chaque semaine
                  </p>
                </div>

                {/* Multi-Day Selector */}
                <div>
                  <Label className="text-xs text-gray-700 mb-2 block">
                    Jour(s) de la semaine
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'lundi', label: 'Lun' },
                      { key: 'mardi', label: 'Mar' },
                      { key: 'mercredi', label: 'Mer' },
                      { key: 'jeudi', label: 'Jeu' },
                      { key: 'vendredi', label: 'Ven' },
                      { key: 'samedi', label: 'Sam' },
                      { key: 'dimanche', label: 'Dim' },
                    ].map((day) => (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => toggleDay(day.key)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedDays.includes(day.key)
                            ? 'bg-misspo-rose-dark text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-700 mb-1 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-500" />
                      Début
                    </Label>
                    <Input
                      type="time"
                      value={creneauForm.heure_debut}
                      onChange={(e) => setCreneauForm({ ...creneauForm, heure_debut: e.target.value })}
                      className="border-misspo-rose h-9 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-700 mb-1 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-500" />
                      Fin
                    </Label>
                    <Input
                      type="time"
                      value={creneauForm.heure_fin}
                      onChange={(e) => setCreneauForm({ ...creneauForm, heure_fin: e.target.value })}
                      className="border-misspo-rose h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Note (Optional) */}
                <div>
                  <Label className="text-xs text-gray-700 mb-1 flex items-center gap-1.5">
                    <StickyNote className="h-4 w-4 text-gray-500" />
                    Note (optionnel)
                  </Label>
                  <Input
                    type="text"
                    placeholder="Ex: Déjeuner, Formation, Vacances..."
                    value={creneauForm.note}
                    onChange={(e) => setCreneauForm({ ...creneauForm, note: e.target.value })}
                    className="border-misspo-rose h-9 text-sm"
                    maxLength={255}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleAddCreneau}
                    disabled={selectedDays.length === 0}
                    className="flex-1 bg-misspo-rose-dark hover:bg-misspo-rose text-white h-9 text-sm"
                  >
                    Ajouter {selectedDays.length > 1 && `(${selectedDays.length} jours)`}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowInlineAdd(false)
                      setSelectedDays(['lundi'])
                    }}
                    variant="outline"
                    className="flex-1 h-9 text-sm"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            {/* Creneaux List */}
            {creneaux.length === 0 && !showInlineAdd ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-misspo-rose-pale rounded-full mb-4">
                  <Ban className="h-8 w-8 text-misspo-rose-dark" />
                </div>
                <p className="text-gray-500 font-medium">Aucun créneau bloqué</p>
                <p className="text-sm text-gray-400 mt-1">Cliquez sur "Ajouter" pour créer un créneau</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Recurring Blocks */}
                {groupCreneauxByType().recurring.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-px flex-1 bg-misspo-rose-light"></div>
                      <h3 className="font-semibold text-misspo-rose-dark text-xs uppercase tracking-wide flex items-center gap-1.5">
                        <Repeat className="h-4 w-4" />
                        Blocages Récurrents
                      </h3>
                      <div className="h-px flex-1 bg-misspo-rose-light"></div>
                    </div>
                    <div className="space-y-2">
                      {groupCreneauxByDay().map((group) => {
                        const recurringInDay = group.creneaux.filter(c => !c.date_specifique)
                        if (recurringInDay.length === 0) return null
                        
                        return (
                          <div key={group.day}>
                            <h4 className="font-semibold text-gray-600 mb-1.5 text-xs">
                              {group.dayFr}
                            </h4>
                            <div className="space-y-1.5">
                              {recurringInDay.map((creneau) => (
                                <div
                                  key={creneau.id}
                                  className="flex items-center justify-between bg-white p-2.5 rounded-lg border-2 border-misspo-rose-light hover:border-misspo-rose hover:shadow-md transition-all"
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
                                        className="bg-misspo-rose-dark hover:bg-misspo-rose h-8"
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
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <div className="p-1 bg-misspo-rose-pale rounded-lg">
                                            <Repeat className="h-4 w-4 text-misspo-rose-dark" />
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-900 text-sm">
                                              {creneau.heure_debut.substring(0, 5)} - {creneau.heure_fin.substring(0, 5)}
                                            </span>
                                            {creneau.note && (
                                              <p className="text-xs text-gray-500 mt-0.5">{creneau.note}</p>
                                            )}
                                          </div>
                                        </div>
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
                                          className="h-8 w-8 p-0 text-misspo-rose-dark hover:text-misspo-rose hover:bg-misspo-rose-pale"
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
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Specific Date Blocks */}
                {groupCreneauxByType().specific.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-px flex-1 bg-orange-200"></div>
                      <h3 className="font-semibold text-orange-700 text-xs uppercase tracking-wide flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        Blocages Ponctuels
                      </h3>
                      <div className="h-px flex-1 bg-orange-200"></div>
                    </div>
                    <div className="space-y-1.5">
                      {groupCreneauxByType().specific
                        .sort((a, b) => new Date(a.date_specifique!).getTime() - new Date(b.date_specifique!).getTime())
                        .map((creneau) => {
                          const date = new Date(creneau.date_specifique!)
                          const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
                          const formattedDate = `${dayNames[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                          
                          return (
                            <div
                              key={creneau.id}
                              className="flex items-center justify-between bg-white p-2.5 rounded-lg border-2 border-orange-200 hover:border-orange-300 hover:shadow-md transition-all"
                            >
                              {editingCreneau?.id === creneau.id ? (
                                <div className="flex-1 flex items-center gap-2">
                                  <Input
                                    type="date"
                                    value={creneauForm.date_specifique}
                                    onChange={(e) => setCreneauForm({ ...creneauForm, date_specifique: e.target.value })}
                                    className="w-32 h-8 text-sm"
                                  />
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
                                    className="bg-orange-600 hover:bg-orange-700 h-8"
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
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <div className="p-1 bg-orange-100 rounded-lg">
                                        <Calendar className="h-4 w-4 text-orange-600" />
                                      </div>
                                      <div>
                                        <span className="font-medium text-gray-900 text-sm block">
                                          {formattedDate}
                                        </span>
                                        <span className="text-xs text-gray-600">
                                          {creneau.heure_debut.substring(0, 5)} - {creneau.heure_fin.substring(0, 5)}
                                        </span>
                                        {creneau.note && (
                                          <p className="text-xs text-gray-500 mt-0.5">{creneau.note}</p>
                                        )}
                                      </div>
                                    </div>
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
                                      className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                      onClick={() => handleDeleteCreneau(creneau.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
        {/* End Desktop Split-screen */}

        {/* Mobile: Tab Contents */}
        <TabsContent value="horaires" className="lg:hidden mt-4">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-misspo-blue-pale/30">
            <CardHeader className="border-b bg-white/50 backdrop-blur py-3">
              <CardTitle className="flex items-center gap-2 text-misspo-blue-dark text-lg">
                <Clock className="h-5 w-5" />
                Horaires Hebdomadaires
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {schedule.map((day, index) => (
                  <div
                    key={day.id}
                    className={`${index === 6 ? 'col-span-2' : ''} p-3 rounded-lg border-2 transition-all duration-200 ${
                      day.isOpen
                        ? 'bg-white border-misspo-blue-light'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={day.isOpen}
                          onCheckedChange={(checked) => updateSchedule(index, 'isOpen', checked)}
                          className="data-[state=checked]:bg-misspo-blue-dark"
                        />
                        <span className="font-semibold text-gray-900 text-sm">
                          {index === 6 ? day.dayFr : day.dayFr.substring(0, 3)}
                        </span>
                      </div>
                      {!day.isOpen && (
                        <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-full">
                          Fermé
                        </span>
                      )}
                    </div>
                    
                    {day.isOpen && (
                      <div className="grid grid-cols-2 gap-1.5">
                        <Input
                          type="time"
                          value={day.openTime}
                          onChange={(e) => updateSchedule(index, 'openTime', e.target.value)}
                          className="h-9 text-xs border-misspo-blue-light focus:border-misspo-blue-dark focus:ring-misspo-blue-dark"
                        />
                        <Input
                          type="time"
                          value={day.closeTime}
                          onChange={(e) => updateSchedule(index, 'closeTime', e.target.value)}
                          className="h-9 text-xs border-misspo-blue-light focus:border-misspo-blue-dark focus:ring-misspo-blue-dark"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creneaux" className="lg:hidden mt-4">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-misspo-rose-pale/30">
            <CardHeader className="border-b bg-white/50 backdrop-blur py-3">
              <CardTitle className="flex items-center gap-2 text-misspo-rose-dark text-lg">
                <X className="h-5 w-5" />
                Créneaux Bloqués
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {creneaux.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-misspo-rose-pale rounded-full mb-4">
                    <Ban className="h-8 w-8 text-misspo-rose-dark" />
                  </div>
                  <p className="text-gray-500 font-medium">Aucun créneau bloqué</p>
                  <p className="text-sm text-gray-400 mt-1">Appuyez sur + pour créer</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Recurring Blocks */}
                  {groupCreneauxByType().recurring.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-misspo-rose-dark text-sm mb-2 flex items-center gap-1.5 sticky top-0 bg-white/90 backdrop-blur py-2 -mx-4 px-4">
                        <Repeat className="h-4 w-4" />
                        BLOCAGES RÉCURRENTS ({groupCreneauxByType().recurring.length})
                      </h3>
                      <div className="space-y-2">
                        {groupCreneauxByType().recurring.map((creneau) => (
                          <div
                            key={creneau.id}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border-2 border-misspo-rose-light"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Repeat className="h-4 w-4 text-misspo-rose-dark" />
                                <div>
                                  <span className="font-medium text-gray-900 text-sm block">
                                    Chaque {formatDayName(creneau.jour_semaine)}
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {creneau.heure_debut.substring(0, 5)} - {creneau.heure_fin.substring(0, 5)}
                                  </span>
                                  {creneau.note && (
                                    <p className="text-xs text-gray-500 mt-0.5">{creneau.note}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditDialog(creneau)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteCreneau(creneau.id)} className="text-misspo-rose-dark">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specific Date Blocks */}
                  {groupCreneauxByType().specific.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-orange-700 text-sm mb-2 flex items-center gap-1.5 sticky top-0 bg-white/90 backdrop-blur py-2 -mx-4 px-4">
                        <Calendar className="h-4 w-4" />
                        BLOCAGES PONCTUELS ({groupCreneauxByType().specific.length})
                      </h3>
                      <div className="space-y-2">
                        {groupCreneauxByType().specific
                          .sort((a, b) => new Date(a.date_specifique!).getTime() - new Date(b.date_specifique!).getTime())
                          .map((creneau) => {
                            const date = new Date(creneau.date_specifique!)
                            const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
                            const formattedDate = `${dayNames[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                            
                            return (
                              <div
                                key={creneau.id}
                                className="flex items-center justify-between bg-white p-3 rounded-lg border-2 border-orange-200"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-orange-600" />
                                    <div>
                                      <span className="font-medium text-gray-900 text-sm block">
                                        {formattedDate}
                                      </span>
                                      <span className="text-xs text-gray-600">
                                        {creneau.heure_debut.substring(0, 5)} - {creneau.heure_fin.substring(0, 5)}
                                      </span>
                                      {creneau.note && (
                                        <p className="text-xs text-gray-500 mt-0.5">{creneau.note}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEditDialog(creneau)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteCreneau(creneau.id)} className="text-orange-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Supprimer
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Action Button (Mobile Only - Créneaux Tab Only) */}
      {activeTab === 'creneaux' && (
        <button
          onClick={openAddDialog}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-misspo-rose-dark hover:bg-misspo-rose text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Bottom Sheet for Add/Edit */}
      <Sheet open={showBottomSheet} onOpenChange={setShowBottomSheet}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingCreneau ? 'Modifier le Blocage' : 'Nouveau Blocage'}
            </SheetTitle>
            <SheetDescription>
              {editingCreneau ? 'Modifiez les détails du créneau bloqué' : 'Créez un nouveau créneau bloqué'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* Date Picker */}
            <div>
              <Label className="text-sm text-gray-700 mb-2 flex items-center gap-1.5">
                <CalendarClock className="h-4 w-4 text-gray-500" />
                Date spécifique (optionnel)
              </Label>
              <Input
                type="date"
                value={creneauForm.date_specifique}
                onChange={(e) => setCreneauForm({ ...creneauForm, date_specifique: e.target.value })}
                className="h-11"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                💡 Laissez vide pour un blocage récurrent chaque semaine
              </p>
            </div>

            {/* Multi-Day Selector */}
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">
                Jour(s) de la semaine
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'lundi', label: 'Lun' },
                  { key: 'mardi', label: 'Mar' },
                  { key: 'mercredi', label: 'Mer' },
                  { key: 'jeudi', label: 'Jeu' },
                  { key: 'vendredi', label: 'Ven' },
                  { key: 'samedi', label: 'Sam' },
                  { key: 'dimanche', label: 'Dim' },
                ].map((day) => (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => toggleDay(day.key)}
                    className={`h-11 rounded-lg text-sm font-medium transition-all ${
                      selectedDays.includes(day.key)
                        ? 'bg-misspo-rose-dark text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-gray-700 mb-2 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Début
                </Label>
                <Input
                  type="time"
                  value={creneauForm.heure_debut}
                  onChange={(e) => setCreneauForm({ ...creneauForm, heure_debut: e.target.value })}
                  className="h-11"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-700 mb-2 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Fin
                </Label>
                <Input
                  type="time"
                  value={creneauForm.heure_fin}
                  onChange={(e) => setCreneauForm({ ...creneauForm, heure_fin: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <Label className="text-sm text-gray-700 mb-2 flex items-center gap-1.5">
                <StickyNote className="h-4 w-4 text-gray-500" />
                Note (optionnel)
              </Label>
              <Input
                type="text"
                placeholder="Ex: Déjeuner, Formation, Vacances..."
                value={creneauForm.note}
                onChange={(e) => setCreneauForm({ ...creneauForm, note: e.target.value })}
                className="h-11"
                maxLength={255}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={editingCreneau ? handleUpdateCreneau : handleAddCreneau}
                disabled={selectedDays.length === 0}
                className="flex-1 bg-misspo-rose-dark hover:bg-misspo-rose text-white h-12"
              >
                {editingCreneau ? 'Enregistrer' : `Ajouter ${selectedDays.length > 1 ? `(${selectedDays.length} jours)` : ''}`}
              </Button>
              <Button
                onClick={() => setShowBottomSheet(false)}
                variant="outline"
                className="flex-1 h-12"
              >
                Annuler
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Info Banner */}
      <Card className="border-misspo-rose bg-misspo-rose-pale/50">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-misspo-rose-dark mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Système de blocage unifié
              </p>
              <p className="text-xs text-gray-700 mt-1">
                <span className="font-medium">Sans date:</span> Le blocage se répète chaque semaine • 
                <span className="font-medium ml-2">Avec date:</span> Blocage ponctuel pour cette date uniquement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
