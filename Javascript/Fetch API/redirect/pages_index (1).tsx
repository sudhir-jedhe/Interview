import React from 'react';
import { HttpsRedirect } from '../components/HttpsRedirect';

const HomePage: React.FC = () => {
  return (
    <>
      <HttpsRedirect />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to our secure site</h1>
        <p className="text-lg">
          This page is always served over HTTPS thanks to our HttpsRedirect component.
        </p>
      </div>
    </>
  );
};

export default HomePage;

