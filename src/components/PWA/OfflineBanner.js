import React, { useState, useEffect } from 'react';
import Icon from '../ui/Icon';

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showReconnected) {
    return (
      <div style={{
        background: '#065F46',
        color: '#D1FAE5',
        fontSize: '0.75rem',
        fontWeight: 600,
        textAlign: 'center',
        padding: '0.35rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        <Icon name="check" size={14} color="#34D399" />
        <span>Connected — Back online</span>
      </div>
    );
  }

  if (!isOffline) return null;

  return (
    <div style={{
      background: 'rgba(234, 88, 12, 0.95)',
      color: '#ffffff',
      fontSize: '0.78rem',
      fontWeight: 600,
      textAlign: 'center',
      padding: '0.4rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <Icon name="warning" size={16} color="#FFFFFF" />
      <span>Offline Mode Active — SitePilot full estimation calculations, rates & portfolio work 100% offline</span>
    </div>
  );
};

export default OfflineBanner;
