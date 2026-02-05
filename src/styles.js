export const styles = {
  app: {
    fontFamily: "'Work Sans', sans-serif",
    background: '#0A0E14',
    color: '#E8ECF0',
    minHeight: '100vh',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  header: {
    padding: '2rem 0',
    borderBottom: '2px solid #2A3140',
    background: 'linear-gradient(135deg, #0A0E14 0%, #0D1117 100%)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    width: '42px',
    height: '42px',
    background: 'linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 700,
    fontSize: '1.5rem',
    color: 'white',
    boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
  },
  logoText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  headerBadge: {
    background: '#141921',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.75rem',
    border: '1px solid #2A3140',
    color: '#8B95A5',
  },
  hero: {
    padding: '4rem 0',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 800,
    marginBottom: '1.5rem',
    lineHeight: 1.1,
    background: 'linear-gradient(135deg, #E8ECF0 0%, #8B95A5 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#8B95A5',
    maxWidth: '700px',
    margin: '0 auto 2rem',
  },
  ctaButton: {
    background: 'linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)',
    color: 'white',
    border: 'none',
    padding: '1rem 2.5rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(255, 107, 0, 0.4)',
  },
  appContainer: {
    paddingTop: '3rem',
  },
  progressContainer: {
    marginBottom: '3rem',
  },
  progressBar: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: '1rem',
  },
  progressBarBg: {
    position: 'absolute',
    top: '18px',
    left: 0,
    right: 0,
    height: '2px',
    background: '#2A3140',
    zIndex: 0,
  },
  progressFill: {
    position: 'absolute',
    top: '18px',
    left: 0,
    height: '2px',
    background: '#FF6B00',
    transition: 'width 0.5s ease',
    zIndex: 1,
  },
  step: {
    background: '#141921',
    border: '2px solid #2A3140',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    position: 'relative',
    zIndex: 2,
    transition: 'all 0.3s ease',
  },
  stepActive: {
    background: '#FF6B00',
    borderColor: '#FF6B00',
    color: 'white',
    boxShadow: '0 0 20px rgba(255, 107, 0, 0.5)',
  },
  stepCompleted: {
    background: '#00D9A3',
    borderColor: '#00D9A3',
    color: 'white',
  },
  formCard: {
    background: '#141921',
    border: '1px solid #2A3140',
    borderRadius: '12px',
    padding: '3rem',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  sectionSubtitle: {
    color: '#8B95A5',
    marginBottom: '2rem',
  },
  projectTypes: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
  },
  projectTypeCard: {
    background: '#1C2128',
    border: '2px solid #2A3140',
    borderRadius: '8px',
    padding: '1.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  projectTypeCardSelected: {
    borderColor: '#FF6B00',
    background: 'rgba(255, 107, 0, 0.1)',
  },
  projectTypeIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  projectTypeName: {
    fontWeight: 600,
    fontSize: '1.1rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontWeight: 600,
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    background: '#1C2128',
    border: '1px solid #2A3140',
    borderRadius: '6px',
    color: '#E8ECF0',
    fontSize: '1rem',
    fontFamily: "'Work Sans', sans-serif",
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  btnPrimary: {
    flex: 1,
    padding: '1rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)',
    color: 'white',
  },
  btnSecondary: {
    flex: 1,
    padding: '1rem',
    border: '1px solid #2A3140',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: '#1C2128',
    color: '#E8ECF0',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  spinner: {
    border: '3px solid #2A3140',
    borderTop: '3px solid #FF6B00',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1.5rem',
  },
  resultsContainer: {
    paddingTop: '3rem',
  },
  aiBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#3B82F6',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    marginBottom: '1rem',
  },
  alert: {
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    background: 'rgba(255, 184, 0, 0.15)',
    border: '1px solid #FFB800',
    color: '#FFB800',
  },
  alertIcon: {
    fontSize: '1.3rem',
    flexShrink: 0,
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2rem',
    marginBottom: '2rem',
  },
  resultCard: {
    background: '#141921',
    border: '1px solid #2A3140',
    borderRadius: '12px',
    padding: '2rem',
  },
  resultCardTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  cardIcon: {
    fontSize: '1.8rem',
  },
  materialItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.875rem 0',
    borderBottom: '1px solid #2A3140',
  },
  materialName: {
    fontWeight: 500,
  },
  materialQuantity: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    color: '#FF6B00',
  },
  totalCost: {
    background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1) 0%, rgba(255, 107, 0, 0.05) 100%)',
    padding: '1.5rem',
    borderRadius: '8px',
    marginTop: '1rem',
    border: '1px solid rgba(255, 107, 0, 0.3)',
  },
  totalCostLabel: {
    color: '#8B95A5',
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
  },
  totalCostAmount: {
    fontSize: '2.5rem',
    fontWeight: 800,
    fontFamily: "'IBM Plex Mono', monospace",
    color: '#FF6B00',
  },
  riskBadge: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginTop: '0.5rem',
  },
  riskLow: {
    background: 'rgba(0, 217, 163, 0.2)',
    color: '#00D9A3',
    border: '1px solid #00D9A3',
  },
  riskMedium: {
    background: 'rgba(255, 184, 0, 0.2)',
    color: '#FFB800',
    border: '1px solid #FFB800',
  },
  riskHigh: {
    background: 'rgba(255, 71, 87, 0.2)',
    color: '#FF4757',
    border: '1px solid #FF4757',
  },
};

// Global styles
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Work+Sans:wght@300;400;500;600;800&display=swap');

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(255, 107, 0, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0); }
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Work Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #0A0E14;
    color: #E8ECF0;
  }

  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }

  .slide-up {
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .btn-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 0, 0.3);
  }

  .btn-hover:active {
    transform: translateY(0);
  }

  .card-hover {
    transition: all 0.3s ease;
  }

  .card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    border-color: #FF6B00;
  }

  .input-field:focus {
    border-color: #FF6B00 !important;
    box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.2);
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #0A0E14;
  }
  ::-webkit-scrollbar-thumb {
    background: #2A3140;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #FF6B00;
  }
`;
