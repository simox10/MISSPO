import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

let echoInstance: Echo | null = null;

export const getEcho = (): Echo => {
  if (!echoInstance && typeof window !== 'undefined') {
    echoInstance = new Echo({
      broadcaster: 'pusher',
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
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
