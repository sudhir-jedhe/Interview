import React, { useState } from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, name, value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  const optionStyle: React.CSSProperties = {
    marginBottom: '8px',
  };

  return (
    <div style={containerStyle}>
      {options.map((option) => (
        <label key={option.value} style={optionStyle}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={handleChange}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;

