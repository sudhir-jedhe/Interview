import React, { useState, useCallback, useMemo } from 'react';

interface UserProfile {
  name: string;
  [key: string]: any;
}

const UserProfileBuilder: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [age, setAge] = useState<string>('');

  // Method 1: Using an if statement
  const addAdminProperty = useCallback((obj: UserProfile): UserProfile => {
    if (isAdmin) {
      obj.isAdmin = true;
    }
    return obj;
  }, [isAdmin]);

  // Method 2: Using a ternary operator
  const addActiveProperty = useCallback((obj: UserProfile): UserProfile => {
    isActive ? obj.isActive = true : null;
    return obj;
  }, [isActive]);

  // Method 3: Using logical AND (&&)
  const addPremiumProperty = useCallback((obj: UserProfile): UserProfile => {
    isPremium && (obj.isPremium = true);
    return obj;
  }, [isPremium]);

  // Method 4: Using object spread syntax
  const addAgeProperty = useCallback((obj: UserProfile): UserProfile => {
    return {
      ...obj,
      ...(age ? { age: parseInt(age) } : {})
    };
  }, [age]);

  // Method 5: Using Object.assign()
  const addVerifiedProperty = useCallback((obj: UserProfile): UserProfile => {
    return Object.assign(obj, isActive && isAdmin ? { isVerified: true } : {});
  }, [isActive, isAdmin]);

  // Method 6: Using a function
  const addPropertyIf = useCallback((condition: boolean, obj: UserProfile, property: string, value: any): UserProfile => {
    if (condition) {
      obj[property] = value;
    }
    return obj;
  }, []);

  // Method 7: Using Array.reduce()
  const addMultipleProperties = useCallback((obj: UserProfile): UserProfile => {
    const conditions = [
      { condition: isAdmin, property: 'accessLevel', value: 'admin' },
      { condition: isPremium, property: 'subscriptionTier', value: 'premium' },
      { condition: isActive, property: 'lastActive', value: new Date().toISOString() }
    ];

    return conditions.reduce((acc, curr) => {
      if (curr.condition) {
        acc[curr.property] = curr.value;
      }
      return acc;
    }, obj);
  }, [isAdmin, isPremium, isActive]);

  const userProfile = useMemo(() => {
    let profile: UserProfile = { name };
    profile = addAdminProperty(profile);
    profile = addActiveProperty(profile);
    profile = addPremiumProperty(profile);
    profile = addAgeProperty(profile);
    profile = addVerifiedProperty(profile);
    profile = addPropertyIf(name.length > 0, profile, 'hasName', true);
    profile = addMultipleProperties(profile);
    return profile;
  }, [name, addAdminProperty, addActiveProperty, addPremiumProperty, addAgeProperty, addVerifiedProperty, addPropertyIf, addMultipleProperties]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Profile Builder</h1>
      <div className="mb-4">
        <label className="block mb-2">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="mr-2"
          />
          Is Admin
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-2"
          />
          Is Active
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="mr-2"
          />
          Is Premium
        </label>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">User Profile:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(userProfile, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UserProfileBuilder;

