import React from 'react';
import FetchMethodsDemo from '../components/FetchMethodsDemo';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Fetch API Methods and Response Codes (MERN Stack)</h1>
      <FetchMethodsDemo />
    </div>
  );
};

export default Home;

