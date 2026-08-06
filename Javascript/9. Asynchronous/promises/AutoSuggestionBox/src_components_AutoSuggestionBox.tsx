import React, { useState, useEffect, useRef } from 'react';
import { getSuggestions } from '../utils/mockServer';

const AutoSuggestionBox: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!inputValue) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await getSuggestions(inputValue);
        setSuggestions(results);
      } catch (err) {
        setError('Failed to fetch suggestions. Please try again.');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionAreaRef.current &&
        !suggestionAreaRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        ref={inputRef}
        type="search"
        id="search"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Enter your query"
        className="w-full p-2 border border-gray-300 rounded"
      />
      {showSuggestions && (
        <div
          ref={suggestionAreaRef}
          className="mt-2 border border-gray-300 rounded bg-white"
        >
          {isLoading && <div className="p-2">Loading suggestions...</div>}
          {error && <div className="p-2 text-red-500">{error}</div>}
          {!isLoading && !error && suggestions.length === 0 && (
            <div className="p-2">No suggestions found</div>
          )}
          {!isLoading && !error && suggestions.length > 0 && (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoSuggestionBox;

