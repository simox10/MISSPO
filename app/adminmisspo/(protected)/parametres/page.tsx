"use client"

import { useState } from "react"
import { Settings, Eye, EyeOff, Save, User, Edit2, X, ChevronDown, ChevronUp, HelpCircle, Plus, MoreVertical, GripVertical, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FAQ {
  id: number
  question: string
  answer: string
  order: number
}

export default function ParametresPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // FAQ States
  const [faqs, setFaqs] = useState<FAQ[]>([
    { id: 1, question: "Comment être sûr que mon enfant a des poux ?", answer: "Le symptôme le plus évident est la démangeaison. L'envie de se gratter est une réaction allergique à la salive que le pou injecte dans le sang pour le fluidité.", order: 1 },
    { id: 2, question: "Comment les attrape-t-on ?", answer: "Dans la plupart des cas les poux s'attrapent par contact direct tête contre tête. Ils peuvent toutefois se transmettre par contact indirect avec des objets.", order: 2 },
    { id: 3, question: "Y-a-t-il des profils plus propices que d'autres ?", answer: "Oui, il y a des personnes qui sont plus propices que d'autres. La cause de cette fragilité est notre odeur corporelle.", order: 3 },
  ])
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null)
  const [isAddingFaq, setIsAddingFaq] = useState(false)
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null)
  const [deletingFaqId, setDeletingFaqId] = useState<number | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  const [newFaq, setNewFaq] = useState({ question: "", answer: "" })
  const [editFaq, setEditFaq] = useState({ question: "", answer: "" })

  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "MISSPO",
    email: "admin@misspo.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsPasswordExpanded(false)
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Mise à jour des informations:", formData)
    setIsEditing(false)
    setIsPasswordExpanded(false)
  }

  // FAQ Functions
  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      const newId = Math.max(...faqs.map(f => f.id), 0) + 1
      setFaqs([...faqs, { ...newFaq, id: newId, order: faqs.length + 1 }])
      setNewFaq({ question: "", answer: "" })
      setIsAddingFaq(false)
      setHasUnsavedChanges(true)
    }
  }

  const handleEditFaq = (id: number) => {
    const faq = faqs.find(f => f.id === id)
    if (faq) {
      setEditFaq({ question: faq.question, answer: faq.answer })
      setEditingFaqId(id)
    }
  }

  const handleSaveEdit = () => {
    if (editingFaqId && editFaq.question && editFaq.answer) {
      setFaqs(faqs.map(f => f.id === editingFaqId ? { ...f, question: editFaq.question, answer: editFaq.answer } : f))
      setEditingFaqId(null)
      setEditFaq({ question: "", answer: "" })
      setHasUnsavedChanges(true)
    }
  }

  const handleDeleteFaq = () => {
    if (deletingFaqId) {
      setFaqs(faqs.filter(f => f.id !== deletingFaqId).map((f, index) => ({ ...f, order: index + 1 })))
      setDeletingFaqId(null)
      setHasUnsavedChanges(true)
    }
  }

  const handleDragStart = (id: number) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault()
    if (draggedItem === null || draggedItem === id) return

    const draggedIndex = faqs.findIndex(f => f.id === draggedItem)
    const targetIndex = faqs.findIndex(f => f.id === id)

    const newFaqs = [...faqs]
    const [removed] = newFaqs.splice(draggedIndex, 1)
    newFaqs.splice(targetIndex, 0, removed)

    setFaqs(newFaqs.map((f, index) => ({ ...f, order: index + 1 })))
    setHasUnsavedChanges(true)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleSaveFaqs = () => {
    setShowSaveConfirm(true)
  }

  const confirmSaveFaqs = () => {
    console.log("Sauvegarde des FAQs:", faqs)
    setHasUnsavedChanges(false)
    setShowSaveConfirm(false)
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Paramètres</h1>
        <p className="text-sm sm:text-base text-gray-600">Gérez vos informations de connexion</p>
      </div>

      <div className="space-y-6">
        {/* Informations du compte */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#ED7A97]" />
                  Informations du compte
                </CardTitle>
                <CardDescription className="text-sm">
                  Gérez vos informations personnelles et de connexion
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="border-[#ED7A97] text-[#ED7A97] hover:bg-[#FBDEE5] w-full sm:w-auto"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Prénom et Nom sur une ligne (stack sur mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              {/* Email avec bouton (stack sur mobile) */}
              <div>
                <Label htmlFor="email">Adresse email</Label>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="flex-1"
                    required
                  />
                  {isEditing && (
                    <Button 
                      type="button"
                      className="bg-[#2DA1CA] hover:bg-[#96D0E5] text-white whitespace-nowrap w-full sm:w-auto"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                  )}
                </div>
              </div>

              {/* Mot de passe avec flèche à droite */}
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                
                {!isEditing ? (
                  <div className="relative mt-2">
                    <Input
                      type="password"
                      value="••••••••"
                      disabled
                    />
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="relative">
                      <Input
                        type="password"
                        value="••••••••"
                        disabled
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordExpanded(!isPasswordExpanded)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ED7A97] hover:text-[#F29CB1] transition-all duration-300"
                        title={isPasswordExpanded ? "Masquer" : "Modifier le mot de passe"}
                      >
                        {isPasswordExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
                    <div 
                      className="overflow-hidden transition-all duration-700 ease-in-out"
                      style={{
                        maxHeight: isPasswordExpanded ? '400px' : '0',
                        opacity: isPasswordExpanded ? 1 : 0,
                        marginTop: isPasswordExpanded ? '16px' : '0'
                      }}
                    >
                      <div className="space-y-4">
                        {/* Mot de passe actuel */}
                        <div>
                          <Label htmlFor="currentPassword" className="text-sm">Mot de passe actuel</Label>
                          <div className="relative mt-2">
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="Entrez votre mot de passe actuel"
                              value={formData.currentPassword}
                              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Nouveau mot de passe */}
                        <div>
                          <Label htmlFor="newPassword" className="text-sm">Nouveau mot de passe</Label>
                          <div className="relative mt-2">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Entrez votre nouveau mot de passe"
                              value={formData.newPassword}
                              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Minimum 8 caractères
                          </p>
                        </div>

                        {/* Confirmer le nouveau mot de passe */}
                        <div>
                          <Label htmlFor="confirmPassword" className="text-sm">Confirmer le nouveau mot de passe</Label>
                          <div className="relative mt-2">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirmez votre nouveau mot de passe"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Boutons d'action (stack sur mobile) */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-[#ED7A97] hover:bg-[#F29CB1] text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>


        {/* Gestion des FAQ */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#ED7A97]" />
                  Gestion des FAQ
                </CardTitle>
                <CardDescription className="text-sm">
                  Gérez les questions fréquemment posées (3 premières sur la page d'accueil)
                </CardDescription>
              </div>
              <Button
                onClick={handleSaveFaqs}
                disabled={!hasUnsavedChanges}
                className={`w-full sm:w-auto ${hasUnsavedChanges ? 'bg-[#ED7A97] hover:bg-[#F29CB1]' : 'bg-gray-300'} text-white`}
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Liste des FAQs */}
              {faqs.sort((a, b) => a.order - b.order).map((faq) => (
                <div
                  key={faq.id}
                  draggable
                  onDragStart={() => handleDragStart(faq.id)}
                  onDragOver={(e) => handleDragOver(e, faq.id)}
                  onDragEnd={handleDragEnd}
                  className={`border rounded-lg p-4 bg-white transition-all duration-200 ${
                    draggedItem === faq.id ? 'opacity-50' : 'opacity-100'
                  } hover:shadow-md cursor-move`}
                >
                  {editingFaqId === faq.id ? (
                    // Mode édition
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Question</Label>
                        <Input
                          value={editFaq.question}
                          onChange={(e) => setEditFaq({ ...editFaq, question: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Réponse</Label>
                        <Textarea
                          value={editFaq.answer}
                          onChange={(e) => setEditFaq({ ...editFaq, answer: e.target.value })}
                          className="mt-1 min-h-[100px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          size="sm"
                          className="bg-[#2DA1CA] hover:bg-[#96D0E5] text-white"
                        >
                          Enregistrer
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingFaqId(null)
                            setEditFaq({ question: "", answer: "" })
                          }}
                          size="sm"
                          variant="outline"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Mode affichage
                    <div className="flex items-start gap-3">
                      {/* Icône drag */}
                      <div className="flex-shrink-0 pt-1">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                      </div>

                      {/* Question et réponse */}
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                              {faq.order}. {faq.question}
                            </h4>
                            <ChevronDown
                              className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                                expandedFaqId === faq.id ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </button>

                        {/* Réponse avec animation */}
                        <div
                          className="overflow-hidden transition-all duration-500 ease-in-out"
                          style={{
                            maxHeight: expandedFaqId === faq.id ? '500px' : '0',
                            opacity: expandedFaqId === faq.id ? 1 : 0,
                            marginTop: expandedFaqId === faq.id ? '12px' : '0'
                          }}
                        >
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>

                      {/* Menu 3 points */}
                      <div className="flex-shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditFaq(faq.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Éditer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingFaqId(faq.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </div>
              ))}


              {/* Formulaire d'ajout */}
              {isAddingFaq && (
                <div className="border rounded-lg p-4 bg-[#FBDEE5] space-y-3">
                  <div>
                    <Label className="text-sm">Question</Label>
                    <Input
                      value={newFaq.question}
                      onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                      placeholder="Entrez la question"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Réponse</Label>
                    <Textarea
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                      placeholder="Entrez la réponse"
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddFaq}
                      size="sm"
                      className="bg-[#ED7A97] hover:bg-[#F29CB1] text-white"
                    >
                      Enregistrer
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingFaq(false)
                        setNewFaq({ question: "", answer: "" })
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}

              {/* Bouton Ajouter une question */}
              {!isAddingFaq && (
                <Button
                  onClick={() => setIsAddingFaq(true)}
                  variant="outline"
                  className="w-full border-dashed border-2 border-[#ED7A97] text-[#ED7A97] hover:bg-[#FBDEE5]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une question
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deletingFaqId !== null} onOpenChange={() => setDeletingFaqId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFaq}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmation de sauvegarde */}
      <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la sauvegarde</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir sauvegarder les modifications des FAQ ? Les changements seront visibles sur le site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSaveFaqs}
              className="bg-[#ED7A97] hover:bg-[#F29CB1]"
            >
              Sauvegarder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
