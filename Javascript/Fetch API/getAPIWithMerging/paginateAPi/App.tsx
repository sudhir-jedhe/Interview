import React from 'react';
import CustomComponentsDemo from './components/CustomComponentsDemo';

const App: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Custom UI Components Demo</h1>
      <CustomComponentsDemo />
    </div>
  );
};

export default App;

