import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  const style: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    margin: '20px 0',
  };

  return <div style={style}>{children}</div>;
};

export default Card;

export const CardHeader: React.FC<CardProps> = ({ children }) => {
  const style: React.CSSProperties = {
    marginBottom: '15px',
  };

  return <div style={style}>{children}</div>;
};

export const CardContent: React.FC<CardProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const CardFooter: React.FC<CardProps> = ({ children }) => {
  const style: React.CSSProperties = {
    marginTop: '15px',
    borderTop: '1px solid #eee',
    paddingTop: '15px',
  };

  return <div style={style}>{children}</div>;
};

