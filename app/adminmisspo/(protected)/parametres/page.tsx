"use client"

import { useState } from "react"
import { Settings, Mail, Lock, User, Edit, Save, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ParametresPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentEmail: "admin@misspo.com",
    newEmail: "admin@misspo.com",
    newPassword: ""
  })

  const handleSave = () => {
    // TODO: Appel API pour sauvegarder les modifications
    console.log("Sauvegarde:", formData)
    setIsEditing(false)
    setShowPassword(false)
  }

  const handleCancel = () => {
    setFormData({
      ...formData,
      newEmail: formData.currentEmail,
      newPassword: ""
    })
    setIsEditing(false)
    setShowPassword(false)
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#ED7A97]" />
                  Informations du compte
                </CardTitle>
                <CardDescription>
                  Informations actuelles de votre compte administrateur
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="text-[#ED7A97] border-[#ED7A97] hover:bg-[#ED7A97] hover:text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="text-gray-600"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-[#ED7A97] hover:bg-[#F29CB1] text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!isEditing ? (
                <>
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
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Adresse email
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="email"
                        type="email"
                        value={formData.newEmail}
                        onChange={(e) => setFormData({ ...formData, newEmail: e.target.value })}
                        className="pl-10"
                      />
                      <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">
                      Nouveau mot de passe (laisser vide pour ne pas changer)
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        placeholder="Entrez un nouveau mot de passe"
                        className="pl-10 pr-10"
                      />
                      <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 8 caractères
                    </p>
                  </div>
                </>
              )}
            </div>
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
