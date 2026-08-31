import React from 'react';
import Icon from '../ui/Icon';
import { useProject } from '../../context/ProjectContext';

const MATERIAL_META = {
  cement: { iconName: 'cement', category: 'Structure', color: '#FF6B00' },
  blocks: { iconName: 'blocks', category: 'Structure', color: '#FF6B00' },
  steel: { iconName: 'steel', category: 'Structure', color: '#FF6B00' },
  sand: { iconName: 'sand', category: 'Aggregates', color: '#FFB800' },
  granite: { iconName: 'granite', category: 'Aggregates', color: '#FFB800' },
  roofing: { iconName: 'roofing', category: 'Enclosure', color: '#3B82F6' },
  tiles: { iconName: 'tiles', category: 'Finishing', color: '#00D9A3' },
  pop: { iconName: 'pop', category: 'Finishing', color: '#00D9A3' },
  paint: { iconName: 'paint', category: 'Finishing', color: '#00D9A3' },
  windows: { iconName: 'windows', category: 'Openings', color: '#9333EA' },
  doors: { iconName: 'doors', category: 'Openings', color: '#9333EA' }
};

const MaterialEstimates = ({ materials, customMaterials = [] }) => {
  const { formatMoney } = useProject();
  if (!materials) return null;

  return (
    <div className="result-card">
      <h3 className="result-card-title">
        <Icon name="box" size={22} color="var(--primary)" style={{ marginRight: '0.4rem' }} /> Material Takeoff
      </h3>

      <div className="materials-list">
        {Object.entries(materials).map(([key, value]) => {
          const meta = MATERIAL_META[key] || { iconName: 'box', color: 'var(--primary)' };

          return (
            <div key={key} className="material-item">
              <div className="material-name-container">
                <Icon name={meta.iconName} size={18} color={meta.color} />
                <span className="material-name">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </div>
              <span className="material-quantity">{value}</span>
            </div>
          );
        })}

        {/* Custom Materials Specified by User */}
        {Array.isArray(customMaterials) && customMaterials.length > 0 && (
          <div className="custom-materials-takeoff-section" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Icon name="tools" size={16} color="var(--primary)" />
              Custom Specified Materials ({customMaterials.length})
            </div>
            {customMaterials.map((mat) => (
              <div key={mat.id || mat.name} className="material-item" style={{ background: 'rgba(255, 107, 0, 0.05)' }}>
                <div className="material-name-container">
                  <Icon name="finishes" size={16} color="var(--primary)" />
                  <div>
                    <span className="material-name" style={{ fontWeight: 600 }}>{mat.name}</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      @{formatMoney(mat.unitPrice)}/{mat.unit}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="material-quantity" style={{ fontWeight: 700 }}>
                    {mat.quantity} {mat.unit}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {formatMoney(mat.lineCost)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialEstimates;
