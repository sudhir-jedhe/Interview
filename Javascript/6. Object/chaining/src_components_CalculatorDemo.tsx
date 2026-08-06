import React, { useState, useCallback } from 'react';

// Object Literal Calculator
const calculatorObj = {
  total: 0,
  add: function(val: number) {
    this.total += val;
    return this;
  },
  subtract: function(val: number) {
    this.total -= val;
    return this;
  },
  multiply: function(val: number) {
    this.total *= val;
    return this;
  },
  divide: function(val: number) {
    this.total /= val;
    return this;
  },
  reset: function() {
    this.total = 0;
    return this;
  }
};

// Constructor Function Calculator
class CalculatorClass {
  total: number;

  constructor() {
    this.total = 0;
  }

  add = (val: number) => {
    this.total += val;
    return this;
  }

  subtract = (val: number) => {
    this.total -= val;
    return this;
  }

  multiply = (val: number) => {
    this.total *= val;
    return this;
  }

  divide = (val: number) => {
    this.total /= val;
    return this;
  }

  reset = () => {
    this.total = 0;
    return this;
  }
}

const calculatorClass = new CalculatorClass();

const CalculatorDemo: React.FC = () => {
  const [objResult, setObjResult] = useState<number>(0);
  const [classResult, setClassResult] = useState<number>(0);
  const [input, setInput] = useState<string>('');

  const handleCalculation = useCallback((type: 'add' | 'subtract' | 'multiply' | 'divide') => {
    const value = parseFloat(input);
    if (isNaN(value)) return;

    calculatorObj[type](value);
    setObjResult(calculatorObj.total);

    calculatorClass[type](value);
    setClassResult(calculatorClass.total);

    setInput('');
  }, [input]);

  const handleReset = useCallback(() => {
    calculatorObj.reset();
    calculatorClass.reset();
    setObjResult(0);
    setClassResult(0);
    setInput('');
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Method Chaining Calculator Demo</h1>
      
      <div className="mb-4">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter a number"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={() => handleCalculation('add')} className="bg-blue-500 text-white p-2 rounded">Add</button>
        <button onClick={() => handleCalculation('subtract')} className="bg-red-500 text-white p-2 rounded">Subtract</button>
        <button onClick={() => handleCalculation('multiply')} className="bg-green-500 text-white p-2 rounded">Multiply</button>
        <button onClick={() => handleCalculation('divide')} className="bg-yellow-500 text-white p-2 rounded">Divide</button>
      </div>
      
      <button onClick={handleReset} className="w-full bg-gray-500 text-white p-2 rounded mb-4">Reset</button>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Object Literal Result:</h2>
          <div className="bg-gray-100 p-2 rounded">{objResult}</div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Class Instance Result:</h2>
          <div className="bg-gray-100 p-2 rounded">{classResult}</div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorDemo;

