import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

let echoInstance: Echo | null = null;

export const getEcho = (): Echo => {
  if (!echoInstance && typeof window !== 'undefined') {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'eu';
    
    if (!pusherKey) {
      console.warn('[Echo] Pusher key not configured. WebSocket features will be disabled.');
      // Return a mock Echo instance that does nothing
      return {
        channel: () => ({
          listen: () => {},
        }),
        leaveChannel: () => {},
        disconnect: () => {},
      } as any;
    }
    
    echoInstance = new Echo({
      broadcaster: 'pusher',
      key: pusherKey,
      cluster: pusherCluster,
      forceTLS: true,
      enabledTransports: ['ws', 'wss'],
    });
  }

  return echoInstance!;
};

export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};
