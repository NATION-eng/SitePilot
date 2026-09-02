import React from 'react';

/**
 * SitePilot Signature Brand Emblem
 * An isometric structural drafting cube fused with a supersonic pilot delta navigation arrowhead.
 * Represents: Precision Architecture (Site) + Intelligent Guidance (Pilot).
 */
export const SiteLogoEmblem = ({ size = 38, glow = true }) => {
  const id = `sp-grad-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'block',
        filter: glow ? 'drop-shadow(0 4px 12px rgba(255, 107, 0, 0.45))' : 'none',
        flexShrink: 0
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Primary Radiant Orange Gradient */}
        <linearGradient id={`${id}-primary`} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF8533" />
          <stop offset="50%" stopColor="#FF6B00" />
          <stop offset="100%" stopColor="#D94800" />
        </linearGradient>

        {/* High-Tech Cyan Beacon Gradient */}
        <linearGradient id={`${id}-cyan`} x1="20" y1="8" x2="40" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F5D4" />
          <stop offset="100%" stopColor="#00B4D8" />
        </linearGradient>

        {/* Blueprint Glass Shading */}
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Hexagonal Isometric Base Chassis */}
      <path
        d="M24 4L42 14.4V35.6L24 46L6 35.6V14.4L24 4Z"
        fill="#0D131D"
        stroke={`url(#${id}-primary)`}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Inner Blueprint Facet Gridlines */}
      <path
        d="M24 4V24M42 14.4L24 24M6 14.4L24 24M24 24V46"
        stroke="rgba(255, 255, 255, 0.14)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Dynamic Pilot Navigation Delta Wing (Ascending through the isometric grid) */}
      <path
        d="M24 10L36 32L24 26L12 32L24 10Z"
        fill={`url(#${id}-primary)`}
      />

      {/* Wing Spine Highlight */}
      <path
        d="M24 10V26"
        stroke="#FFE3D1"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Precision Crosshair Target Ring */}
      <circle cx="24" cy="22" r="7" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="2 2" fill="none" />

      {/* Glowing Tech Beacon Indicator at Apex */}
      <circle cx="24" cy="10" r="3.2" fill={`url(#${id}-cyan)`} />
      <circle cx="24" cy="10" r="1.3" fill="#FFFFFF" />
    </svg>
  );
};

/**
 * Full SitePilot Brandmark with Wordmark
 */
export const SiteLogo = ({ size = 36, showTagline = false }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', userSelect: 'none' }}>
      <SiteLogoEmblem size={size} glow={true} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: size > 32 ? '1.4rem' : '1.15rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: '#E8ECF0'
        }}>
          Site<span style={{
            background: 'linear-gradient(135deg, #FF8533 0%, #FF6B00 60%, #E65100 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Pilot</span>
        </div>
        {showTagline && (
          <span style={{
            fontSize: '0.62rem',
            fontFamily: "'Work Sans', sans-serif",
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#8B95A5',
            marginTop: '2px'
          }}>
            Construction Intelligence
          </span>
        )}
      </div>
    </div>
  );
};

export default SiteLogo;
