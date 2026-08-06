import React, { useState } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ min, max, step, value, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setCurrentValue(newValue);
    onChange(newValue);
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
  };

  return (
    <div style={containerStyle}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        style={inputStyle}
      />
      <div>{currentValue}</div>
    </div>
  );
};

export default Slider;

