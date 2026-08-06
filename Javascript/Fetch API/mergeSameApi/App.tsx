import React from 'react';
import APIDataFetcher from './components/APIDataFetcher';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <APIDataFetcher />
    </div>
  );
};

export default App;

