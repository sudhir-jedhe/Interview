import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseStyle: React.CSSProperties = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#3498db',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#95a5a6',
      color: 'white',
    },
    destructive: {
      backgroundColor: '#e74c3c',
      color: 'white',
    },
  };

  const style = { ...baseStyle, ...variantStyles[variant] };

  return (
    <button style={style} {...props}>
      {children}
    </button>
  );
};

export default Button;

