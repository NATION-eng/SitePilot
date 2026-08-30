import React from 'react';
import Icon from '../ui/Icon';

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

const MaterialEstimates = ({ materials }) => {
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
      </div>
    </div>
  );
};

export default MaterialEstimates;
