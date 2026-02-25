"use client"

import { useState } from "react"
import { Settings, Mail, Lock, Eye, EyeOff, Save, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ParametresPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    currentEmail: "admin@misspo.com",
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Appel API pour changer l'email
    console.log("Changement d'email:", formData.newEmail)
  }

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Appel API pour changer le mot de passe
    console.log("Changement de mot de passe")
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#ED7A97] rounded-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
        </div>
        <p className="text-gray-600">Gérez vos informations de connexion</p>
      </div>

      <div className="space-y-6">
        {/* Informations du compte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#ED7A97]" />
              Informations du compte
            </CardTitle>
            <CardDescription>
              Informations actuelles de votre compte administrateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Email actuel</p>
                  <p className="font-semibold text-gray-800">{formData.currentEmail}</p>
                </div>
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Mot de passe</p>
                  <p className="font-semibold text-gray-800">••••••••</p>
                </div>
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changer l'email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#ED7A97]" />
              Changer l'adresse email
            </CardTitle>
            <CardDescription>
              Modifiez l'adresse email utilisée pour vous connecter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitEmail} className="space-y-4">
              <div>
                <Label htmlFor="newEmail">Nouvelle adresse email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="nouvelle@email.com"
                  value={formData.newEmail}
                  onChange={(e) => setFormData({ ...formData, newEmail: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#ED7A97] hover:bg-[#F29CB1] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer le nouvel email
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Changer le mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#ED7A97]" />
              Changer le mot de passe
            </CardTitle>
            <CardDescription>
              Assurez-vous d'utiliser un mot de passe sécurisé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <div className="relative mt-2">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe actuel"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="pr-10"
                    required
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

              <div>
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <div className="relative mt-2">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Entrez votre nouveau mot de passe"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="pr-10"
                    required
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

              <div>
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <div className="relative mt-2">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre nouveau mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pr-10"
                    required
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

              <Button 
                type="submit" 
                className="w-full bg-[#ED7A97] hover:bg-[#F29CB1] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer le nouveau mot de passe
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Conseils de sécurité */}
        <Card className="border-[#2DA1CA] bg-[#E5F4F9]">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="p-2 bg-[#2DA1CA] rounded-lg">
                  <Lock className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Conseils de sécurité</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Utilisez un mot de passe unique et complexe</li>
                  <li>• Changez votre mot de passe régulièrement</li>
                  <li>• Ne partagez jamais vos identifiants</li>
                  <li>• Déconnectez-vous après chaque session</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
