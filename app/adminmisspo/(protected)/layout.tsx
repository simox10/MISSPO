"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Calendar, LogOut, Menu, X, ChevronLeft, ChevronRight, Clock, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
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

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (!auth) {
      router.push("/adminmisspo/login")
    }
  }, [router])

  useEffect(() => {
    // Fetch unread contacts count
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/contacts/unread-count`)
        const data = await response.json()
        if (data.success) {
          setUnreadCount(data.count)
        }
      } catch (error) {
        console.error("Erreur:", error)
      }
    }

    fetchUnreadCount()
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminData")
    router.push("/adminmisspo/login")
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Tableau", href: "/adminmisspo/dashboard" },
    { icon: Calendar, label: "Planning", href: "/adminmisspo/planning" },
    { icon: Clock, label: "Horaires", href: "/adminmisspo/horaires" },
    { icon: MessageCircle, label: "Messages", href: "/adminmisspo/contacts", badge: unreadCount },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      {/* Header Mobile */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-misspo-rose-dark">MISSPO Admin</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r
          transform transition-all duration-200 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}>
          <div className="p-6 flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-2xl font-bold text-misspo-rose-dark">MISSPO</h1>
                <p className="text-sm text-muted-foreground">Administration</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <nav className="px-4 space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative
                    ${isActive 
                      ? 'bg-misspo-rose-pale text-misspo-rose-dark font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`
                      ${isCollapsed ? 'absolute -top-1 -right-1' : 'ml-auto'}
                      flex items-center justify-center min-w-[20px] h-5 px-1.5 
                      text-xs font-bold text-white bg-red-500 rounded-full
                    `}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="sticky bottom-0 bg-white p-4 border-t">
            <Button
              onClick={() => setShowLogoutDialog(true)}
              variant="outline"
              className={`w-full text-red-600 hover:text-red-700 hover:bg-red-50 ${isCollapsed ? 'px-2' : 'justify-start'}`}
              title={isCollapsed ? "Déconnexion" : undefined}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="ml-2">Déconnexion</span>}
            </Button>
          </div>
        </aside>

        {/* Overlay Mobile */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Dialog de confirmation de déconnexion */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder au panneau d'administration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Se déconnecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
