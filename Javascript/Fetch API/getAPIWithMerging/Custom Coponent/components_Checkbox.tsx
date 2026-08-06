import React, { useState } from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setIsChecked(newChecked);
    onChange(newChecked);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    marginRight: '8px',
  };

  return (
    <label style={containerStyle}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        style={inputStyle}
      />
      {label}
    </label>
  );
};

export default Checkbox;

