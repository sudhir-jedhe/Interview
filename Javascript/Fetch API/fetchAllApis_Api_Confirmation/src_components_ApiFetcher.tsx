import React, { useState } from 'react';
import { fetchAllApis } from '../utils/api';

const ApiFetcher: React.FC = () => {
    const [apis, setApis] = useState<string[]>([
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://jsonplaceholder.typicode.com/todos/1',
        'https://invalid-api.example.com'
    ]);
    const [results, setResults] = useState<{ data: any[], errors: Error[] } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleApiChange = (index: number, value: string) => {
        const newApis = [...apis];
        newApis[index] = value;
        setApis(newApis);
    };

    const handleAddApi = () => {
        setApis([...apis, '']);
    };

    const handleRemoveApi = (index: number) => {
        const newApis = apis.filter((_, i) => i !== index);
        setApis(newApis);
    };

    const handleFetchAll = async () => {
        setLoading(true);
        try {
            const result = await fetchAllApis(apis);
            setResults(result);
        } catch (error) {
            console.error("Error fetching APIs:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">API Fetcher</h1>
            
            {apis.map((api, index) => (
                <div key={index} className="flex items-center mb-2">
                    <input
                        type="text"
                        value={api}
                        onChange={(e) => handleApiChange(index, e.target.value)}
                        className="flex-grow p-2 border rounded mr-2"
                        placeholder="Enter API URL"
                    />
                    <button
                        onClick={() => handleRemoveApi(index)}
                        className="bg-red-500 text-white p-2 rounded"
                    >
                        Remove
                    </button>
                </div>
            ))}
            
            <button
                onClick={handleAddApi}
                className="bg-green-500 text-white p-2 rounded mr-2 mt-2"
            >
                Add API
            </button>
            
            <button
                onClick={handleFetchAll}
                className="bg-blue-500 text-white p-2 rounded mt-2"
                disabled={loading}
            >
                {loading ? 'Fetching...' : 'Fetch All APIs'}
            </button>

            {results && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Results:</h2>
                    <div className="bg-gray-100 p-4 rounded">
                        <h3 className="font-semibold">Successful Responses:</h3>
                        <pre className="whitespace-pre-wrap">
                            {JSON.stringify(results.data, null, 2)}
                        </pre>
                        
                        {results.errors.length > 0 && (
                            <>
                                <h3 className="font-semibold mt-4">Errors:</h3>
                                <ul className="list-disc list-inside">
                                    {results.errors.map((error, index) => (
                                        <li key={index} className="text-red-500">
                                            {error.message}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiFetcher;

