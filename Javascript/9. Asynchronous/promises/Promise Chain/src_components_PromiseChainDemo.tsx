import React, { useState, useEffect } from 'react';
import { ChainStep, executePromiseChain } from '../utils/promiseUtils';

const PromiseChainDemo: React.FC = () => {
  const [steps, setSteps] = useState<ChainStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const runDemo = async () => {
    setIsPlaying(true);
    setCurrentStep(0);
    const results = await executePromiseChain();
    
    for (let i = 0; i <= results.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setSteps(results);
    setIsPlaying(false);
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'then':
        return 'bg-blue-100 border-blue-500';
      case 'catch':
        return 'bg-red-100 border-red-500';
      case 'finally':
        return 'bg-green-100 border-green-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Promise Chain Execution Demo</h1>
      <button
        onClick={runDemo}
        disabled={isPlaying}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 disabled:bg-gray-300"
      >
        {isPlaying ? 'Running...' : 'Run Demo'}
      </button>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-4 border-l-4 rounded transition-all duration-300 ${
              getStepColor(step.type)
            } ${index < currentStep ? 'opacity-100' : 'opacity-50'}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold uppercase">{step.type}: </span>
                {step.description}
              </div>
              <div className="text-xl font-mono">
                {step.value === undefined ? 'undefined' : step.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Key Points:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>If a <code>then</code> handler doesn't return a value, the next handler receives <code>undefined</code></li>
          <li>Nested promises are resolved before continuing the chain</li>
          <li>The <code>catch</code> block handles any rejections in the chain</li>
          <li>The <code>finally</code> block receives no parameters and its return value is ignored</li>
        </ul>
      </div>
    </div>
  );
};

export default PromiseChainDemo;

