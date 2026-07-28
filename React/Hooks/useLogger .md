```js
import React from "react";
import useLogger from "./useLogger";
import { useEffect } from "react";

// src/useLogger.js

const useLogger = (componentName, props) => {
    useEffect(() => {
        console.log(`[${componentName}] Mounted with props:`, props);

        return () => {
            console.log(`[${componentName}] Unmounted`);
        };
    }, []); // Runs on mount and unmount

    useEffect(() => {
        console.log(`[${componentName}] Updated with props:`, props);
    }, [props]); // Runs on prop changes
};

export default useLogger;


// src/MyComponent.js

const MyComponent = (props) => {
    useLogger('MyComponent', props);

    return (
        <div>
            <h1>Hello, {props.name}!</h1>
        </div>
    );
};

export default MyComponent;
```
