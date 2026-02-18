"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Credentials statiques
    if (email === "admin@misspo.com" && password === "misspo2026") {
      localStorage.setItem("adminAuth", "true")
      router.push("/adminmisspo/dashboard")
    } else {
      setError("Email ou mot de passe incorrect")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-misspo-rose-pale via-white to-misspo-blue-pale flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-misspo-rose-dark">MISSPO</h1>
            <p className="text-sm text-muted-foreground mt-2">Panneau d'administration</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@misspo.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-misspo-rose-dark hover:bg-misspo-rose text-white"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Se connecter
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-misspo-blue-pale rounded-lg">
            <p className="text-xs text-center text-muted-foreground">
              Email: admin@misspo.com<br />
              Mot de passe: misspo2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
