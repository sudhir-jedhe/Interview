import React from 'react';

interface AlertProps {
  title: string;
  description: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

const Alert: React.FC<AlertProps> = ({ title, description, variant = 'info' }) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'success':
        return { backgroundColor: '#d4edda', color: '#155724', borderColor: '#c3e6cb' };
      case 'warning':
        return { backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeeba' };
      case 'error':
        return { backgroundColor: '#f8d7da', color: '#721c24', borderColor: '#f5c6cb' };
      default:
        return { backgroundColor: '#cce5ff', color: '#004085', borderColor: '#b8daff' };
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: '12px 20px',
    marginBottom: '15px',
    border: '1px solid transparent',
    borderRadius: '4px',
    ...getVariantStyles(),
  };

  const titleStyle: React.CSSProperties = {
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>{title}</div>
      <div>{description}</div>
    </div>
  );
};

export default Alert;

