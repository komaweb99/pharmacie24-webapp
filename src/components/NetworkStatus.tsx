import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const NetworkStatus: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowNotification(true);
    } else if (wasOffline) {
      setShowNotification(true);
      // Hide notification after 3 seconds when back online
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!showNotification) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-4 text-center text-white font-medium transition-all duration-300 ${
      isOnline ? 'bg-green-600' : 'bg-red-600'
    }`}>
      <div className="flex items-center justify-center space-x-2">
        {isOnline ? (
          <>
            <Wifi className="h-5 w-5" />
            <span>Connexion rétablie</span>
          </>
        ) : (
          <>
            <WifiOff className="h-5 w-5" />
            <span>Pas de connexion internet</span>
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus;