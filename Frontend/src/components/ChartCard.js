import React from 'react';

const ChartCard = ({ title, value, change, chartType = 'bar' }) => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
        <span className={`change ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      </div>
      <div className="chart-value">{value}</div>
      <div className="chart-placeholder">
        {chartType === 'bar' && '📊 Bar Chart'}
        {chartType === 'line' && '📈 Line Chart'}
        {chartType === 'pie' && '🥧 Pie Chart'}
      </div>
    </div>
  );
};

export default ChartCard;