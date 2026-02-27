"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Phone, Mail, Trash2, Eye, CheckCircle, Clock, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

type Contact = {
  id: number
  nom: string
  prenom: string
  telephone: string
  email: string
  message: string | null
  statut: 'Non lu' | 'Lu'
  created_at: string
  updated_at: string
}

type Stats = {
  total: number
  non_lu: number
  lu: number
  today: number
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, non_lu: 0, lu: 0, today: 0 })
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDate, setFilterDate] = useState<string>("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showDatePicker && !target.closest('.date-picker-container')) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDatePicker])

  // Proper mobile detection with resize listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchContacts()
    fetchStats()
  }, [])

  useEffect(() => {
    filterContacts()
  }, [contacts, filterStatus, searchQuery, filterDate])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/admin/contacts`)
      const data = await response.json()
      
      if (data.success) {
        setContacts(data.contacts)
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error('Erreur lors du chargement des messages')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/contacts/stats`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const filterContacts = () => {
    let filtered = contacts

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(c => c.statut === filterStatus)
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(c => {
        const contactDate = new Date(c.created_at).toISOString().split('T')[0]
        return contactDate === filterDate
      })
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c => 
        c.nom.toLowerCase().includes(query) ||
        c.prenom.toLowerCase().includes(query) ||
        c.telephone.includes(query) ||
        c.email.toLowerCase().includes(query)
      )
    }

    setFilteredContacts(filtered)
  }

  const updateStatus = async (id: number, newStatus: 'Non lu' | 'Lu') => {
    try {
      const response = await fetch(`${API_URL}/admin/contacts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Statut mis à jour')
        fetchContacts()
        fetchStats()
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact(data.contact)
        }
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const deleteContact = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/admin/contacts/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Message supprimé')
        fetchContacts()
        fetchStats()
        setSelectedContact(null)
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleRowClick = (contact: Contact) => {
    setSelectedContact(contact)
    // Mark as read if it's unread
    if (contact.statut === 'Non lu') {
      updateStatus(contact.id, 'Lu')
    }
  }

  const getStatutBadge = (statut: string) => {
    const variants = {
      "Non lu": "bg-yellow-100 text-yellow-700 border-yellow-300",
      "Lu": "bg-blue-100 text-blue-700 border-blue-300",
    }
    return variants[statut as keyof typeof variants] || ""
  }

  const getStatutIcon = (statut: string) => {
    const icons = {
      "Non lu": <Clock className="h-3 w-3" />,
      "Lu": <Eye className="h-3 w-3" />,
    }
    return icons[statut as keyof typeof icons] || null
  }

  const handleWhatsAppClick = (contact: Contact) => {
    const message = `Bonjour ${contact.prenom} ${contact.nom}, merci de nous avoir contactés.`
    const url = `https://wa.me/212${contact.telephone.substring(1)}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-3 md:mb-4">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">Messages de Contact</h1>
        <p className="text-muted-foreground mt-1 text-xs md:text-base">Gérer les messages reçus</p>
      </div>

      {/* Stats Cards - Mobile Optimized with Horizontal Scroll */}
      <div className="mb-3 md:mb-4">
        {/* Mobile: Horizontal Scroll - Show 2 cards at a time */}
        <div className="md:hidden overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', marginLeft: '-12px', marginRight: '-12px', paddingLeft: '12px', paddingRight: '12px' }}>
          <div className="flex gap-2">
            <Card className="hover:shadow-md transition-shadow cursor-pointer flex-shrink-0" style={{ width: 'calc(50% - 4px)' }} onClick={() => setFilterStatus("all")}>
              <CardContent className="pt-3 pb-3 px-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-yellow-500 flex-shrink-0" style={{ width: 'calc(50% - 4px)' }} onClick={() => setFilterStatus("Non lu")}>
              <CardContent className="pt-3 pb-3 px-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <p className="text-xl font-bold text-yellow-600">{stats.non_lu}</p>
                  </div>
                  <p className="text-[10px] font-medium text-yellow-600 uppercase tracking-wide">Non lus</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500 flex-shrink-0" style={{ width: 'calc(50% - 4px)' }} onClick={() => setFilterStatus("Lu")}>
              <CardContent className="pt-3 pb-3 px-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <Eye className="h-4 w-4 text-blue-400" />
                    <p className="text-xl font-bold text-blue-600">{stats.lu}</p>
                  </div>
                  <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wide">Lus</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow flex-shrink-0" style={{ width: 'calc(50% - 4px)' }}>
              <CardContent className="pt-3 pb-3 px-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-blue-600">📅</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{stats.today}</p>
                  </div>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Aujourd'hui</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid gap-3 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFilterStatus("all")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-yellow-500" onClick={() => setFilterStatus("Non lu")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-600 uppercase tracking-wide">Non lus</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.non_lu}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500" onClick={() => setFilterStatus("Lu")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Lus</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.lu}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.today}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">📅</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Enhanced Filters - Mobile Optimized */}
      <Card className="mb-3 md:mb-4">
        <CardContent className="pt-3 pb-3 md:pt-4 md:pb-4">
          <div className="flex flex-col gap-3 md:gap-4">
            {/* Mobile: Collapsible Filters */}
            <div className="md:hidden">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 h-11"
                  />
                  <Filter className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-11 w-11 relative"
                >
                  <Filter className="h-4 w-4" />
                  {(filterStatus !== "all" || searchQuery) && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {(filterStatus !== "all" ? 1 : 0) + (searchQuery ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </div>
              
              {/* Expandable Filter Chips */}
              {showFilters && (
                <div className="mt-3 pt-3 border-t flex flex-wrap gap-2 animate-in slide-in-from-top-2">
                  <Button
                    size="sm"
                    variant={filterStatus === "all" ? "default" : "outline"}
                    onClick={() => setFilterStatus("all")}
                    className="rounded-full h-9"
                  >
                    Tous ({stats.total})
                  </Button>
                  <Button
                    size="sm"
                    variant={filterStatus === "Non lu" ? "default" : "outline"}
                    onClick={() => setFilterStatus("Non lu")}
                    className={`rounded-full h-9 ${filterStatus === "Non lu" ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}`}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Non lus ({stats.non_lu})
                  </Button>
                  <Button
                    size="sm"
                    variant={filterStatus === "Lu" ? "default" : "outline"}
                    onClick={() => setFilterStatus("Lu")}
                    className="rounded-full h-9"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Lus ({stats.lu})
                  </Button>
                </div>
              )}
            </div>

            {/* Desktop: Always Visible Filters */}
            <div className="hidden md:flex flex-col gap-4">
              {/* Search Bar */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Rechercher par nom, téléphone ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                  />
                  <Filter className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative"
                >
                  <Filter className="h-4 w-4" />
                  {(filterStatus !== "all" || filterDate) && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {(filterStatus !== "all" ? 1 : 0) + (filterDate ? 1 : 0)}
                    </span>
                  )}
                </Button>
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="text-gray-500"
                  >
                    Effacer
                  </Button>
                )}
              </div>
              
              {/* Expandable Filter Chips */}
              {showFilters && (
                <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2">
                  <Button
                    size="sm"
                    variant={filterStatus === "all" ? "default" : "outline"}
                    onClick={() => setFilterStatus("all")}
                    className="rounded-full h-8 text-xs"
                  >
                    Tous ({stats.total})
                  </Button>
                  <Button
                    size="sm"
                    variant={filterStatus === "Non lu" ? "default" : "outline"}
                    onClick={() => setFilterStatus("Non lu")}
                    className="rounded-full h-8 text-xs bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                    style={filterStatus === "Non lu" ? {} : { backgroundColor: 'transparent', color: 'inherit' }}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Non lus ({stats.non_lu})
                  </Button>
                  <Button
                    size="sm"
                    variant={filterStatus === "Lu" ? "default" : "outline"}
                    onClick={() => setFilterStatus("Lu")}
                    className="rounded-full h-8 text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Lus ({stats.lu})
                  </Button>
                  <div className="relative date-picker-container">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className={`rounded-full h-8 text-xs ${filterDate ? 'bg-blue-100 border-blue-500' : ''}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-1">
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M3 10h18" />
                      </svg>
                      {filterDate ? new Date(filterDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Date'}
                      {filterDate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setFilterDate("")
                            setShowDatePicker(false)
                          }}
                          className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      )}
                    </Button>
                    {showDatePicker && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                        <input
                          type="date"
                          value={filterDate}
                          onChange={(e) => {
                            setFilterDate(e.target.value)
                            setShowDatePicker(false)
                          }}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Messages Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Chargement des messages...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[150px]" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
              <MessageCircle className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">Aucun message trouvé</p>
            </div>
          ) : (
            <>
              {/* Split-Pane Inbox Layout */}
              <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Left Panel - Message List */}
                <Card className="w-full md:w-2/5 flex flex-col overflow-hidden">
                  <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                    <div className="overflow-y-auto divide-y divide-gray-200">
                      {filteredContacts.map((contact) => {
                        const isSelected = selectedContact?.id === contact.id
                        const isUnread = contact.statut === 'Non lu'
                        
                        return (
                          <div

                      key={contact.id}
                      onClick={() => handleRowClick(contact)}
                      className={`p-1.5 md:p-2 cursor-pointer transition-all hover:bg-gray-50 active:bg-gray-100 relative group ${
                        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      } ${isUnread ? 'bg-yellow-50/50' : ''}`}
                    >
                      {/* Status Indicator */}
                      {isUnread && !isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 md:hidden"></div>
                      )}
                      {isUnread && !isSelected && (
                        <div className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-500 rounded-full"></div>
                      )}
                      
                      <div className={`flex gap-2 ${isUnread && !isSelected ? 'ml-2 md:ml-2' : ''}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs ${
                          isUnread ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}>
                          {contact.prenom.charAt(0)}{contact.nom.charAt(0)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className={`text-xs truncate ${isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                              {contact.prenom} {contact.nom}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                              {(() => {
                                const date = new Date(contact.created_at)
                                const now = new Date()
                                const diffMs = now.getTime() - date.getTime()
                                const diffMins = Math.floor(diffMs / 60000)
                                const diffHours = Math.floor(diffMs / 3600000)
                                const diffDays = Math.floor(diffMs / 86400000)
                                
                                if (diffMins < 1) return "maintenant"
                                if (diffMins < 60) return `${diffMins}m`
                                if (diffHours < 24) return `${diffHours}h`
                                if (diffDays < 7) return `${diffDays}j`
                                return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                              })()}
                            </span>
                          </div>
                          
                          {/* Mobile: Show only phone, Desktop: Show phone */}
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Phone className="h-2.5 w-2.5 flex-shrink-0" />
                            <span className="truncate">{contact.telephone}</span>
                          </p>
                          
                          {/* Message Preview */}
                          {contact.message && (
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {contact.message}
                            </p>
                          )}
                          
                          {/* Quick Actions - Desktop Only (Show on Hover) */}
                          <div className="hidden md:flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 px-1.5 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleWhatsAppClick(contact)
                              }}
                              title="WhatsApp"
                            >
                              <MessageCircle className="h-2.5 w-2.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 px-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.location.href = `tel:${contact.telephone}`
                              }}
                              title="Appeler"
                            >
                              <Phone className="h-2.5 w-2.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 px-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.location.href = `mailto:${contact.email}`
                              }}
                              title="Email"
                            >
                              <Mail className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Status Badge - Desktop Only */}
                        <div className="hidden md:flex flex-shrink-0 items-center">
                          {contact.statut === 'Non lu' && (
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                          )}
                          {contact.statut === 'Lu' && (
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
          </CardContent>
        </Card>

        {/* Right Panel - Message Details */}
        <Card className="hidden md:flex md:w-3/5 flex-col overflow-hidden">
          <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
            {selectedContact ? (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-3 border-b bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-base">
                        {selectedContact.prenom.charAt(0)}{selectedContact.nom.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          {selectedContact.prenom} {selectedContact.nom}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {new Date(selectedContact.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Status Selector */}
                    <Select
                      value={selectedContact.statut}
                      onValueChange={(value) => updateStatus(selectedContact.id, value as 'Non lu' | 'Lu')}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Non lu">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Non lu
                          </div>
                        </SelectItem>
                        <SelectItem value="Lu">
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3" />
                            Lu
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {selectedContact.message ? (
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
                        {selectedContact.message}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Aucun message</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-3 border-t bg-gray-50">
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-green-600 text-white hover:bg-green-700 h-9 text-xs"
                      onClick={() => handleWhatsAppClick(selectedContact)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                    <a href={`tel:${selectedContact.telephone}`} className="flex-1">
                      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 h-9 text-xs">
                        <Phone className="h-4 w-4 mr-1" />
                        Appeler
                      </Button>
                    </a>
                    <a href={`mailto:${selectedContact.email}`} className="flex-1">
                      <Button className="w-full bg-purple-600 text-white hover:bg-purple-700 h-9 text-xs">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-9 px-3"
                      onClick={() => deleteContact(selectedContact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle className="h-20 w-20 mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-500">Sélectionnez un message</p>
                <p className="text-sm text-gray-400">Choisissez un message pour voir les détails</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Mobile Full-Screen Detail View */}
      <Dialog open={!!selectedContact && isMobile} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-full h-full m-0 p-0 rounded-none flex flex-col">
          <VisuallyHidden>
            <DialogTitle>Détails du message</DialogTitle>
          </VisuallyHidden>
          {selectedContact && (
            <div className="flex flex-col h-full">
              {/* Mobile Header with Back Button */}
              <div className="flex items-center gap-3 p-4 border-b bg-white sticky top-0 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedContact(null)}
                  className="h-9 w-9"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base truncate">
                    {selectedContact.prenom} {selectedContact.nom}
                  </h2>
                  <p className="text-xs text-gray-500 truncate">Messages</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedContact(null)}
                  className="h-9 w-9"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Contact Info Header */}
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    {selectedContact.prenom.charAt(0)}{selectedContact.nom.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg">{selectedContact.prenom} {selectedContact.nom}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedContact.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 gap-3">
                  <a href={`tel:${selectedContact.telephone}`} className="flex items-center gap-3 p-3 bg-white rounded-lg border active:bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">{selectedContact.telephone}</p>
                    </div>
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  <a href={`mailto:${selectedContact.email}`} className="flex items-center gap-3 p-3 bg-white rounded-lg border active:bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 truncate">{selectedContact.email}</p>
                    </div>
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Message Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 bg-white">
                {selectedContact.message ? (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Message</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Aucun message</p>
                  </div>
                )}

                {/* Status Selector */}
                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Statut</p>
                  <Select
                    value={selectedContact.statut}
                    onValueChange={(value) => updateStatus(selectedContact.id, value as 'Non lu' | 'Lu')}
                  >
                    <SelectTrigger className="w-full h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Non lu">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Non lu
                        </div>
                      </SelectItem>
                      <SelectItem value="Lu">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Lu
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sticky Bottom Actions */}
              <div className="p-4 border-t bg-white sticky bottom-0">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <Button
                    className="bg-green-600 text-white hover:bg-green-700 h-12"
                    onClick={() => handleWhatsAppClick(selectedContact)}
                  >
                    <MessageCircle className="h-5 w-5 mr-1" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                  <a href={`tel:${selectedContact.telephone}`} className="w-full">
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 h-12">
                      <Phone className="h-5 w-5 mr-1" />
                      <span className="text-xs">Appeler</span>
                    </Button>
                  </a>
                  <a href={`mailto:${selectedContact.email}`} className="w-full">
                    <Button className="w-full bg-purple-600 text-white hover:bg-purple-700 h-12">
                      <Mail className="h-5 w-5 mr-1" />
                      <span className="text-xs">Email</span>
                    </Button>
                  </a>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-11"
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
                      deleteContact(selectedContact.id)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer le message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
