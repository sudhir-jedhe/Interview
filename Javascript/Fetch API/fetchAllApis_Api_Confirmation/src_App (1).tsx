import React from 'react';
import ApiFetcher from './components/ApiFetcher';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <ApiFetcher />
      </div>
    </div>
  );
};

export default App;

