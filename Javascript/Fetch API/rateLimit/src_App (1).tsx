import React from 'react';
import RateLimiterDemo from './components/RateLimiterDemo';
import DebouncedRateLimiterDemo from './components/DebouncedRateLimiterDemo';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Rate Limiter Comparison</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RateLimiterDemo />
        <DebouncedRateLimiterDemo />
      </div>
    </div>
  );
};

export default App;

