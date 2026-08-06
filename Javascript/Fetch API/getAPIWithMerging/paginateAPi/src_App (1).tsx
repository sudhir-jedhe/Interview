import React from 'react';
import PaginatedAPIDemo from './components/PaginatedAPIDemo';

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Paginated API Response Handling</h1>
      <PaginatedAPIDemo />
    </div>
  );
};

export default App;

