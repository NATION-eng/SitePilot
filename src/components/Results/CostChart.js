import React, { useState } from 'react';

const CostChart = ({ costs, currencySymbol = '₦' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!costs || !costs.total) return null;

  // Aggregate costs into 5 primary QS cost centres
  const structureCost =
    (costs.cement || 0) +
    (costs.blocks || 0) +
    (costs.steel || 0) +
    (costs.aggregates || 0) +
    (costs.roofing || 0);

  const finishesCost =
    (costs.tiles || 0) +
    (costs.pop || 0) +
    (costs.paint || 0) +
    (costs.windows || 0) +
    (costs.doors || 0);

  const mepCost = costs.m_e_p || 0;
  const laborCost = costs.labor || 0;
  const contingencyCost = costs.contingency || 0;
  const total = costs.total || 1;

  const slices = [
    { label: 'Structure (Shell)', amount: structureCost, color: '#FF6B00', icon: '🏗️' },
    { label: 'Finishing & Fittings', amount: finishesCost, color: '#3B82F6', icon: '🎨' },
    { label: 'MEP Services', amount: mepCost, color: '#9333EA', icon: '⚡' },
    { label: 'Direct Labour', amount: laborCost, color: '#00D9A3', icon: '👷' },
    { label: 'Contingency', amount: contingencyCost, color: '#FFB800', icon: '🛡️' }
  ].filter(s => s.amount > 0);

  // Calculate SVG donut segments
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativePercent = 0;

  return (
    <div className="cost-chart-container">
      <div className="donut-wrapper">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="donut-svg"
          aria-label="Cost distribution chart"
          role="img"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--bg-card, #141921)"
            strokeWidth={strokeWidth}
          />
          {/* Segments */}
          {slices.map((slice, i) => {
            const percent = slice.amount / total;
            const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
            const strokeDashoffset = -circumference * cumulativePercent;
            cumulativePercent += percent;

            const isHovered = hoveredIndex === i;

            return (
              <circle
                key={slice.label}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                className="donut-segment"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  opacity: hoveredIndex !== null && !isHovered ? 0.5 : 1
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Donut Center Display */}
        <div className="donut-center-info">
          {hoveredIndex !== null ? (
            <>
              <div className="donut-center-percent" style={{ color: slices[hoveredIndex].color }}>
                {Math.round((slices[hoveredIndex].amount / total) * 100)}%
              </div>
              <div className="donut-center-label">
                {slices[hoveredIndex].label.split(' ')[0]}
              </div>
            </>
          ) : (
            <>
              <div className="donut-center-total-label">Total</div>
              <div className="donut-center-total-val">
                {currencySymbol}{total > 1000000 ? `${(total / 1000000).toFixed(1)}M` : total.toLocaleString()}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Interactive Legend */}
      <div className="chart-legend">
        {slices.map((slice, i) => {
          const pct = Math.round((slice.amount / total) * 100);
          const isHovered = hoveredIndex === i;

          return (
            <div
              key={slice.label}
              className={`legend-item ${isHovered ? 'legend-item-active' : ''}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="legend-indicator" style={{ backgroundColor: slice.color }} />
              <div className="legend-text">
                <span className="legend-label">{slice.label}</span>
                <span className="legend-amount">
                  {currencySymbol}{slice.amount.toLocaleString()} ({pct}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CostChart;
