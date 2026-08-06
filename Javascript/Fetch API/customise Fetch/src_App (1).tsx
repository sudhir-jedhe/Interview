import React from 'react';
import FetchDemo from './components/FetchDemo';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <FetchDemo />
      </div>
    </div>
  );
};

export default App;

