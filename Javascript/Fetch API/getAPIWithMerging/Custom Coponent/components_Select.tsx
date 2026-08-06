import React, { useState } from 'react';

interface SelectProps {
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const triggerStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
  };

  const contentStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginTop: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  };

  const optionStyle: React.CSSProperties = {
    padding: '8px 12px',
    cursor: 'pointer',
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div style={containerStyle}>
      <button style={triggerStyle} onClick={() => setIsOpen(!isOpen)}>
        {selectedValue || placeholder || 'Select an option'}
      </button>
      {isOpen && (
        <div style={contentStyle}>
          {options.map((option) => (
            <div
              key={option.value}
              style={optionStyle}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;

