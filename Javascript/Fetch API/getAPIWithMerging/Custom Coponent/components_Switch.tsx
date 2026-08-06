import React, { useState } from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange(newChecked);
  };

  const containerStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '50px',
    height: '24px',
    backgroundColor: isChecked ? '#3498db' : '#ccc',
    borderRadius: '12px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const toggleStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: isChecked ? '28px' : '2px',
    transition: 'left 0.3s',
  };

  return (
    <div style={containerStyle} onClick={handleToggle}>
      <div style={toggleStyle} />
    </div>
  );
};

export default Switch;

