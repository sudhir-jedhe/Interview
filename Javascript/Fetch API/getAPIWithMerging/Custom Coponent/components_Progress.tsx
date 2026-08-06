import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
}

const Progress: React.FC<ProgressProps> = ({ value, max = 100 }) => {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const barStyle: React.CSSProperties = {
    width: `${(value / max) * 100}%`,
    height: '20px',
    backgroundColor: '#3498db',
    transition: 'width 0.3s ease-in-out',
  };

  return (
    <div style={containerStyle}>
      <div style={barStyle} />
    </div>
  );
};

export default Progress;

