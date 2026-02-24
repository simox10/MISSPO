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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

type Contact = {
  id: number
  nom: string
  prenom: string
  telephone: string
  email: string
  message: string | null
  statut: 'Non lu' | 'Lu' | 'Traité'
  created_at: string
  updated_at: string
}

type Stats = {
  total: number
  non_lu: number
  lu: number
  traite: number
  today: number
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, non_lu: 0, lu: 0, traite: 0, today: 0 })
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchContacts()
    fetchStats()
  }, [])

  useEffect(() => {
    filterContacts()
  }, [contacts, filterStatus, searchQuery])

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

  const updateStatus = async (id: number, newStatus: 'Non lu' | 'Lu' | 'Traité') => {
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
      "Traité": "bg-green-100 text-green-700 border-green-300",
    }
    return variants[statut as keyof typeof variants] || ""
  }

  const getStatutIcon = (statut: string) => {
    const icons = {
      "Non lu": <Clock className="h-3 w-3" />,
      "Lu": <Eye className="h-3 w-3" />,
      "Traité": <CheckCircle className="h-3 w-3" />,
    }
    return icons[statut as keyof typeof icons] || null
  }

  const handleWhatsAppClick = (contact: Contact) => {
    const message = `Bonjour ${contact.prenom} ${contact.nom}, merci de nous avoir contactés.`
    const url = `https://wa.me/212${contact.telephone.substring(1)}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Messages de Contact</h1>
        <p className="text-muted-foreground mt-1">Gérer les messages reçus via le formulaire de contact</p>
      </div>

      {/* Stats Cards - Compact Version */}
      <div className="grid gap-3 md:grid-cols-5 mb-4">
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
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500" onClick={() => setFilterStatus("Traité")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Traités</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.traite}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
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

      {/* Enhanced Filters with Quick Chips */}
      <Card className="mb-4">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col gap-4">
            {/* Quick Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                className="rounded-full"
              >
                Tous ({stats.total})
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "Non lu" ? "default" : "outline"}
                onClick={() => setFilterStatus("Non lu")}
                className="rounded-full bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                style={filterStatus === "Non lu" ? {} : { backgroundColor: 'transparent', color: 'inherit' }}
              >
                <Clock className="h-3 w-3 mr-1" />
                Non lus ({stats.non_lu})
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "Lu" ? "default" : "outline"}
                onClick={() => setFilterStatus("Lu")}
                className="rounded-full"
              >
                <Eye className="h-3 w-3 mr-1" />
                Lus ({stats.lu})
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "Traité" ? "default" : "outline"}
                onClick={() => setFilterStatus("Traité")}
                className="rounded-full"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Traités ({stats.traite})
              </Button>
            </div>
            
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
          </div>
        </CardContent>
      </Card>

      {/* Split-Pane Inbox Layout */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left Panel - Message List */}
        <Card className="w-full md:w-2/5 flex flex-col overflow-hidden">
          <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p className="text-gray-500 text-sm">Chargement des messages...</p>
                </div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-900 font-medium mb-1">Aucun message trouvé</p>
                <p className="text-gray-500 text-sm text-center">
                  {searchQuery ? "Essayez de modifier votre recherche" : "Les nouveaux messages apparaîtront ici"}
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto divide-y divide-gray-200">
                {filteredContacts.map((contact) => {
                  const isSelected = selectedContact?.id === contact.id
                  const isUnread = contact.statut === 'Non lu'
                  
                  return (
                    <div
                      key={contact.id}
                      onClick={() => handleRowClick(contact)}
                      className={`p-4 cursor-pointer transition-all hover:bg-gray-50 relative group ${
                        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      } ${isUnread ? 'bg-yellow-50/50' : ''}`}
                    >
                      {/* Status Indicator */}
                      {isUnread && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-500 rounded-full"></div>
                      )}
                      
                      <div className={`flex gap-3 ${isUnread ? 'ml-2' : ''}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          isUnread ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}>
                          {contact.prenom.charAt(0)}{contact.nom.charAt(0)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className={`text-sm truncate ${isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                              {contact.prenom} {contact.nom}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {(() => {
                                const date = new Date(contact.created_at)
                                const now = new Date()
                                const diffMs = now.getTime() - date.getTime()
                                const diffMins = Math.floor(diffMs / 60000)
                                const diffHours = Math.floor(diffMs / 3600000)
                                const diffDays = Math.floor(diffMs / 86400000)
                                
                                if (diffMins < 60) return `${diffMins}m`
                                if (diffHours < 24) return `${diffHours}h`
                                if (diffDays < 7) return `${diffDays}j`
                                return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                              })()}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-2 flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {contact.telephone}
                          </p>
                          
                          {contact.message && (
                            <p className={`text-xs line-clamp-2 ${isUnread ? 'text-gray-700' : 'text-gray-500'}`}>
                              {contact.message}
                            </p>
                          )}
                          
                          {/* Quick Actions - Show on Hover */}
                          <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleWhatsAppClick(contact)
                              }}
                              title="WhatsApp"
                            >
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.location.href = `tel:${contact.telephone}`
                              }}
                              title="Appeler"
                            >
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.location.href = `mailto:${contact.email}`
                              }}
                              title="Email"
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="flex-shrink-0">
                          {contact.statut === 'Non lu' && (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          )}
                          {contact.statut === 'Lu' && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          {contact.statut === 'Traité' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Panel - Message Details */}
        <Card className="hidden md:flex md:w-3/5 flex-col overflow-hidden">
          <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
            {selectedContact ? (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {selectedContact.prenom.charAt(0)}{selectedContact.nom.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {selectedContact.prenom} {selectedContact.nom}
                        </h2>
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
                    
                    {/* Status Selector */}
                    <Select
                      value={selectedContact.statut}
                      onValueChange={(value) => updateStatus(selectedContact.id, value as 'Non lu' | 'Lu' | 'Traité')}
                    >
                      <SelectTrigger className="w-40">
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
                        <SelectItem value="Traité">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            Traité
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contact Info Cards */}
                <div className="p-6 border-b bg-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Téléphone</p>
                        <p className="font-medium text-gray-900">{selectedContact.telephone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-900 truncate">{selectedContact.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {selectedContact.message ? (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Message</h3>
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
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-green-600 text-white hover:bg-green-700 h-12"
                      onClick={() => handleWhatsAppClick(selectedContact)}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp
                    </Button>
                    <a href={`tel:${selectedContact.telephone}`} className="flex-1">
                      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 h-12">
                        <Phone className="h-5 w-5 mr-2" />
                        Appeler
                      </Button>
                    </a>
                    <a href={`mailto:${selectedContact.email}`} className="flex-1">
                      <Button className="w-full bg-purple-600 text-white hover:bg-purple-700 h-12">
                        <Mail className="h-5 w-5 mr-2" />
                        Email
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => deleteContact(selectedContact.id)}
                    >
                      <Trash2 className="h-5 w-5" />
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

      {/* Mobile Modal for Message Details */}
      <Dialog open={!!selectedContact && window.innerWidth < 768} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du message</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              {/* Contact Info */}
              <div className="flex gap-4 items-center pb-4 border-b">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {selectedContact.prenom.charAt(0)}{selectedContact.nom.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-lg">{selectedContact.prenom} {selectedContact.nom}</p>
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

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Téléphone</p>
                    <p className="font-medium">{selectedContact.telephone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{selectedContact.email}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedContact.message && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Message</p>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Statut</p>
                <Select
                  value={selectedContact.statut}
                  onValueChange={(value) => updateStatus(selectedContact.id, value as 'Non lu' | 'Lu' | 'Traité')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Non lu">Non lu</SelectItem>
                    <SelectItem value="Lu">Lu</SelectItem>
                    <SelectItem value="Traité">Traité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                  onClick={() => handleWhatsAppClick(selectedContact)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <a href={`tel:${selectedContact.telephone}`} className="w-full">
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                </a>
                <a href={`mailto:${selectedContact.email}`} className="w-full">
                  <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </a>
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => deleteContact(selectedContact.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
