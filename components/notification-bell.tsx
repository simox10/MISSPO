"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { api, type Notification } from "@/lib/api"
import { getRealtimeManager } from "@/lib/realtime-manager"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications()
      setNotifications(data)
      const unread = data.filter(n => !n.read_at).length
      setUnreadCount(unread)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  // Fetch unread count only
  const fetchUnreadCount = async () => {
    try {
      const count = await api.getUnreadNotificationCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  // Mark notification as read
  const markAsRead = async (id: number) => {
    try {
      await api.markNotificationAsRead(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead()
      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      )
      setUnreadCount(0)
      toast.success('Toutes les notifications ont été marquées comme lues')
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast.error('Erreur lors du marquage des notifications')
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchNotifications()

    const manager = getRealtimeManager()

    // Subscribe to notifications channel
    manager.subscribe(
      'notifications',
      '.notification.created',
      (data: any) => {
        console.log('New notification received:', data)
        
        // Add new notification to the list
        const newNotification: Notification = {
          id: data.id,
          appointment_id: data.appointment_id,
          message: data.message,
          read_at: null,
          created_at: data.created_at,
          client: data.client,
          appointment: data.appointment,
        }
        
        setNotifications(prev => [newNotification, ...prev])
        setUnreadCount(prev => prev + 1)
        
        // Show toast notification
        toast.info(`Nouvelle réservation de ${data.client.prenom} ${data.client.nom}`, {
          description: `${data.appointment.date} à ${data.appointment.heure}`,
        })
      }
    )

    // Polling fallback for unread count
    const pollInterval = setInterval(() => {
      if (manager.getMode() === 'polling') {
        fetchUnreadCount()
      }
    }, manager.getPollingInterval())

    return () => {
      clearInterval(pollInterval)
      manager.unsubscribe('notifications', '.notification.created')
    }
  }, [])

  // Fetch full notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "À l'instant"
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-1 text-xs"
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-1 px-4 py-3 cursor-pointer ${
                  !notification.read_at ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  if (!notification.read_at) {
                    markAsRead(notification.id)
                  }
                }}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-tight">
                    {notification.message}
                  </p>
                  {!notification.read_at && (
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(notification.created_at)}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
