import React from 'react';
import PaginatedItemList from './components/PaginatedItemList';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <PaginatedItemList />
    </div>
  );
};

export default App;

