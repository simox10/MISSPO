import { getEcho, disconnectEcho } from './echo'
import { api } from './api'

export type RealtimeMode = 'websocket' | 'polling'

export interface RealtimeStatus {
  mode: RealtimeMode
  reason: string
  usage: {
    messages: {
      current: number
      limit: number
      percentage: number
    }
    connections: {
      current: number
      limit: number
      percentage: number
    }
  }
  polling_interval: number
}

export interface RealtimeManagerConfig {
  onModeChange?: (mode: RealtimeMode, reason: string) => void
  onUpdate?: (data: any) => void
  pollingInterval?: number
  statusCheckInterval?: number
}

class RealtimeManager {
  private mode: RealtimeMode = 'websocket'
  private pollingInterval: number = 60000 // 60 seconds
  private statusCheckInterval: number = 300000 // 5 minutes
  private pollingTimer: NodeJS.Timeout | null = null
  private statusCheckTimer: NodeJS.Timeout | null = null
  private config: RealtimeManagerConfig = {}
  private channels: Map<string, any> = new Map()
  private pollingCallbacks: Map<string, () => Promise<any>> = new Map()

  /**
   * Initialize the realtime manager
   */
  async initialize(config: RealtimeManagerConfig = {}) {
    this.config = config
    
    if (config.pollingInterval) {
      this.pollingInterval = config.pollingInterval
    }
    
    if (config.statusCheckInterval) {
      this.statusCheckInterval = config.statusCheckInterval
    }

    // Check initial status
    await this.checkStatus()

    // Start periodic status checks
    this.startStatusChecks()
  }

  /**
   * Check current system status and switch modes if needed
   */
  private async checkStatus() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/system/realtime-status`)
      const status: { success: boolean; mode: RealtimeMode; reason: string; polling_interval: number } = await response.json()

      if (status.success) {
        const newMode = status.mode
        const oldMode = this.mode

        if (newMode !== oldMode) {
          console.log(`[RealtimeManager] Switching from ${oldMode} to ${newMode} (${status.reason})`)
          this.switchMode(newMode, status.reason)
        }

        // Update polling interval from server
        if (status.polling_interval) {
          this.pollingInterval = status.polling_interval * 1000
        }
      }
    } catch (error) {
      console.error('[RealtimeManager] Failed to check status:', error)
      // Fallback to polling on error
      if (this.mode === 'websocket') {
        this.switchMode('polling', 'status_check_failed')
      }
    }
  }

  /**
   * Switch between WebSocket and Polling modes
   */
  private switchMode(newMode: RealtimeMode, reason: string) {
    const oldMode = this.mode
    this.mode = newMode

    if (newMode === 'polling') {
      // Disconnect WebSocket
      this.disconnectWebSocket()
      // Start polling
      this.startPolling()
    } else {
      // Stop polling
      this.stopPolling()
      // Reconnect WebSocket
      this.reconnectWebSocket()
    }

    // Notify callback
    if (this.config.onModeChange) {
      this.config.onModeChange(newMode, reason)
    }
  }

  /**
   * Subscribe to a channel for real-time updates
   */
  subscribe(channelName: string, eventName: string, callback: (data: any) => void, pollingCallback?: () => Promise<any>) {
    if (this.mode === 'websocket') {
      this.subscribeWebSocket(channelName, eventName, callback)
    }

    // Store polling callback for when we switch to polling mode
    if (pollingCallback) {
      this.pollingCallbacks.set(channelName, pollingCallback)
    }
  }

  /**
   * Subscribe to WebSocket channel
   */
  private subscribeWebSocket(channelName: string, eventName: string, callback: (data: any) => void) {
    try {
      const echo = getEcho()
      const channel = echo.channel(channelName)
      
      channel.listen(eventName, callback)
      
      this.channels.set(channelName, { channel, eventName, callback })
      
      console.log(`[RealtimeManager] Subscribed to WebSocket channel: ${channelName}`)
    } catch (error) {
      console.error(`[RealtimeManager] Failed to subscribe to ${channelName}:`, error)
    }
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channelName: string) {
    if (this.channels.has(channelName)) {
      const echo = getEcho()
      echo.leaveChannel(channelName)
      this.channels.delete(channelName)
      console.log(`[RealtimeManager] Unsubscribed from channel: ${channelName}`)
    }

    this.pollingCallbacks.delete(channelName)
  }

  /**
   * Start polling for updates
   */
  private startPolling() {
    if (this.pollingTimer) {
      return
    }

    console.log(`[RealtimeManager] Starting polling (interval: ${this.pollingInterval}ms)`)

    this.pollingTimer = setInterval(async () => {
      for (const [channelName, pollingCallback] of this.pollingCallbacks.entries()) {
        try {
          const data = await pollingCallback()
          
          // Find the callback for this channel
          const channelData = this.channels.get(channelName)
          if (channelData && this.config.onUpdate) {
            this.config.onUpdate(data)
          }
        } catch (error) {
          console.error(`[RealtimeManager] Polling error for ${channelName}:`, error)
        }
      }
    }, this.pollingInterval)
  }

  /**
   * Stop polling
   */
  private stopPolling() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer)
      this.pollingTimer = null
      console.log('[RealtimeManager] Stopped polling')
    }
  }

  /**
   * Disconnect WebSocket
   */
  private disconnectWebSocket() {
    try {
      disconnectEcho()
      console.log('[RealtimeManager] Disconnected WebSocket')
    } catch (error) {
      console.error('[RealtimeManager] Error disconnecting WebSocket:', error)
    }
  }

  /**
   * Reconnect WebSocket and resubscribe to channels
   */
  private reconnectWebSocket() {
    try {
      const echo = getEcho()
      
      // Resubscribe to all channels
      for (const [channelName, channelData] of this.channels.entries()) {
        const channel = echo.channel(channelName)
        channel.listen(channelData.eventName, channelData.callback)
      }
      
      console.log('[RealtimeManager] Reconnected WebSocket')
    } catch (error) {
      console.error('[RealtimeManager] Error reconnecting WebSocket:', error)
    }
  }

  /**
   * Start periodic status checks
   */
  private startStatusChecks() {
    this.statusCheckTimer = setInterval(() => {
      this.checkStatus()
    }, this.statusCheckInterval)
  }

  /**
   * Stop periodic status checks
   */
  private stopStatusChecks() {
    if (this.statusCheckTimer) {
      clearInterval(this.statusCheckTimer)
      this.statusCheckTimer = null
    }
  }

  /**
   * Get current mode
   */
  getMode(): RealtimeMode {
    return this.mode
  }

  /**
   * Get polling interval
   */
  getPollingInterval(): number {
    return this.pollingInterval
  }

  /**
   * Cleanup and disconnect
   */
  cleanup() {
    this.stopPolling()
    this.stopStatusChecks()
    this.disconnectWebSocket()
    this.channels.clear()
    this.pollingCallbacks.clear()
  }
}

// Singleton instance
let realtimeManager: RealtimeManager | null = null

export const getRealtimeManager = (): RealtimeManager => {
  if (!realtimeManager) {
    realtimeManager = new RealtimeManager()
  }
  return realtimeManager
}

export const cleanupRealtimeManager = () => {
  if (realtimeManager) {
    realtimeManager.cleanup()
    realtimeManager = null
  }
}
