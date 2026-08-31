import React, { useState, useEffect } from 'react';
import Icon from '../ui/Icon';
import PRICING_CONFIG from '../../pricing.config.json';
import { useProject } from '../../context/ProjectContext';
import styles from './PriceManagerModal.module.css';

const MATERIAL_FIELDS = [
  { key: 'cement', label: 'Cement', unit: 'per 50kg bag', icon: 'cement' },
  { key: 'block_9inch', label: '9" Sandcrete Blocks', unit: 'per piece', icon: 'blocks' },
  { key: 'steel_ton', label: 'Reinforcement Steel (TMT)', unit: 'per ton', icon: 'steel' },
  { key: 'sand_ton', label: 'Sharp Sand', unit: 'per ton', icon: 'sand' },
  { key: 'granite_ton', label: 'Crushed Granite', unit: 'per ton', icon: 'granite' },
  { key: 'roofing_sqm', label: 'Aluminium Roofing (0.55mm)', unit: 'per sqm', icon: 'roofing' },
  { key: 'tiles_sqm', label: 'Floor & Wall Tiles', unit: 'per sqm', icon: 'tiles' },
  { key: 'pop_sqm', label: 'POP Ceiling Boarding', unit: 'per sqm', icon: 'pop' },
  { key: 'paint_drum', label: 'Quality Emulsion Paint', unit: 'per 20L drum', icon: 'paint' },
  { key: 'door_internal', label: 'Internal Flush Door', unit: 'per unit', icon: 'doors' },
  { key: 'door_security', label: 'Steel Security Door', unit: 'per unit', icon: 'doors' },
  { key: 'window_sqm', label: 'Glazed Aluminium Window', unit: 'per sqm', icon: 'windows' }
];

const PriceManagerModal = ({ isOpen, onClose }) => {
  const { materialPrices, setMaterialPrices, resetMaterialPrices, recalculateEstimate, currency, formatMoney } = useProject();
  const [localPrices, setLocalPrices] = useState(materialPrices || PRICING_CONFIG.materials);
  const [appliedAdjustment, setAppliedAdjustment] = useState(0);

  // Sync state whenever modal is opened or materialPrices change
  useEffect(() => {
    if (isOpen) {
      setLocalPrices(materialPrices || PRICING_CONFIG.materials);
      setAppliedAdjustment(0);
    }
  }, [isOpen, materialPrices]);

  if (!isOpen) return null;

  const handlePriceChange = (key, value) => {
    const num = Math.max(0, parseFloat(value) || 0);
    setLocalPrices(prev => ({ ...prev, [key]: num }));
  };

  const handleApplyMultiplier = (pct) => {
    setAppliedAdjustment(prev => prev + pct);
    setLocalPrices(prev => {
      const updated = {};
      Object.entries(prev).forEach(([k, v]) => {
        updated[k] = Math.round(v * (1 + pct / 100));
      });
      return updated;
    });
  };

  const handleSave = () => {
    setMaterialPrices(localPrices);
    recalculateEstimate(localPrices);
    onClose();
  };

  const handleReset = () => {
    resetMaterialPrices();
    setLocalPrices(PRICING_CONFIG.materials);
    setAppliedAdjustment(0);
  };

  const handleExportJSON = () => {
    const exportData = {
      ...PRICING_CONFIG,
      _meta: {
        ...PRICING_CONFIG._meta,
        lastUpdated: new Date().toISOString().split('T')[0],
        source: 'Custom User Adjusted Rates'
      },
      materials: localPrices
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pricing.config.custom_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="price-modal-title"
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <Icon name="drafting" size={24} color="var(--primary)" />
            <h2 id="price-modal-title" className={styles.title}>Live Material Price Manager</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <p className={styles.subtitle}>
          Inspect and adjust base unit rates (in ₦ NGN). Real-time calculations and BOQ reports update immediately upon saving.
        </p>

        {/* Quick Multiplier Bar */}
        <div className={styles.multiplierBar}>
          <span className={styles.multiplierLabel}>Quick Market Inflation Adjust:</span>
          <div className={styles.multiplierBtns}>
            <button type="button" className={styles.adjBtn} onClick={() => handleApplyMultiplier(-5)}>-5%</button>
            <button type="button" className={styles.adjBtn} onClick={() => handleApplyMultiplier(5)}>+5%</button>
            <button type="button" className={styles.adjBtn} onClick={() => handleApplyMultiplier(10)}>+10%</button>
            <button type="button" className={styles.adjBtn} onClick={() => handleApplyMultiplier(20)}>+20%</button>
          </div>
          {appliedAdjustment !== 0 && (
            <span className={styles.adjustmentBadge}>
              {appliedAdjustment > 0 ? `+${appliedAdjustment}%` : `${appliedAdjustment}%`} applied
            </span>
          )}
        </div>

        {/* Materials Table / Grid */}
        <div className={styles.materialsScroll}>
          <div className={styles.materialsGrid}>
            {MATERIAL_FIELDS.map(({ key, label, unit, icon }) => {
              const currentPrice = localPrices[key] || 0;
              return (
                <div key={key} className={styles.materialRow}>
                  <div className={styles.materialMeta}>
                    <Icon name={icon} size={18} color="var(--primary)" />
                    <div>
                      <div className={styles.matLabel}>{label}</div>
                      <div className={styles.matUnit}>
                        {unit}
                        {currency !== 'NGN' && (
                          <span className={styles.convertedTag}> (~{formatMoney(currentPrice)})</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencyPrefix}>₦</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      className={styles.priceInput}
                      value={currentPrice}
                      onChange={e => handlePriceChange(key, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions Bar */}
        <div className={styles.footer}>
          <div className={styles.leftActions}>
            <button type="button" className={styles.btnOutline} onClick={handleReset} title="Restore baseline 2026 Nigerian QS prices">
              Reset Baseline
            </button>
            <button type="button" className={styles.btnOutline} onClick={handleExportJSON} title="Download updated pricing.config.json">
              Export Config JSON
            </button>
          </div>
          <div className={styles.rightActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button type="button" className={styles.btnSave} onClick={handleSave}>
              Save & Apply Prices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceManagerModal;
