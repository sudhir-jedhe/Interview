import React, { useState } from 'react';
import { ExecutionStep, runDemo1, runDemo2, runDemo3 } from '../utils/executionUtils';

const ExecutionOrderDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<number>(1);
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const runDemo = (demoNumber: number) => {
    setSelectedDemo(demoNumber);
    setCurrentStep(0);
    switch (demoNumber) {
      case 1:
        setSteps(runDemo1());
        break;
      case 2:
        setSteps(runDemo2());
        break;
      case 3:
        setSteps(runDemo3());
        break;
    }
  };

  const playDemo = async () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    for (let i = 0; i <= steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsPlaying(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sync':
        return 'bg-blue-100 border-blue-500';
      case 'microtask':
        return 'bg-green-100 border-green-500';
      case 'macrotask':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">JavaScript Execution Order Demo</h1>
      <div className="mb-4 space-x-2">
        <button
          onClick={() => runDemo(1)}
          className={`px-4 py-2 rounded ${selectedDemo === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Demo 1
        </button>
        <button
          onClick={() => runDemo(2)}
          className={`px-4 py-2 rounded ${selectedDemo === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Demo 2
        </button>
        <button
          onClick={() => runDemo(3)}
          className={`px-4 py-2 rounded ${selectedDemo === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Demo 3
        </button>
      </div>
      
      {steps.length > 0 && (
        <div className="mb-4">
          <button
            onClick={playDemo}
            disabled={isPlaying}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            {isPlaying ? 'Playing...' : 'Play Demo'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-4 border-l-4 rounded transition-all duration-300 ${
              getTypeColor(step.type)
            } ${index < currentStep ? 'opacity-100' : 'opacity-50'}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold">{step.type.toUpperCase()}: </span>
                {step.description}
              </div>
              <div className="text-xl font-bold">{step.output}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Legend:</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border border-blue-500 mr-2"></div>
            <span>Synchronous Code</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-500 mr-2"></div>
            <span>Microtasks (Promises)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border border-red-500 mr-2"></div>
            <span>Macrotasks (setTimeout)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionOrderDemo;

