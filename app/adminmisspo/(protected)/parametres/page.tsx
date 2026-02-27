"use client"

import { useState, useEffect } from "react"
import { Settings, Eye, EyeOff, Save, User, Edit2, X, ChevronDown, ChevronUp, HelpCircle, Plus, MoreVertical, GripVertical, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getAdminFaqs, createFaq, updateFaq, reorderFaqs, deleteFaq, type AdminFAQ } from "@/lib/api/faqs"
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
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // FAQ States
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null)
  const [isAddingFaq, setIsAddingFaq] = useState(false)
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null)
  const [deletingFaqId, setDeletingFaqId] = useState<number | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [loadingFaqs, setLoadingFaqs] = useState(true)

  const [newFaq, setNewFaq] = useState({ question: "", answer: "" })
  const [editFaq, setEditFaq] = useState({ question: "", answer: "" })

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Fetch admin profile on mount
  useEffect(() => {
    fetchAdminProfile()
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      setLoadingFaqs(true)
      const data = await getAdminFaqs()
      setFaqs(data.map(faq => ({
        id: faq.id,
        question: faq.question_fr,
        answer: faq.answer_fr,
        order: faq.order
      })))
    } catch (error) {
      console.error("Erreur lors du chargement des FAQs:", error)
      toast.error('Erreur de chargement des FAQs')
    } finally {
      setLoadingFaqs(false)
    }
  }

  const fetchAdminProfile = async () => {
    try {
      setLoading(true)
      
      // Get admin data from localStorage
      const adminDataStr = localStorage.getItem('adminData')
      if (!adminDataStr) {
        toast.error('Session expirée, veuillez vous reconnecter')
        return
      }
      
      const adminData = JSON.parse(adminDataStr)
      
      const response = await fetch(`${API_URL}/admin/profile?admin_id=${adminData.id}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData({
          firstName: data.admin.prenom || "",
          lastName: data.admin.nom || "",
          email: data.admin.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
      } else {
        toast.error(data.message || 'Erreur de chargement du profil')
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error)
      toast.error('Erreur de chargement du profil')
    } finally {
      setLoading(false)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      
      // Get admin data from localStorage
      const adminDataStr = localStorage.getItem('adminData')
      if (!adminDataStr) {
        toast.error('Session expirée, veuillez vous reconnecter')
        return
      }
      
      const adminData = JSON.parse(adminDataStr)
      
      // Update profile info (name and email)
      const profileResponse = await fetch(`${API_URL}/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id: adminData.id,
          prenom: formData.firstName,
          nom: formData.lastName,
          email: formData.email,
        })
      })
      
      const profileData = await profileResponse.json()
      
      if (!profileData.success) {
        toast.error(profileData.message || 'Erreur lors de la mise à jour du profil')
        setSaving(false)
        return
      }
      
      // Update localStorage with new data
      localStorage.setItem('adminData', JSON.stringify(profileData.admin))
      
      // If password fields are filled, update password
      if (formData.currentPassword && formData.newPassword && formData.confirmPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('Les mots de passe ne correspondent pas')
          setSaving(false)
          return
        }
        
        const passwordResponse = await fetch(`${API_URL}/admin/profile/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            admin_id: adminData.id,
            current_password: formData.currentPassword,
            new_password: formData.newPassword,
            new_password_confirmation: formData.confirmPassword,
          })
        })
        
        const passwordData = await passwordResponse.json()
        
        if (!passwordData.success) {
          toast.error(passwordData.message || 'Erreur lors du changement de mot de passe')
          setSaving(false)
          return
        }
        
        toast.success('Profil et mot de passe mis à jour avec succès')
      } else {
        toast.success('Profil mis à jour avec succès')
      }
      
      setIsEditing(false)
      setIsPasswordExpanded(false)
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      console.error("Erreur:", error)
      toast.error('Erreur de connexion au serveur')
    } finally {
      setSaving(false)
    }
  }

  // FAQ Functions
  const handleAddFaq = async () => {
    if (newFaq.question && newFaq.answer) {
      try {
        const result = await createFaq({
          question_fr: newFaq.question,
          answer_fr: newFaq.answer,
          is_active: true
        })
        
        if (result.success) {
          await fetchFaqs()
          setNewFaq({ question: "", answer: "" })
          setIsAddingFaq(false)
          toast.success('FAQ ajoutée avec succès')
        } else {
          toast.error(result.message || 'Erreur lors de l\'ajout')
        }
      } catch (error) {
        console.error("Erreur:", error)
        toast.error('Erreur lors de l\'ajout de la FAQ')
      }
    }
  }

  const handleEditFaq = (id: number) => {
    const faq = faqs.find(f => f.id === id)
    if (faq) {
      setEditFaq({ question: faq.question, answer: faq.answer })
      setEditingFaqId(id)
    }
  }

  const handleSaveEdit = async () => {
    if (editingFaqId && editFaq.question && editFaq.answer) {
      try {
        const result = await updateFaq(editingFaqId, {
          question_fr: editFaq.question,
          answer_fr: editFaq.answer
        })
        
        if (result.success) {
          await fetchFaqs()
          setEditingFaqId(null)
          setEditFaq({ question: "", answer: "" })
          toast.success('FAQ mise à jour avec succès')
        } else {
          toast.error(result.message || 'Erreur lors de la mise à jour')
        }
      } catch (error) {
        console.error("Erreur:", error)
        toast.error('Erreur lors de la mise à jour de la FAQ')
      }
    }
  }

  const handleDeleteFaq = async () => {
    if (deletingFaqId) {
      try {
        const result = await deleteFaq(deletingFaqId)
        
        if (result.success) {
          await fetchFaqs()
          setDeletingFaqId(null)
          toast.success('FAQ supprimée avec succès')
        } else {
          toast.error(result.message || 'Erreur lors de la suppression')
        }
      } catch (error) {
        console.error("Erreur:", error)
        toast.error('Erreur lors de la suppression de la FAQ')
      }
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

  const confirmSaveFaqs = async () => {
    try {
      const faqsToReorder = faqs.map(faq => ({
        id: faq.id,
        order: faq.order
      }))
      
      const result = await reorderFaqs(faqsToReorder)
      
      if (result.success) {
        setHasUnsavedChanges(false)
        setShowSaveConfirm(false)
        toast.success('Ordre des FAQs sauvegardé avec succès')
        
        // Re-fetch from database to confirm persistence
        await fetchFaqs()
      } else {
        toast.error(result.message || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error('Erreur lors de la sauvegarde de l\'ordre')
    }
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Paramètres</h1>
        <p className="text-sm sm:text-base text-gray-600">Gérez vos informations de connexion</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Settings className="h-12 w-12 animate-spin text-[#ED7A97] mx-auto mb-3" />
            <p className="text-gray-500">Chargement...</p>
          </div>
        </div>
      ) : (
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
                    disabled={saving}
                    className="flex-1 bg-[#ED7A97] hover:bg-[#F29CB1] text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
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
            {loadingFaqs ? (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 animate-spin text-[#ED7A97] mx-auto mb-3" />
                <p className="text-gray-500">Chargement des FAQs...</p>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
      )}

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
