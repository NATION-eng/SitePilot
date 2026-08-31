import React, { useState, useEffect, useRef } from 'react';
import Icon from '../ui/Icon';
import PRICING_CONFIG from '../../pricing.config.json';
import { useProject } from '../../context/ProjectContext';
import styles from './MaterialRatesDropdown.module.css';

const MATERIAL_FIELDS = [
  { key: 'cement', label: 'Cement (50kg bag)', icon: 'cement' },
  { key: 'block_9inch', label: '9" Sandcrete Block (pc)', icon: 'blocks' },
  { key: 'steel_ton', label: 'Reinforcement Steel (ton)', icon: 'steel' },
  { key: 'sand_ton', label: 'Sharp Sand (ton)', icon: 'sand' },
  { key: 'granite_ton', label: 'Crushed Granite (ton)', icon: 'granite' },
  { key: 'roofing_sqm', label: 'Aluminium Roofing (sqm)', icon: 'roofing' },
  { key: 'tiles_sqm', label: 'Ceramic / Floor Tiles (sqm)', icon: 'tiles' },
  { key: 'pop_sqm', label: 'POP Ceiling (sqm)', icon: 'pop' },
  { key: 'paint_drum', label: 'Emulsion Paint (20L drum)', icon: 'paint' },
  { key: 'door_internal', label: 'Internal Flush Door (unit)', icon: 'doors' },
  { key: 'door_security', label: 'Steel Security Door (unit)', icon: 'doors' },
  { key: 'window_sqm', label: 'Aluminium Window (sqm)', icon: 'windows' }
];

const MaterialRatesDropdown = ({ isOpen, onClose }) => {
  const { materialPrices, setMaterialPrices, resetMaterialPrices, recalculateEstimate, currency, formatMoney } = useProject();
  const [localPrices, setLocalPrices] = useState(materialPrices || PRICING_CONFIG.materials);
  const [appliedAdjustment, setAppliedAdjustment] = useState(0);
  const dropdownRef = useRef(null);

  // Sync state whenever opened
  useEffect(() => {
    if (isOpen) {
      setLocalPrices(materialPrices || PRICING_CONFIG.materials);
      setAppliedAdjustment(0);
    }
  }, [isOpen, materialPrices]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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

  return (
    <>
      {/* Dimmed Focus Backdrop that completely blocks out the home page */}
      <div
        className={styles.backdropOverlay}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Solid Opaque Dropdown Menu anchored right below button */}
      <div
        className={styles.dropdownContainer}
        ref={dropdownRef}
        role="dialog"
        aria-label="Material Rates Menu"
        onClick={e => e.stopPropagation()}
      >
        {/* Dropdown Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <Icon name="drafting" size={18} color="var(--primary)" />
            <div>
              <div className={styles.title}>Material Market Rates</div>
              <div className={styles.subtitle}>Adjust unit prices (₦ NGN)</div>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        {/* Inflation Adjuster Bar */}
        <div className={styles.inflationBar}>
          <span className={styles.inflationLabel}>Quick Market Inflation:</span>
          <div className={styles.inflationBtns}>
            <button type="button" className={styles.pillBtn} onClick={() => handleApplyMultiplier(-5)}>-5%</button>
            <button type="button" className={styles.pillBtn} onClick={() => handleApplyMultiplier(5)}>+5%</button>
            <button type="button" className={styles.pillBtn} onClick={() => handleApplyMultiplier(10)}>+10%</button>
            <button type="button" className={styles.pillBtn} onClick={() => handleApplyMultiplier(20)}>+20%</button>
          </div>
          {appliedAdjustment !== 0 && (
            <span className={styles.badge}>
              {appliedAdjustment > 0 ? `+${appliedAdjustment}%` : `${appliedAdjustment}%`}
            </span>
          )}
        </div>

        {/* Material Rates List */}
        <div className={styles.listContainer}>
          {MATERIAL_FIELDS.map(({ key, label, icon }) => {
            const price = localPrices[key] || 0;
            return (
              <div key={key} className={styles.row}>
                <div className={styles.rowLabel}>
                  <Icon name={icon} size={16} color="var(--primary)" />
                  <span className={styles.labelText} title={label}>{label}</span>
                </div>
                <div className={styles.rowInputGroup}>
                  <div className={styles.inputBox}>
                    <span className={styles.currPrefix}>₦</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      className={styles.inputField}
                      value={price}
                      onChange={e => handlePriceChange(key, e.target.value)}
                    />
                  </div>
                  {currency !== 'NGN' && (
                    <span className={styles.convertedText}>
                      ~{formatMoney(price)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dropdown Footer Actions */}
        <div className={styles.footer}>
          <button type="button" className={styles.btnReset} onClick={handleReset} title="Restore 2026 baseline prices">
            Reset Base
          </button>
          <div className={styles.footerRight}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button type="button" className={styles.btnApply} onClick={handleSave}>
              Apply Rates
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialRatesDropdown;
