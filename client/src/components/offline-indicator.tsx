import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-accent text-accent-foreground px-4 py-3 text-center text-sm font-medium sticky top-0 z-50" data-testid="offline-indicator">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        You're offline. Some features may be limited.
      </div>
    </div>
  );
}
