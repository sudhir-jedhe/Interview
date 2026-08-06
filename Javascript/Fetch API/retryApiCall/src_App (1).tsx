import React from 'react';
import DebouncedRateLimiterDemo from './components/DebouncedRateLimiterDemo';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <DebouncedRateLimiterDemo />
    </div>
  );
};

export default App;

