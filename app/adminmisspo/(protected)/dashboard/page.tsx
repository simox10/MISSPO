"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Settings2, ChevronLeft, ChevronRight, Edit, MessageCircle, Plus, User, Calendar as CalendarIcon, Phone, MapPin, School } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { getRealtimeManager } from "@/lib/realtime-manager"
import { RealtimeStatus } from "@/components/realtime-status"
import { NotificationBell } from "@/components/notification-bell"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { reservations, type Reservation } from "../../data/reservations"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export default function DashboardPage() {
  const [search, setSearch] = useState("")
  const [filterPack, setFilterPack] = useState<string>("all")
  const [filterStatut, setFilterStatut] = useState<string>("all")
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null)
  const [editingReservation, setEditingReservation] = useState<any | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [reservations, setReservations] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    confirmees: 0,
    en_attente: 0,
    refusees: 0,
    total_mois: 0,
  })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchCurrent, setTouchCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  // Fonction pour gérer le début du swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchCurrent(e.targetTouches[0].clientX)
    setIsDragging(true)
  }

  // Fonction pour gérer le mouvement du swipe (les cartes suivent le doigt)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const currentTouch = e.targetTouches[0].clientX
    setTouchCurrent(currentTouch)
    
    // Calculer le décalage par rapport au point de départ
    const diff = currentTouch - touchStart
    
    // Limiter le drag aux bords (ne pas dépasser la première/dernière carte)
    let newOffset = diff
    
    // Si on est à la première carte et qu'on essaie d'aller à gauche, résister
    if (currentSlide === 0 && diff > 0) {
      newOffset = diff * 0.3 // Résistance
    }
    
    // Si on est à la dernière carte et qu'on essaie d'aller à droite, résister
    if (currentSlide === 3 && diff < 0) {
      newOffset = diff * 0.3 // Résistance
    }
    
    setDragOffset(newOffset)
  }

  // Fonction pour gérer la fin du swipe
  const handleTouchEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    const distance = touchCurrent - touchStart
    const threshold = 50 // Distance minimale pour changer de slide
    
    // Swipe vers la gauche (carte suivante)
    if (distance < -threshold && currentSlide < 3) {
      setCurrentSlide(currentSlide + 1)
    }
    // Swipe vers la droite (carte précédente)
    else if (distance > threshold && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
    
    // Réinitialiser
    setDragOffset(0)
    setTouchStart(0)
    setTouchCurrent(0)
  }
  const [loading, setLoading] = useState(true)
  const [newReservation, setNewReservation] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    date: "",
    heure: "",
    pack: "Domicile",
    statut: "En attente",
    adresse: "",
    ecole: "",
    notes: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  
  // Détection mobile pour la pagination
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // 4 items par page sur mobile, 10 sur desktop
  const itemsPerPage = isMobile ? 4 : 10
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    client: true,
    telephone: true,
    pack: true,
    statut: true,
    actions: true,
  })
  const [availableHours, setAvailableHours] = useState<{openTime: string, closeTime: string, available: boolean, bookedSlots?: string[]} | null>(null)
  const [selectedDateForNew, setSelectedDateForNew] = useState("")
  const [availableHoursEdit, setAvailableHoursEdit] = useState<{openTime: string, closeTime: string, available: boolean, bookedSlots?: string[]} | null>(null)
  const [selectedDateForEdit, setSelectedDateForEdit] = useState("")
  
  // CHANGER CE NUMÉRO POUR TESTER LES DESIGNS : 1, 2 ou 3
  const [dialogDesign, setDialogDesign] = useState(1)

  // Fonction pour envoyer un message WhatsApp
  const handleWhatsAppClick = (reservation: any) => {
    // Nettoyer le numéro (supprimer tous les caractères non-numériques)
    let phone = reservation.telephone.replace(/[^0-9]/g, '')
    
    // Si le numéro commence par 0, le remplacer par 212 (code pays Maroc)
    if (phone.startsWith('0')) {
      phone = '212' + phone.substring(1)
    }
    
    const date = new Date(reservation.date)
    const joursSemaine = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
    
    const jourSemaine = joursSemaine[date.getDay()]
    const jour = date.getDate()
    const moisNom = mois[date.getMonth()]
    const annee = date.getFullYear()
    
    const dateFormatee = `${jourSemaine.charAt(0).toUpperCase() + jourSemaine.slice(1)} ${jour} ${moisNom} ${annee}`
    
    const message = `Bonjour ${reservation.prenom},

*CONFIRMATION DE RENDEZ-VOUS REQUISE*

*Rendez-vous MISSPO :*
━━━━━━━━━━━━━━━━━━━━━
• *Date :* ${dateFormatee}
• *Heure :* ${reservation.heure}
• *Pack :* ${reservation.pack}${reservation.adresse ? `
• *Adresse :* ${reservation.adresse}` : ''}${reservation.ecole ? `
• *École :* ${reservation.ecole}` : ''}
━━━━━━━━━━━━━━━━━━━━━

Merci de confirmer votre présence en répondant à ce message.

*Réponses possibles :*
CONFIRMER
ANNULER
REPORTER

Cordialement,
_L'équipe MISSPO_`
    
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank')
  }

  // Fonction pour formater la date pour l'input date (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ''
    // Si la date contient 'T', c'est un format ISO - extraire seulement la partie date
    if (dateString.includes('T')) {
      return dateString.split('T')[0]
    }
    return dateString
  }

  // Charger les statistiques et les rendez-vous
  useEffect(() => {
    fetchStats()
    fetchAppointments()
  }, [])

  // Hybrid WebSocket/Polling subscription for real-time updates
  useEffect(() => {
    const manager = getRealtimeManager()
    
    // Initialize manager
    manager.initialize({
      pollingInterval: parseInt(process.env.NEXT_PUBLIC_POLLING_INTERVAL || '60000'),
      statusCheckInterval: parseInt(process.env.NEXT_PUBLIC_STATUS_CHECK_INTERVAL || '300000'),
      onModeChange: (mode, reason) => {
        if (mode === 'polling') {
          toast.info('Mode économie activé - Mises à jour toutes les 60 secondes')
        } else {
          toast.success('Connexion temps réel rétablie')
        }
      },
    })
    
    // Subscribe to appointments channel
    manager.subscribe(
      'appointments',
      '.appointment.created',
      (data: any) => {
        console.log('New appointment received:', data)
        
        // Add new appointment to the list
        setReservations(prev => [data, ...prev])
        
        // Refresh statistics
        fetchStats()
        
        // Show notification
        toast.success('Nouvelle réservation reçue!')
      },
      // Polling callback
      async () => {
        await fetchAppointments()
        await fetchStats()
      }
    )
    
    // Subscribe to appointment updates
    manager.subscribe(
      'appointments',
      '.appointment.updated',
      (data: any) => {
        console.log('Appointment updated:', data)
        
        // Update appointment in the list
        setReservations(prev => 
          prev.map(r => r.id === data.id ? data : r)
        )
        
        // Refresh statistics
        fetchStats()
        
        // Show notification
        toast.info('Rendez-vous mis à jour')
      }
    )
    
    // Cleanup on unmount
    return () => {
      manager.unsubscribe('appointments')
    }
  }, [])

  // Charger les horaires disponibles quand la date change
  useEffect(() => {
    if (selectedDateForNew) {
      fetchAvailableHours(selectedDateForNew)
    }
  }, [selectedDateForNew])

  // Charger les horaires pour le formulaire d'édition
  useEffect(() => {
    if (selectedDateForEdit) {
      fetchAvailableHoursEdit(selectedDateForEdit)
    }
  }, [selectedDateForEdit])

  const fetchAvailableHours = async (date: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/appointments/available-hours?date=${date}`)
      const data = await response.json()
      
      if (data.success) {
        setAvailableHours({
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

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`)
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
    }
  }

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/admin/appointments`)
      const data = await response.json()
      if (data.success) {
        setReservations(data.appointments)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))
  }

  const filteredReservations = reservations.filter((res) => {
    const matchSearch = 
      res.nom.toLowerCase().includes(search.toLowerCase()) ||
      res.prenom.toLowerCase().includes(search.toLowerCase()) ||
      res.telephone.includes(search)
    
    const matchPack = filterPack === "all" || res.pack === filterPack
    const matchStatut = filterStatut === "all" || res.statut === filterStatut

    return matchSearch && matchPack && matchStatut
  })

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedReservations = filteredReservations.slice(startIndex, endIndex)

  // Reset to page 1 when filters change or screen size changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterPack, filterStatut, isMobile])

  const getStatutBadge = (statut: string) => {
    const variants = {
      "Confirmée": "bg-green-100 text-green-700 hover:bg-green-100",
      "En attente": "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      "Annulée": "bg-red-100 text-red-700 hover:bg-red-100",
    }
    return variants[statut as keyof typeof variants] || ""
  }

  const getPackBadge = (pack: string) => {
    return pack === "École" 
      ? "bg-misspo-blue-pale text-misspo-blue-dark hover:bg-misspo-blue-pale"
      : "bg-misspo-rose-pale text-misspo-rose-dark hover:bg-misspo-rose-pale"
  }

  return (
    <div className="pb-4">
      {/* Realtime Status Indicator - Development Only */}
      {process.env.NODE_ENV === 'development' && <RealtimeStatus />}
      
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau des Réservations</h1>
        <p className="text-muted-foreground text-sm md:text-base mt-1">Gérez toutes vos réservations</p>
        {/* NotificationBell visible uniquement sur desktop, sur mobile il est dans le header */}
        <div className="hidden lg:block absolute top-4 right-4">
          <NotificationBell />
        </div>
      </div>

      {/* Stats - En haut */}
      {/* Desktop: Grid normal */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        <div className="rounded-lg shadow-sm p-4 relative overflow-hidden" style={{ backgroundColor: '#E5F4F9' }}>
          <CalendarIcon className="absolute -right-6 top-1/2 -translate-y-1/2 -translate-y-8 h-32 w-32 opacity-20" style={{ color: '#1a7a94' }} />
          <p className="text-sm relative z-10" style={{ color: '#2da1ca' }}>RDV Aujourd'hui</p>
          <p className="text-xl font-bold relative z-10 mt-2" style={{ color: '#2da1ca' }}>
            {loading ? "..." : `${stats.total}/${stats.total_mois}`}
          </p>
        </div>
        <div className="rounded-lg shadow-sm p-4 relative overflow-hidden" style={{ backgroundColor: '#E5F4F9' }}>
          <svg className="absolute -right-6 top-1/2 -translate-y-1/2 -translate-y-8 h-32 w-32 opacity-20" style={{ color: '#1a7a94' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm relative z-10" style={{ color: '#2da1ca' }}>RDV Confirmées</p>
          <p className="text-xl font-bold relative z-10 mt-2" style={{ color: '#2da1ca' }}>
            {loading ? "..." : `${stats.confirmees}/${stats.total_mois}`}
          </p>
        </div>
        <div className="rounded-lg shadow-sm p-4 relative overflow-hidden" style={{ backgroundColor: '#E5F4F9' }}>
          <svg className="absolute -right-6 top-1/2 -translate-y-1/2 -translate-y-8 h-32 w-32 opacity-20" style={{ color: '#1a7a94' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm relative z-10" style={{ color: '#2da1ca' }}>RDV En attente</p>
          <p className="text-xl font-bold relative z-10 mt-2" style={{ color: '#2da1ca' }}>
            {loading ? "..." : `${stats.en_attente}/${stats.total_mois}`}
          </p>
        </div>
        <div className="rounded-lg shadow-sm p-4 relative overflow-hidden" style={{ backgroundColor: '#E5F4F9' }}>
          <svg className="absolute -right-6 top-1/2 -translate-y-1/2 -translate-y-8 h-32 w-32 opacity-20" style={{ color: '#1a7a94' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="text-sm relative z-10" style={{ color: '#2da1ca' }}>RDV Refusées</p>
          <p className="text-xl font-bold relative z-10 mt-2" style={{ color: '#2da1ca' }}>
            {loading ? "..." : `${stats.refusees}/${stats.total_mois}`}
          </p>
        </div>
      </div>

      {/* Mobile: Carrousel */}
      <div className="md:hidden mb-6">
        <div 
          className="relative overflow-hidden touch-pan-y -mx-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-y' }}
        >
          <div 
            className="flex"
            style={{ 
              transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`,
              transition: isDragging ? 'none' : 'transform 300ms ease-out',
              willChange: 'transform'
            }}
          >
            {/* Carte 1 */}
            <div className="w-full flex-shrink-0 px-4">
              <div className="rounded-lg shadow-sm p-4 relative overflow-hidden" style={{ backgroundColor: '#E5F4F9' }}>
                <CalendarIcon className="absolute -right-4 top-1/2 -translate-y-1/2 h-24 w-24 opacity-20" style={{ color: '#1a7a94' }} />
                <p className="text-xs relative z-10" style={{ color: '#2da1ca' }}>RDV Aujourd'hui</p>
                <p className="text-2xl font-bold relative z-10 mt-1" style={{ color: '#2da1ca' }}>
                  {loading ? "..." : `${stats.total}/${stats.total_mois}`}
                </p>
              </div>
            </div>
            {/* Carte 2 */}
            <div className="w-full flex-shrink-0 px-4">
              <div className="rounded-lg shadow-sm p-4 relative overflow-hidden" style={{ backgroundColor: '#E5F4F9' }}>
                <svg className="absolute -right-4 top-1/2 -translate-y-1/2 h-24 w-24 opacity-20" style={{ color: '#1a7a94' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs relative z-10" style={{ color: '#2da1ca' }}>RDV Confirmées</p>
                <p className="text-2xl font-bold relative z-10 mt-1" style={{ color: '#2da1ca' }}>
                  {loading ? "..." : `${stats.confirmees}/${stats.total_mois}`}
                </p>
              </div>
            </div>
            {/* Carte 3 */}
            <div className="w-full flex-shrink-0 px-4">
              <div className="rounded-lg shadow-sm p-4 relative overflow-hidden" style={{ backgroundColor: '#E5F4F9' }}>
                <svg className="absolute -right-4 top-1/2 -translate-y-1/2 h-24 w-24 opacity-20" style={{ color: '#1a7a94' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs relative z-10" style={{ color: '#2da1ca' }}>RDV En attente</p>
                <p className="text-2xl font-bold relative z-10 mt-1" style={{ color: '#2da1ca' }}>
                  {loading ? "..." : `${stats.en_attente}/${stats.total_mois}`}
                </p>
              </div>
            </div>
            {/* Carte 4 */}
            <div className="w-full flex-shrink-0 px-4">
              <div className="rounded-lg shadow-sm p-4 relative overflow-hidden" style={{ backgroundColor: '#E5F4F9' }}>
                <svg className="absolute -right-4 top-1/2 -translate-y-1/2 h-24 w-24 opacity-20" style={{ color: '#1a7a94' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-xs relative z-10" style={{ color: '#2da1ca' }}>RDV Refusées</p>
                <p className="text-2xl font-bold relative z-10 mt-1" style={{ color: '#2da1ca' }}>
                  {loading ? "..." : `${stats.refusees}/${stats.total_mois}`}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Dots - Indicateurs visuels seulement */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="transition-all duration-300"
              style={{
                width: currentSlide === index ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: currentSlide === index ? '#2da1ca' : '#d1d5db',
              }}
              aria-label={`Carte ${index + 1} sur 4`}
            />
          ))}
        </div>
      </div>

      {/* Filtres et Actions - VERSION MOBILE */}
      <div className="md:hidden space-y-3 mb-4">
        {/* Ligne 1: Bouton Nouveau RDV */}
        <Button
          className="border-2 hover:shadow-md transition-all text-sm w-full"
          style={{ 
            borderColor: '#ED7A97',
            backgroundColor: '#ED7A97',
            color: 'white',
          }}
          onClick={() => setIsAddingNew(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau RDV
        </Button>

        {/* Ligne 2: Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#ED7A97' }} />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-2 focus:ring-2 text-sm"
            style={{ 
              borderColor: '#F6BDCB',
              backgroundColor: 'white',
            }}
          />
        </div>

        {/* Ligne 3: Les 2 dropdowns côte à côte */}
        <div className="grid grid-cols-2 gap-3">
          <Select value={filterPack} onValueChange={setFilterPack}>
            <SelectTrigger 
              className="border-2 text-sm"
              style={{ 
                borderColor: '#F6BDCB',
                backgroundColor: 'white',
              }}
            >
              <SelectValue placeholder="Pack" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: '#FBDEE5', borderColor: '#F6BDCB' }}>
              <SelectItem value="all" className="text-sm">Tous les packs</SelectItem>
              <SelectItem value="École" className="text-sm">Pack École</SelectItem>
              <SelectItem value="Domicile" className="text-sm">Pack Domicile</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger 
              className="border-2 text-sm"
              style={{ 
                borderColor: '#F6BDCB',
                backgroundColor: 'white',
              }}
            >
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: '#FBDEE5', borderColor: '#F6BDCB' }}>
              <SelectItem value="all" className="text-sm">Tous</SelectItem>
              <SelectItem value="En attente" className="text-sm">En attente</SelectItem>
              <SelectItem value="Confirmée" className="text-sm">Confirmée</SelectItem>
              <SelectItem value="Terminée" className="text-sm">Terminée</SelectItem>
              <SelectItem value="Refusée" className="text-sm">Refusée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtres - VERSION DESKTOP */}
      <div className="hidden md:block rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#ED7A97' }} />
              <Input
                placeholder="Rechercher par nom, prénom ou téléphone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-2 focus:ring-2"
                style={{ 
                  borderColor: '#F6BDCB',
                  backgroundColor: 'white',
                }}
              />
            </div>
          </div>
          
          <Select value={filterPack} onValueChange={setFilterPack}>
            <SelectTrigger 
              className="border-2"
              style={{ 
                borderColor: '#F6BDCB',
                backgroundColor: 'white',
              }}
            >
              <SelectValue placeholder="Pack" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: '#FBDEE5', borderColor: '#F6BDCB' }}>
              <SelectItem value="all">Tous les packs</SelectItem>
              <SelectItem value="École">Pack École</SelectItem>
              <SelectItem value="Domicile">Pack Domicile</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger 
              className="border-2"
              style={{ 
                borderColor: '#F6BDCB',
                backgroundColor: 'white',
              }}
            >
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: '#FBDEE5', borderColor: '#F6BDCB' }}>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="En attente">En attente</SelectItem>
              <SelectItem value="Confirmée">Confirmée</SelectItem>
              <SelectItem value="Terminée">Terminée</SelectItem>
              <SelectItem value="Refusée">Refusée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Boutons d'action - VERSION DESKTOP uniquement */}
      <div className="hidden md:flex justify-end gap-3 mb-4">
        <Button
          className="border-2 hover:shadow-md transition-all"
          style={{ 
            borderColor: '#ED7A97',
            backgroundColor: '#ED7A97',
            color: 'white',
          }}
          onClick={() => setIsAddingNew(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="border-2 hover:shadow-md transition-all"
              style={{ 
                borderColor: '#ED7A97',
                backgroundColor: '#ED7A97',
                color: 'white',
              }}
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Colonnes
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end" style={{ backgroundColor: '#FBDEE5', borderColor: '#F6BDCB' }}>
            <div className="space-y-3">
              <h4 className="font-medium text-sm" style={{ color: '#ED7A97' }}>Afficher les colonnes</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-date"
                    checked={visibleColumns.date}
                    onCheckedChange={() => toggleColumn('date')}
                    style={{ borderColor: '#ED7A97' }}
                  />
                  <label htmlFor="col-date" className="text-sm cursor-pointer">
                    Date & Heure
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-client"
                    checked={visibleColumns.client}
                    onCheckedChange={() => toggleColumn('client')}
                    style={{ borderColor: '#ED7A97' }}
                  />
                  <label htmlFor="col-client" className="text-sm cursor-pointer">
                    Client
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-telephone"
                    checked={visibleColumns.telephone}
                    onCheckedChange={() => toggleColumn('telephone')}
                    style={{ borderColor: '#ED7A97' }}
                  />
                  <label htmlFor="col-telephone" className="text-sm cursor-pointer">
                    Téléphone
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-pack"
                    checked={visibleColumns.pack}
                    onCheckedChange={() => toggleColumn('pack')}
                    style={{ borderColor: '#ED7A97' }}
                  />
                  <label htmlFor="col-pack" className="text-sm cursor-pointer">
                    Pack
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-statut"
                    checked={visibleColumns.statut}
                    onCheckedChange={() => toggleColumn('statut')}
                    style={{ borderColor: '#ED7A97' }}
                  />
                  <label htmlFor="col-statut" className="text-sm cursor-pointer">
                    Statut
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-actions"
                    checked={visibleColumns.actions}
                    onCheckedChange={() => toggleColumn('actions')}
                    style={{ borderColor: '#ED7A97' }}
                  />
                  <label htmlFor="col-actions" className="text-sm cursor-pointer">
                    Actions
                  </label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Table Desktop */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {visibleColumns.date && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Heure</th>
                )}
                {visibleColumns.client && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                )}
                {visibleColumns.telephone && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                )}
                {visibleColumns.pack && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pack</th>
                )}
                {visibleColumns.statut && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                )}
                {visibleColumns.actions && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  {visibleColumns.date && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(reservation.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">{reservation.heure}</div>
                    </td>
                  )}
                  {visibleColumns.client && (
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.prenom} {reservation.nom}
                      </div>
                      <div className="text-sm text-gray-500">{reservation.email}</div>
                    </td>
                  )}
                  {visibleColumns.telephone && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {reservation.telephone}
                    </td>
                  )}
                  {visibleColumns.pack && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge className={getPackBadge(reservation.pack)}>
                        {reservation.pack}
                      </Badge>
                    </td>
                  )}
                  {visibleColumns.statut && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge className={getStatutBadge(reservation.statut)}>
                        {reservation.statut}
                      </Badge>
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedReservation(reservation)}
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => {
                            const formattedDate = formatDateForInput(reservation.date)
                            setEditingReservation({
                              ...reservation,
                              date: formattedDate
                            })
                            setSelectedDateForEdit(formattedDate)
                            // Force refresh available hours immediately
                            fetchAvailableHoursEdit(formattedDate)
                          }}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleWhatsAppClick(reservation)}
                          title="Contacter via WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune réservation trouvée</p>
          </div>
        )}

        {/* Pagination */}
        {filteredReservations.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-gray-700">
              Affichage de {startIndex + 1} à {Math.min(endIndex, filteredReservations.length)} sur {filteredReservations.length} résultats
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-[#ED7A97] hover:bg-[#F29CB1]" : ""}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {paginatedReservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {reservation.prenom} {reservation.nom}
                </h3>
                <p className="text-sm text-gray-500">{reservation.email}</p>
              </div>
              <Badge className={getStatutBadge(reservation.statut)}>
                {reservation.statut}
              </Badge>
            </div>

            {/* Layout: Infos à gauche, Boutons à droite */}
            <div className="flex items-start justify-between gap-4">
              {/* Colonne gauche: Infos */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">📅</span>
                  <span>{new Date(reservation.date).toLocaleDateString('fr-FR')} à {reservation.heure}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">📞</span>
                  <span>{reservation.telephone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPackBadge(reservation.pack)}>
                    {reservation.pack}
                  </Badge>
                </div>
              </div>

              {/* Colonne droite: Boutons */}
              <div className="flex flex-col gap-2">
                {/* Ligne 1: Modifier + Message */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => {
                      setEditingReservation({
                        ...reservation,
                        date: formatDateForInput(reservation.date)
                      })
                      setSelectedDateForEdit(formatDateForInput(reservation.date))
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => handleWhatsAppClick(reservation)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Ligne 2: Voir */}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedReservation(reservation)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredReservations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-muted-foreground">Aucune réservation trouvée</p>
          </div>
        )}

        {/* Pagination Mobile */}
        {filteredReservations.length > 0 && (
          <div className="bg-white rounded-lg p-5">
            <div className="text-base text-gray-700 text-center mb-4 font-medium">
              Page {currentPage} sur {totalPages} ({filteredReservations.length} résultats)
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                className="h-12 w-12"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <span className="text-lg font-semibold min-w-[60px] text-center">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                className="h-12 w-12"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog Détails - Design Simple */}
      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="max-w-md">
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
                    const formattedDate = formatDateForInput(selectedReservation.date)
                    setEditingReservation({
                      ...selectedReservation,
                      date: formattedDate
                    })
                    setSelectedReservation(null)
                    setSelectedDateForEdit(formattedDate)
                    // Force refresh available hours immediately
                    fetchAvailableHoursEdit(formattedDate)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleWhatsAppClick(selectedReservation)}
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
                  toast.error(data.message || 'Ce créneau est complet', {
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
                  // Recharger les données
                  fetchStats()
                  fetchAppointments()
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

      {/* Dialog Ajout nouveau rendez-vous */}
      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau rendez-vous</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault()
            
            try {
              const response = await fetch(`${API_URL}/admin/appointments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReservation),
              })

              const data = await response.json()

              if (data.success) {
                toast.success('Rendez-vous créé avec succès !', {
                  style: {
                    background: '#E5F4F9',
                    color: '#2da1ca',
                    border: '2px solid #2da1ca',
                  },
                })
                setIsAddingNew(false)
                // Reset form
                setNewReservation({
                  prenom: "",
                  nom: "",
                  email: "",
                  telephone: "",
                  date: "",
                  heure: "",
                  pack: "Domicile",
                  statut: "En attente",
                  adresse: "",
                  ecole: "",
                  notes: "",
                })
                // Recharger les données
                fetchStats()
                fetchAppointments()
              } else {
                toast.error('Erreur lors de la création du rendez-vous', {
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
                <Label htmlFor="new-prenom">Prénom *</Label>
                <Input
                  id="new-prenom"
                  value={newReservation.prenom}
                  onChange={(e) => setNewReservation({...newReservation, prenom: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-nom">Nom *</Label>
                <Input
                  id="new-nom"
                  value={newReservation.nom}
                  onChange={(e) => setNewReservation({...newReservation, nom: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-email">Email *</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newReservation.email}
                  onChange={(e) => setNewReservation({...newReservation, email: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-telephone">Téléphone *</Label>
                <Input
                  id="new-telephone"
                  value={newReservation.telephone}
                  onChange={(e) => setNewReservation({...newReservation, telephone: e.target.value})}
                  className="mt-1"
                  placeholder="+212 6XX XXX XXX"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-date">Date *</Label>
                <Input
                  id="new-date"
                  type="date"
                  value={newReservation.date}
                  onChange={(e) => {
                    setNewReservation({...newReservation, date: e.target.value})
                    setSelectedDateForNew(e.target.value)
                  }}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-heure">Heure *</Label>
                {availableHours && !availableHours.available ? (
                  <div className="mt-1">
                    <Input
                      disabled
                      value="Fermé ce jour"
                      className="bg-gray-100"
                    />
                  </div>
                ) : (
                  <Select 
                    value={newReservation.heure} 
                    onValueChange={(value) => setNewReservation({...newReservation, heure: value})}
                    disabled={!newReservation.date}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableHours ? (
                        generateTimeSlots(availableHours.openTime, availableHours.closeTime, availableHours.bookedSlots).map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="placeholder" disabled>
                          Sélectionnez d'abord une date
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
                {availableHours && availableHours.available && (
                  <p className="text-xs text-gray-500 mt-1">
                    Horaires: {availableHours.openTime} - {availableHours.closeTime}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-pack">Pack *</Label>
                <Select 
                  value={newReservation.pack} 
                  onValueChange={(value) => setNewReservation({...newReservation, pack: value})}
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
                <Label htmlFor="new-statut">Statut *</Label>
                <Select 
                  value={newReservation.statut} 
                  onValueChange={(value) => setNewReservation({...newReservation, statut: value})}
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

            {newReservation.pack === "École" && (
              <div>
                <Label htmlFor="new-ecole">École</Label>
                <Input
                  id="new-ecole"
                  value={newReservation.ecole}
                  onChange={(e) => setNewReservation({...newReservation, ecole: e.target.value})}
                  className="mt-1"
                  placeholder="Nom de l'école"
                />
              </div>
            )}

            {newReservation.pack === "Domicile" && (
              <div>
                <Label htmlFor="new-adresse">Adresse</Label>
                <Input
                  id="new-adresse"
                  value={newReservation.adresse}
                  onChange={(e) => setNewReservation({...newReservation, adresse: e.target.value})}
                  className="mt-1"
                  placeholder="Adresse complète"
                />
              </div>
            )}

            <div>
              <Label htmlFor="new-notes">Notes</Label>
              <Textarea
                id="new-notes"
                value={newReservation.notes}
                onChange={(e) => setNewReservation({...newReservation, notes: e.target.value})}
                className="mt-1"
                rows={3}
                placeholder="Notes supplémentaires..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingNew(false)}
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
                Ajouter
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
