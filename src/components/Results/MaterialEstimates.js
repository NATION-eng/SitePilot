import React from 'react';

const MATERIAL_META = {
  cement: { icon: '🧱', category: 'Structure', color: '#FF6B00' },
  blocks: { icon: '🏗️', category: 'Structure', color: '#FF6B00' },
  steel: { icon: '🔩', category: 'Structure', color: '#FF6B00' },
  sand: { icon: '⏳', category: 'Aggregates', color: '#FFB800' },
  granite: { icon: '🪨', category: 'Aggregates', color: '#FFB800' },
  roofing: { icon: '🏠', category: 'Enclosure', color: '#3B82F6' },
  tiles: { icon: '▫️', category: 'Finishing', color: '#00D9A3' },
  pop: { icon: '✨', category: 'Finishing', color: '#00D9A3' },
  paint: { icon: '🎨', category: 'Finishing', color: '#00D9A3' },
  windows: { icon: '🪟', category: 'Openings', color: '#9333EA' },
  doors: { icon: '🚪', category: 'Openings', color: '#9333EA' }
};

const MaterialEstimates = ({ materials }) => {
  if (!materials) return null;

  return (
    <div className="result-card">
      <h3 className="result-card-title">
        <span className="card-icon">📦</span> Material Takeoff
      </h3>

      <div className="materials-list">
        {Object.entries(materials).map(([key, value]) => {
          const meta = MATERIAL_META[key] || { icon: '📦', color: '#8B95A5', category: 'Material' };

          return (
            <div key={key} className="material-item">
              <div className="material-name-container">
                <span className="material-emoji" aria-hidden="true">{meta.icon}</span>
                <span className="material-name">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </div>
              <span className="material-quantity">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialEstimates;
