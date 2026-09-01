import React, { useState, useEffect } from 'react';
import Icon from '../ui/Icon';

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSTip, setShowIOSTip] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running in standalone PWA mode
    const isApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandalone(isApp);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for Chrome / Edge / Android install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSTip(prev => !prev);
    }
  };

  // If already installed and running as PWA, don't show install button
  if (isStandalone) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className="rates-btn btn-hover"
        onClick={handleInstallClick}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.15) 0%, rgba(255, 107, 0, 0.25) 100%)',
          borderColor: 'rgba(255, 107, 0, 0.4)',
          color: 'var(--primary, #FF6B00)'
        }}
        title="Install SitePilot App on your phone or desktop for offline access"
        aria-label="Install SitePilot as Progressive Web App"
      >
        <Icon name="tools" size={14} color="var(--primary)" style={{ marginRight: '0.35rem' }} />
        <span>Install App</span>
      </button>

      {/* iOS Instruction Tooltip */}
      {showIOSTip && (
        <div style={{
          position: 'absolute',
          top: '120%',
          right: 0,
          background: '#12171F',
          border: '1px solid var(--border, #2A3140)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          width: '260px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          fontSize: '0.78rem',
          color: 'var(--text-primary, #E8ECF0)',
          lineHeight: '1.4'
        }}>
          <div style={{ fontWeight: 700, marginBottom: '0.35rem', color: 'var(--primary)' }}>
            📲 Install on iOS (iPhone/iPad):
          </div>
          <div>
            1. Tap the <strong>Share</strong> button <span style={{ fontSize: '1rem' }}>⎋</span> at bottom of Safari.
          </div>
          <div style={{ marginTop: '0.25rem' }}>
            2. Scroll and select <strong>"Add to Home Screen"</strong> ⊞.
          </div>
          <button
            type="button"
            onClick={() => setShowIOSTip(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.72rem',
              marginTop: '0.5rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Got it, close
          </button>
        </div>
      )}
    </div>
  );
};

export default InstallPWAButton;
