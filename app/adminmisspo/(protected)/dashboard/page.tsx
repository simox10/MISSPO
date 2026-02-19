"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Settings2, ChevronLeft, ChevronRight, Edit, MessageCircle, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

export default function DashboardPage() {
  const [search, setSearch] = useState("")
  const [filterPack, setFilterPack] = useState<string>("all")
  const [filterStatut, setFilterStatut] = useState<string>("all")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
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
  const itemsPerPage = 10
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    client: true,
    telephone: true,
    pack: true,
    statut: true,
    actions: true,
  })

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterPack, filterStatut])

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
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau des Réservations</h1>
        <p className="text-muted-foreground mt-1">Gérez toutes vos réservations</p>
      </div>

      {/* Stats - En haut */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg shadow-sm p-4" style={{ backgroundColor: '#E5F4F9' }}>
          <p className="text-sm" style={{ color: '#2da1ca' }}>Total</p>
          <p className="text-2xl font-bold" style={{ color: '#2da1ca' }}>{reservations.length}</p>
        </div>
        <div className="rounded-lg shadow-sm p-4" style={{ backgroundColor: '#E5F4F9' }}>
          <p className="text-sm" style={{ color: '#2da1ca' }}>Confirmées</p>
          <p className="text-2xl font-bold" style={{ color: '#2da1ca' }}>
            {reservations.filter(r => r.statut === "Confirmée").length}
          </p>
        </div>
        <div className="rounded-lg shadow-sm p-4" style={{ backgroundColor: '#E5F4F9' }}>
          <p className="text-sm" style={{ color: '#2da1ca' }}>En attente</p>
          <p className="text-2xl font-bold" style={{ color: '#2da1ca' }}>
            {reservations.filter(r => r.statut === "En attente").length}
          </p>
        </div>
        <div className="rounded-lg shadow-sm p-4" style={{ backgroundColor: '#E5F4F9' }}>
          <p className="text-sm" style={{ color: '#2da1ca' }}>Annulées</p>
          <p className="text-2xl font-bold" style={{ color: '#2da1ca' }}>
            {reservations.filter(r => r.statut === "Annulée").length}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
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
              <SelectItem 
                value="all" 
                className="data-[highlighted]:font-bold focus:font-bold"
                style={{ backgroundColor: '#FBDEE5' }}
              >
                Tous les packs
              </SelectItem>
              <SelectItem 
                value="École" 
                className="data-[highlighted]:font-bold focus:font-bold"
                style={{ backgroundColor: '#FBDEE5' }}
              >
                Pack École
              </SelectItem>
              <SelectItem 
                value="Domicile" 
                className="data-[highlighted]:font-bold focus:font-bold"
                style={{ backgroundColor: '#FBDEE5' }}
              >
                Pack Domicile
              </SelectItem>
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
              <SelectItem 
                value="all" 
                className="data-[highlighted]:font-bold focus:font-bold"
                style={{ backgroundColor: '#FBDEE5' }}
              >
                Tous
              </SelectItem>
              <SelectItem 
                value="En attente" 
                className="data-[highlighted]:font-bold focus:font-bold"
                style={{ backgroundColor: '#FBDEE5' }}
              >
                En attente
              </SelectItem>
              <SelectItem 
                value="Confirmé" 
                className="data-[highlighted]:font-bold focus:font-bold"
                style={{ backgroundColor: '#FBDEE5' }}
              >
                Confirmé
              </SelectItem>
              <SelectItem 
                value="Terminé" 
                className="data-[highlighted]:font-bold focus:font-bold"
                style={{ backgroundColor: '#FBDEE5' }}
              >
                Terminé
              </SelectItem>
              <SelectItem 
                value="Refusé" 
                className="data-[highlighted]:font-bold focus:font-bold"
                style={{ backgroundColor: '#FBDEE5' }}
              >
                Refusé
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtre des colonnes */}
      <div className="flex justify-end gap-3 mb-4">
        <Button
          className="border-2 hover:shadow-md transition-all"
          style={{ 
            borderColor: '#ED7A97',
            backgroundColor: '#ED7A97',
            color: 'white',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F29CB1'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ED7A97'
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F29CB1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ED7A97'
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
                          onClick={() => setEditingReservation(reservation)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => {
                            const message = `Bonjour ${reservation.prenom} ${reservation.nom}, concernant votre réservation du ${new Date(reservation.date).toLocaleDateString('fr-FR')} à ${reservation.heure}...`
                            const whatsappUrl = `https://wa.me/${reservation.telephone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`
                            window.open(whatsappUrl, '_blank')
                          }}
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

            <div className="space-y-2 mb-3">
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

            <div className="flex gap-2 pt-3 border-t">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedReservation(reservation)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => setEditingReservation(reservation)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 hover:text-green-700"
                onClick={() => {
                  const message = `Bonjour ${reservation.prenom} ${reservation.nom}, concernant votre réservation du ${new Date(reservation.date).toLocaleDateString('fr-FR')} à ${reservation.heure}...`
                  const whatsappUrl = `https://wa.me/${reservation.telephone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`
                  window.open(whatsappUrl, '_blank')
                }}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
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
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-700 text-center mb-3">
              Page {currentPage} sur {totalPages} ({filteredReservations.length} résultats)
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

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

      {/* Dialog Modification */}
      <Dialog open={!!editingReservation} onOpenChange={() => setEditingReservation(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la réservation</DialogTitle>
          </DialogHeader>
          {editingReservation && (
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault()
              // Logique de sauvegarde à implémenter
              console.log("Sauvegarder", editingReservation)
              setEditingReservation(null)
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
                    onChange={(e) => setEditingReservation({...editingReservation, date: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-heure">Heure</Label>
                  <Input
                    id="edit-heure"
                    type="time"
                    value={editingReservation.heure}
                    onChange={(e) => setEditingReservation({...editingReservation, heure: e.target.value})}
                    className="mt-1"
                  />
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
                      <SelectItem value="Confirmé">Confirmé</SelectItem>
                      <SelectItem value="Terminé">Terminé</SelectItem>
                      <SelectItem value="Refusé">Refusé</SelectItem>
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
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault()
            // Logique d'ajout à implémenter
            console.log("Ajouter", newReservation)
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
                  onChange={(e) => setNewReservation({...newReservation, date: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-heure">Heure *</Label>
                <Input
                  id="new-heure"
                  type="time"
                  value={newReservation.heure}
                  onChange={(e) => setNewReservation({...newReservation, heure: e.target.value})}
                  className="mt-1"
                  required
                />
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
                    <SelectItem value="Confirmé">Confirmé</SelectItem>
                    <SelectItem value="Terminé">Terminé</SelectItem>
                    <SelectItem value="Refusé">Refusé</SelectItem>
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
