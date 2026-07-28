```js
import React, { useState } from "react";

const UpiAutoComplete = ({ upiIds }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredUpiIds, setFilteredUpiIds] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filtered = upiIds.filter((upiId) =>
        upiId.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredUpiIds(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (upiId) => {
    setInputValue(upiId);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    // Hide suggestions when input loses focus
    setShowSuggestions(false);
  };

  return (
    <div className="upi-autocomplete">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter UPI ID"
      />
      {showSuggestions && inputValue && (
        <ul className="suggestions-list">
          {filteredUpiIds.map((upiId, index) => (
            <li key={index} onClick={() => handleSuggestionClick(upiId)}>
              {upiId}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Example usage (uncomment to test)
// const upiIds = ['example@upi', 'user@bank', 'john.doe@upi', 'jane.doe@bank', 'test@upi'];
// <UpiAutoComplete upiIds={upiIds} />;

// Do not edit below this line
export default UpiAutoComplete;
```
