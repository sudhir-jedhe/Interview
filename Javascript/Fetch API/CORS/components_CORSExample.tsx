import React, { useState } from 'react';

interface CORSExampleProps {
  title: string;
  request: string;
  response: string;
}

const CORSExample: React.FC<CORSExampleProps> = ({ title, request, response }) => {
  const [showResponse, setShowResponse] = useState(false);

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="bg-gray-100 p-2 rounded mb-2">
        <pre className="whitespace-pre-wrap">{request}</pre>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowResponse(!showResponse)}
      >
        {showResponse ? 'Hide Response' : 'Show Response'}
      </button>
      {showResponse && (
        <div className="bg-green-100 p-2 rounded mt-2">
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
};

export default CORSExample;

