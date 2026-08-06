import React, { useState, useCallback } from 'react';

const CompactionDemo: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [results, setResults] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const removeFalsyValues = (obj: any) => {
    const newObj: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value) {
        newObj[key] = value;
      }
    }
    return newObj;
  };

  const compact = (val: any) => {
    if (Array.isArray(val)) {
      return val.filter(Boolean);
    } else if (typeof val === 'object' && val !== null) {
      return Object.fromEntries(
        Object.entries(val).filter(([key, value]) => Boolean(value))
      );
    }
    return val;
  };

  const deepCompact = (val: any): any => {
    const data = Array.isArray(val) ? val.filter(Boolean) : val;
    return Object.entries(data).reduce(
      (acc: any, [key, value]) => {
        if (Boolean(value)) {
          acc[key] = typeof value === 'object' ? deepCompact(value) : value;
        }
        return acc;
      },
      Array.isArray(val) ? [] : {}
    );
  };

  const handleCompaction = useCallback((method: string) => {
    setError(null);
    try {
      const parsedInput = JSON.parse(jsonInput);
      let result;
      switch (method) {
        case 'removeFalsy':
          result = removeFalsyValues(parsedInput);
          break;
        case 'compact':
          result = compact(parsedInput);
          break;
        case 'deepCompact':
          result = deepCompact(parsedInput);
          break;
        default:
          throw new Error('Invalid compaction method');
      }
      setResults(prev => ({ ...prev, [method]: JSON.stringify(result, null, 2) }));
    } catch (err) {
      setError('Invalid JSON input');
    }
  }, [jsonInput]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">JSON Compaction Demo</h1>
      
      <div className="mb-4">
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-40 p-2 border rounded"
          placeholder="Enter JSON here..."
        />
      </div>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <button
          onClick={() => handleCompaction('removeFalsy')}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Remove Falsy Values
        </button>
        <button
          onClick={() => handleCompaction('compact')}
          className="bg-green-500 text-white p-2 rounded"
        >
          Compact
        </button>
        <button
          onClick={() => handleCompaction('deepCompact')}
          className="bg-purple-500 text-white p-2 rounded"
        >
          Deep Compact
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(results).map(([method, result]) => (
          <div key={method} className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">{method} Result:</h2>
            <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-60">
              {result}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompactionDemo;

