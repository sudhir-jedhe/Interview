import React from 'react';
import TodoCRUD from './components/TodoCRUD';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <TodoCRUD />
    </div>
  );
};

export default App;

