import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label: React.FC<LabelProps> = ({ children, ...props }) => {
  const style: React.CSSProperties = {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  return (
    <label style={style} {...props}>
      {children}
    </label>
  );
};

export default Label;

