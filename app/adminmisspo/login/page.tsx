"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogIn, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // Charger les identifiants sauvegardés au montage du composant
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail")
    const savedPassword = localStorage.getItem("rememberedPassword")
    if (savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      // Appel à l'API Laravel
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Sauvegarder ou supprimer les identifiants selon la checkbox
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email)
          localStorage.setItem("rememberedPassword", password)
        } else {
          localStorage.removeItem("rememberedEmail")
          localStorage.removeItem("rememberedPassword")
        }
        
        // Stocker les infos de l'admin
        localStorage.setItem("adminAuth", "true")
        localStorage.setItem("adminData", JSON.stringify(data.admin))
        router.push("/adminmisspo/dashboard")
      } else {
        setError(data.message || "Email ou mot de passe incorrect")
      }
    } catch (error) {
      console.error("Erreur de connexion:", error)
      setError("Erreur de connexion au serveur")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBDEE5] via-white to-[#E5F4F9] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Section gauche - Rose */}
          <div className="lg:w-1/2 bg-gradient-to-br from-[#ED7A97] to-[#F29CB1] relative overflow-hidden p-12">
            {/* Forme décorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3"></div>
            
            <div className="relative z-10 flex flex-col justify-center items-center h-full text-white">
              {/* Logo */}
              <div className="mb-8 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-[#ED7A97]">M</span>
                </div>
                <h1 className="text-4xl font-bold mb-2">MISSPO</h1>
                <p className="text-white/90">Administration</p>
              </div>

              {/* Message de bienvenue */}
              <div className="text-center max-w-sm">
                <h2 className="text-2xl font-bold mb-3">Bienvenue !</h2>
                <p className="text-white/90 leading-relaxed">
                  Connectez-vous pour accéder au panneau d'administration et gérer vos réservations
                </p>
              </div>

              {/* Info credentials */}
              <div className="mt-8 p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                <p className="text-sm text-center text-white/90">
                  <span className="font-semibold">Email:</span> admin@misspo.com<br />
                  <span className="font-semibold">Mot de passe:</span> misspo2026
                </p>
              </div>
            </div>
          </div>

          {/* Section droite - Blanc */}
          <div className="lg:w-1/2 p-12 flex items-center justify-center">
            <div className="w-full max-w-sm">
              {/* Logo mobile */}
              <div className="lg:hidden text-center mb-6">
                <h1 className="text-2xl font-bold text-[#ED7A97]">MISSPO</h1>
                <p className="text-sm text-gray-600 mt-1">Panneau d'administration</p>
              </div>

              {/* Titre */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Connexion</h2>
                <p className="text-gray-600 text-sm">Connectez-vous à votre compte</p>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre email"
                    required
                    className="mt-2 h-11 border-2 border-gray-200 focus:border-[#ED7A97] rounded-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium">Mot de passe</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      required
                      className="h-11 border-2 border-gray-200 focus:border-[#ED7A97] rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Se souvenir de moi
                  </label>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                  style={{ 
                    backgroundColor: '#ED7A97',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F29CB1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ED7A97'
                  }}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Se connecter
                </Button>
              </form>

              {/* Info mobile */}
              <div className="lg:hidden mt-6 p-3 bg-[#FBDEE5] rounded-lg">
                <p className="text-xs text-center text-gray-600">
                  <span className="font-semibold">Email:</span> admin@misspo.com<br />
                  <span className="font-semibold">Mot de passe:</span> misspo2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
