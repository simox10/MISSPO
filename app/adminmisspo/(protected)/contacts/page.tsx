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
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages de Contact</h1>
        <p className="text-muted-foreground mt-1">Gérer les messages reçus via le formulaire de contact</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Non lus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.non_lu}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Lus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.lu}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Traités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.traite}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom, téléphone ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="Non lu">Non lus</SelectItem>
                  <SelectItem value="Lu">Lus</SelectItem>
                  <SelectItem value="Traité">Traités</SelectItem>
                </SelectContent>
              </Select>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom Complet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      onClick={() => handleRowClick(contact)}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                        contact.statut === 'Non lu' ? 'bg-yellow-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(contact.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.prenom} {contact.nom}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contact.telephone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`border ${getStatutBadge(contact.statut)}`}>
                          {getStatutIcon(contact.statut)}
                          {contact.statut}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleWhatsAppClick(contact)
                            }}
                            title="WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteContact(contact.id)
                            }}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Details Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du message</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium">{selectedContact.prenom} {selectedContact.nom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(selectedContact.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{selectedContact.telephone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedContact.email}</p>
                </div>
              </div>

              {/* Message */}
              {selectedContact.message && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Message</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Statut</p>
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
              <div className="flex gap-2 pt-4 border-t">
                <a href={`tel:${selectedContact.telephone}`} className="flex-1">
                  <Button className="w-full bg-misspo-blue-dark text-white hover:bg-misspo-blue">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                </a>
                <Button
                  className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  onClick={() => handleWhatsAppClick(selectedContact)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <a href={`mailto:${selectedContact.email}`} className="flex-1">
                  <Button className="w-full bg-misspo-rose-dark text-white hover:bg-misspo-rose">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
