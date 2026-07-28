```js
import "./LoadingIndicator.css";
import LoadingIndicator from "./LoadingIndicator";
import React from "react";
import React, { useEffect, useState } from "react";

// src/LoadingIndicator.js

const LoadingIndicator = ({ id }) => {
    return (
        <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Loading {id}...</span>
        </div>
    );
};

export default LoadingIndicator;



/* src/LoadingIndicator.css */
.loading-indicator {
    display: flex;
    align-items: center;
    margin: 10px 0;
}

.spinner {
    width: 20px;
    height: 20px;
    border: 3px solid #ccc;
    border-top-color: #007BFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 10px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}


// src/LoadingQueue.js

const LoadingQueue = () => {
    const [loadingItems, setLoadingItems] = useState([]);

    const addLoadingItem = () => {
        const id = loadingItems.length + 1;
        setLoadingItems((prev) => [...prev, id]);

        // Simulate loading completion after 2 seconds
        setTimeout(() => {
            setLoadingItems((prev) => prev.filter(item => item !== id));
        }, 2000);
    };

    return (
        <div>
            <h2>Loading Indicators Queue</h2>
            <button onClick={addLoadingItem}>Add Loading Indicator</button>
            <div>
                {loadingItems.map((id) => (
                    <LoadingIndicator key={id} id={id} />
                ))}
            </div>
        </div>
    );
};

export default LoadingQueue;
```
