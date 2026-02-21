"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"
import { getRealtimeManager, type RealtimeMode } from "@/lib/realtime-manager"

export function RealtimeStatus() {
  const [mode, setMode] = useState<RealtimeMode>("websocket")
  const [reason, setReason] = useState<string>("within_limits")
  const [countdown, setCountdown] = useState<number>(0)

  useEffect(() => {
    const manager = getRealtimeManager()

    // Initialize manager with callbacks
    manager.initialize({
      onModeChange: (newMode, newReason) => {
        setMode(newMode)
        setReason(newReason)
      },
    })

    // Update countdown for polling mode
    let countdownInterval: NodeJS.Timeout | null = null
    
    if (mode === "polling") {
      const pollingInterval = manager.getPollingInterval()
      setCountdown(pollingInterval / 1000)
      
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return pollingInterval / 1000
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    }
  }, [mode])

  const getModeLabel = () => {
    if (mode === "websocket") {
      return "Temps réel"
    }
    return `Polling (${countdown}s)`
  }

  const getModeColor = () => {
    return mode === "websocket" ? "text-green-600" : "text-orange-600"
  }

  const getReasonLabel = () => {
    switch (reason) {
      case "daily_limit_exceeded":
        return "Limite quotidienne atteinte"
      case "connection_limit_exceeded":
        return "Limite de connexions atteinte"
      case "status_check_failed":
        return "Vérification échouée"
      default:
        return ""
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg border border-gray-200">
        {mode === "websocket" ? (
          <Wifi className={`h-4 w-4 ${getModeColor()}`} />
        ) : (
          <RefreshCw className={`h-4 w-4 ${getModeColor()} animate-spin`} />
        )}
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${getModeColor()}`}>
            {getModeLabel()}
          </span>
          {mode === "polling" && reason !== "within_limits" && (
            <span className="text-xs text-gray-500">
              {getReasonLabel()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
