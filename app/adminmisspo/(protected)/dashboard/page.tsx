"use client"

import { useState } from "react"
import { Search, Eye, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { reservations, type Reservation } from "../../data/reservations"

export default function DashboardPage() {
  const [search, setSearch] = useState("")
  const [filterPack, setFilterPack] = useState<string>("all")
  const [filterStatut, setFilterStatut] = useState<string>("all")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  const filteredReservations = reservations.filter((res) => {
    const matchSearch = 
      res.nom.toLowerCase().includes(search.toLowerCase()) ||
      res.prenom.toLowerCase().includes(search.toLowerCase()) ||
      res.telephone.includes(search)
    
    const matchPack = filterPack === "all" || res.pack === filterPack
    const matchStatut = filterStatut === "all" || res.statut === filterStatut

    return matchSearch && matchPack && matchStatut
  })

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
      ? "bg-misspo-blue-pale text-misspo-blue-dark"
      : "bg-misspo-rose-pale text-misspo-rose-dark"
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau des Réservations</h1>
        <p className="text-muted-foreground mt-1">Gérez toutes vos réservations</p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, prénom ou téléphone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterPack} onValueChange={setFilterPack}>
            <SelectTrigger>
              <SelectValue placeholder="Pack" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les packs</SelectItem>
              <SelectItem value="École">Pack École</SelectItem>
              <SelectItem value="Domicile">Pack Domicile</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="Confirmée">Confirmée</SelectItem>
              <SelectItem value="En attente">En attente</SelectItem>
              <SelectItem value="Annulée">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{reservations.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-green-700">Confirmées</p>
          <p className="text-2xl font-bold text-green-700">
            {reservations.filter(r => r.statut === "Confirmée").length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-yellow-700">En attente</p>
          <p className="text-2xl font-bold text-yellow-700">
            {reservations.filter(r => r.statut === "En attente").length}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-red-700">Annulées</p>
          <p className="text-2xl font-bold text-red-700">
            {reservations.filter(r => r.statut === "Annulée").length}
          </p>
        </div>
      </div>

      {/* Table Desktop */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Heure</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pack</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(reservation.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-gray-500">{reservation.heure}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      {reservation.prenom} {reservation.nom}
                    </div>
                    <div className="text-sm text-gray-500">{reservation.email}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {reservation.telephone}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge className={getPackBadge(reservation.pack)}>
                      {reservation.pack}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge className={getStatutBadge(reservation.statut)}>
                      {reservation.statut}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedReservation(reservation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
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

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune réservation trouvée</p>
          </div>
        )}
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {filteredReservations.map((reservation) => (
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
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {filteredReservations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-muted-foreground">Aucune réservation trouvée</p>
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
    </div>
  )
}
