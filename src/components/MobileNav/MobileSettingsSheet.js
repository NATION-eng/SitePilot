import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useProject } from '../../context/ProjectContext';
import PRICING_CONFIG from '../../pricing.config.json';

const MobileSettingsSheet = ({ isOpen, onClose }) => {
  const { currency, setCurrency, unit, setUnit } = useProject();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(5, 8, 14, 0.75)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        style={{
          position: 'relative', zIndex: 1,
          background: '#12171F',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px 20px 0 0',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)',
          animation: 'mobileSheetUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', paddingBottom: '4px' }}>
          <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 4 }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem 0.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#E8ECF0', margin: 0 }}>Settings</h2>
            <p style={{ fontSize: '0.75rem', color: '#8B95A5', margin: '2px 0 0' }}>Configure your estimator preferences</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#8B95A5',
            }}
            aria-label="Close settings"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Settings Content */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Currency */}
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FF6B00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Display Currency
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(PRICING_CONFIG.currencies).map(([code, info]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurrency(code)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: currency === code ? 'rgba(255, 107, 0, 0.1)' : 'rgba(255,255,255,0.03)',
                    border: currency === code ? '1px solid rgba(255, 107, 0, 0.4)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10, cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  aria-pressed={currency === code}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      fontSize: '1.1rem', fontWeight: 800,
                      fontFamily: 'IBM Plex Mono, monospace',
                      color: currency === code ? '#FF6B00' : '#E8ECF0',
                      minWidth: '1.5rem',
                    }}>
                      {info.symbol}
                    </span>
                    <div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#E8ECF0', margin: 0 }}>{code}</p>
                      <p style={{ fontSize: '0.72rem', color: '#8B95A5', margin: 0 }}>{info.name || code}</p>
                    </div>
                  </div>
                  {currency === code && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Unit */}
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FF6B00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Area Measurement Unit
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { value: 'sqm', label: 'm²', sub: 'Metric (International)' },
                { value: 'sqft', label: 'sq ft', sub: 'Imperial (US/UK)' }
              ].map(({ value, label, sub }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setUnit(value)}
                  style={{
                    flex: 1, padding: '0.85rem 0.75rem',
                    background: unit === value ? 'rgba(255, 107, 0, 0.1)' : 'rgba(255,255,255,0.03)',
                    border: unit === value ? '1px solid rgba(255, 107, 0, 0.4)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  aria-pressed={unit === value}
                >
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'IBM Plex Mono, monospace', color: unit === value ? '#FF6B00' : '#E8ECF0', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: '0.68rem', color: '#8B95A5', margin: '3px 0 0' }}>{sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* App Info */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 10, padding: '1rem',
            display: 'flex', flexDirection: 'column', gap: '0.4rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#8B95A5' }}>App</span>
              <span style={{ fontSize: '0.8rem', color: '#E8ECF0', fontWeight: 600 }}>SitePilot v3.2</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#8B95A5' }}>Mode</span>
              <span style={{ fontSize: '0.8rem', color: '#00D9A3', fontWeight: 600 }}>
                {window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches ? 'Installed PWA' : 'Web Browser'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#8B95A5' }}>Region</span>
              <span style={{ fontSize: '0.8rem', color: '#E8ECF0', fontWeight: 600 }}>Nigeria & Africa</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mobileSheetUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default MobileSettingsSheet;
