import React, { useState, useCallback, useMemo } from 'react';

interface UserBasicInfo {
  id: number;
  name: string;
}

interface UserExtraInfo {
  id: number;
  age?: number;
  email?: string;
}

const UserDataMerger: React.FC = () => {
  const [basicUserData, setBasicUserData] = useState<UserBasicInfo[]>([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' },
  ]);

  const [extraUserData, setExtraUserData] = useState<UserExtraInfo[]>([
    { id: 1, age: 30, email: 'john@example.com' },
    { id: 2, age: 28 },
    { id: 4, email: 'alice@example.com' },
  ]);

  const combineArrays = useCallback((a: any[], b: any[], prop: string) => {
    return Object.values(
      [...a, ...b].reduce((acc, v) => {
        if (v[prop]) {
          acc[v[prop]] = acc[v[prop]]
            ? { ...acc[v[prop]], ...v }
            : { ...v };
        }
        return acc;
      }, {})
    );
  }, []);

  const mergedUserData = useMemo(() => {
    return combineArrays(basicUserData, extraUserData, 'id');
  }, [basicUserData, extraUserData, combineArrays]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Data Merger</h1>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Basic User Data</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(basicUserData, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Extra User Data</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(extraUserData, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Merged User Data</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(mergedUserData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UserDataMerger;
