To log **which function is being called from which exact file and line number**, you can inspect the runtime V8 execution stack without throwing a real uncaught exception.

Here is a lightweight, zero-dependency **Caller Tracing Utility** you can drop into your code, along with an automatic wrapper for tracking React components and hooks.

---

### 1. The Call-Site Inspector Utility (`src/utils/tracer.js`)

This function generates a synthetic `new Error().stack`, parses the frames, and extracts the **caller** (the function that called `trace()`) and the **origin** (who called that function).

```javascript
/**
 * Inspects the call stack and returns structured file and function info.
 * @param {number} depth - 1 for immediate caller, 2 for caller's caller, etc.
 */
export function getCallerInfo(depth = 1) {
  const err = new Error();
  const stack = err.stack || '';
  const lines = stack.split('\n');

  // Skip lines:
  // line 0 is "Error"
  // line 1 is "getCallerInfo"
  // line 2 is the logging helper (e.g. logCall)
  // line 3+ are the actual callers
  const targetIndex = 2 + depth;
  const rawFrame = lines[targetIndex] || lines[lines.length - 1] || '';

  // Match formats:
  // Chrome/Edge/Node: "at FunctionName (http://localhost:5173/src/pages/VehicleInfo.jsx?t=123:45:12)"
  // Firefox:          "FunctionName@http://localhost:5173/src/pages/VehicleInfo.jsx:45:12"
  const match =
    rawFrame.match(/at\s+(?:(.+?)\s+\()?(?:(.+?):(\d+):(\d+)\)?/) ||
    rawFrame.match(/(?:(.*?)@)?(.+?):(\d+):(\d+)/);

  if (!match) {
    return { functionName: '<anonymous>', file: '<unknown>', line: '?', col: '?' };
  }

  const [, rawFn, rawPath, line, col] = match;

  // Clean Vite / Webpack / URL parameters (e.g., "?t=1725950000" or "http://localhost:5173/")
  let cleanFile = rawPath || '';
  try {
    const url = new URL(cleanFile, window.location.origin);
    cleanFile = url.pathname; // Strips domain, port, and query params -> "/src/pages/VehicleInfo.jsx"
  } catch {
    // Fallback if not a standard URL
    cleanFile = cleanFile.replace(/webpack-internal:\/\/\//, '').replace(/\?.*$/, '');
  }

  // Format clean function name
  const functionName = rawFn ? rawFn.replace(/^Object\./, '') : '<anonymous/render>';

  return {
    functionName,
    file: cleanFile,
    line,
    col,
  };
}

/**
 * Standardized logger displaying: [caller] -> [file:line]
 */
export function logCall(customMessage = '', depth = 1) {
  const current = getCallerInfo(depth);
  const parent = getCallerInfo(depth + 1);

  const styleTag = 'background: #1e60f0; color: white; border-radius: 3px; padding: 2px 5px; font-weight: bold;';
  const stylePath = 'color: #0284c7; text-decoration: underline; font-family: monospace;';
  const styleFn = 'color: #16a34a; font-weight: bold; font-family: monospace;';

  console.groupCollapsed(
    `%cCALL%c %c${current.functionName}()%c called from %c${current.file}:${current.line}%c ${customMessage ? `— ${customMessage}` : ''}`,
    styleTag,
    '',
    styleFn,
    '',
    stylePath,
    'color: #64748b;'
  );

  console.log(`Executed function : %c${current.functionName}()`, 'color: #16a34a; font-weight: bold;');
  console.log(`Location          : %c${current.file}:${current.line}:${current.col}`, 'color: #0284c7;');
  console.log(`Invoked by        : %c${parent.functionName}()%c in %c${parent.file}:${parent.line}`, 'color: #eab308; font-weight: bold;', '', 'color: #64748b;');
  console.trace('Full Call Path:');
  console.groupEnd();
}

```

---

### 2. How to Use It in Components, Hooks, and Handlers

#### In a React Component or Handler

```jsx
import React, { useEffect } from 'react';
import { logCall } from '../utils/tracer';

export default function VehicleTracking() {
  useEffect(() => {
    // Traces mount execution
    logCall('Component mounted');
  }, []);

  const handleApplyFilter = (region) => {
    // Traces the button click event caller
    logCall(`Applying filter: ${region}`);
    // ... filter logic
  };

  return (
    <button onClick={() => handleApplyFilter('Togo')}>
      Filter Togo
    </button>
  );
}

```

**Browser Console Output:**

```text
▼ [CALL] handleApplyFilter() called from /src/pages/VehicleTracking.jsx:12 — Applying filter: Togo
    Executed function : handleApplyFilter()
    Location          : /src/pages/VehicleTracking.jsx:12:5
    Invoked by        : onClick() in /src/pages/VehicleTracking.jsx:21
    ▶ Full Call Path: ...

```

---

### 3. Automatic Function Call Tracer (Higher-Order Function)

If you have service functions, utility modules, or API handlers and you don't want to type `logCall()` inside each one, wrap them automatically:

```javascript
// src/utils/tracer.js

/**
 * Automatically logs input arguments, return value, file, and line for any wrapped function.
 */
export function withCallTrace(fn, customName) {
  const name = customName || fn.name || 'anonymousFunction';

  return function (...args) {
    const caller = getCallerInfo(1);
    
    console.log(
      `%c[EXEC]%c %c${name}()%c at %c${caller.file}:${caller.line}%c with args:`,
      'background: #10b981; color: white; border-radius: 3px; padding: 1px 4px; font-weight: bold;',
      '',
      'color: #059669; font-weight: bold;',
      '',
      'color: #0284c7; text-decoration: underline;',
      '',
      args
    );

    const result = fn.apply(this, args);

    // If asynchronous, log when it resolves
    if (result instanceof Promise) {
      return result
        .then((res) => {
          console.log(`%c[RESOLVED]%c %c${name}()%c ->`, 'color: #10b981;', '', 'font-weight: bold;', '', res);
          return res;
        })
        .catch((err) => {
          console.error(`%c[REJECTED]%c %c${name}()%c at ${caller.file}:${caller.line}`, 'color: #ef4444;', '', 'font-weight: bold;', '', err);
          throw err;
        });
    }

    return result;
  };
}

```

#### Usage with API Calls or Utilities

```javascript
import { withCallTrace } from '../utils/tracer';

// Plain function
function sendImmobilizeCommand(vin, reason) {
  return axiosClient.post(`/vehicles/${vin}/immobilize`, { reason });
}

// Export the traced version
export const tracedImmobilize = withCallTrace(sendImmobilizeCommand, 'sendImmobilizeCommand');

```

Whenever any component or hook executes `tracedImmobilize('EC2832', 'curfew')`, the console outputs the function name, exact file path, line number, caller origin, and payload parameters.

To trace **which function initiated an API call and from which file and line number**, the trace capture must occur in the **request interceptor**.

When an HTTP call fails or resolves asynchronously, the event loop loses the original call stack. Capturing a synthetic `new Error()` inside the Axios request interceptor preserves the initiating component or service file path.

---

### 1. The Call-Site Extractor Helper (`src/utils/apiCallSite.js`)

```javascript
/**
 * Parses a synthetic Error stack to extract the exact function,
 * file name, and line number where the axios call was made.
 */
export function extractApiCallSite(syntheticError) {
  const stack = syntheticError?.stack || '';
  const lines = stack.split('\n');

  // Filter out internal axios, interceptor, and bundler runtime lines
  const callerFrame = lines.find((line) => {
    const isErrorHeader = line.startsWith('Error');
    const isAxios = line.includes('axios') || line.includes('axiosClient');
    const isInterceptor = line.includes('apiCallSite') || line.includes('interceptors');
    const isNodeModules = line.includes('node_modules');

    return !isErrorHeader && !isAxios && !isInterceptor && !isNodeModules;
  });

  if (!callerFrame) {
    return { fn: '<anonymous>', file: '<unknown>', line: '?', col: '?' };
  }

  // Parse Chrome/Edge ("at fn (file:line:col)") or Firefox ("fn@file:line:col")
  const match =
    callerFrame.match(/at\s+(?:(.+?)\s+\()?(?:(.+?):(\d+):(\d+)\)?/) ||
    callerFrame.match(/(?:(.*?)@)?(.+?):(\d+):(\d+)/);

  if (!match) {
    return { fn: '<anonymous>', file: '<unknown>', line: '?', col: '?' };
  }

  const [, fn, rawPath, line, col] = match;

  let cleanFile = rawPath || '';
  try {
    const url = new URL(cleanFile, window.location.origin);
    cleanFile = url.pathname; // Strips host/port/query: "/src/pages/VehicleInfo.jsx"
  } catch {
    cleanFile = cleanFile.replace(/webpack-internal:\/\/\//, '').replace(/\?.*$/, '');
  }

  return {
    fn: fn ? fn.replace(/^Object\./, '') : '<anonymous>',
    file: cleanFile,
    line,
    col,
  };
}

```

---

### 2. Plug Into Axios Interceptors (`src/api/axiosClient.js`)

```javascript
import axios from 'axios';
import { extractApiCallSite } from '../utils/apiCallSite';

const axiosClient = axios.create({
  baseURL: 'https://api.spiroiothub.internal/v1',
  timeout: 8000,
});

// --- REQUEST INTERCEPTOR: Capture the Call-Site Stack ---
axiosClient.interceptors.request.use(
  (config) => {
    // 1. Snapshot the synchronous call stack BEFORE going async
    const callSiteError = new Error('CallSiteSnapshot');
    const caller = extractApiCallSite(callSiteError);

    // Attach to config metadata so response interceptor can read it
    config.metadata = {
      caller,
      startTime: performance.now(),
    };

    // Console output showing file + function making the request
    console.groupCollapsed(
      `%cAPI REQ%c %c${config.method?.toUpperCase()} ${config.url}%c from %c${caller.fn}()%c at %c${caller.file}:${caller.line}`,
      'background: #0284c7; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
      '',
      'color: #0284c7; font-weight: bold;',
      '',
      'color: #16a34a; font-weight: bold;',
      '',
      'color: #d97706; text-decoration: underline;'
    );
    console.log(`Initiating Function : %c${caller.fn}()`, 'color: #16a34a; font-weight: bold;');
    console.log(`File Location       : %c${caller.file}:${caller.line}:${caller.col}`, 'color: #d97706;');
    console.log('Payload/Params      :', config.data || config.params || 'None');
    console.groupEnd();

    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR: Trace Failures & Success Back to Caller ---
axiosClient.interceptors.response.use(
  (response) => {
    const caller = response.config?.metadata?.caller;
    const duration = Math.round(performance.now() - (response.config?.metadata?.startTime || 0));

    if (caller) {
      console.log(
        `%cAPI OK (${duration}ms)%c %c${response.config.url}%c resolved for %c${caller.fn}()%c (${caller.file}:${caller.line})`,
        'background: #16a34a; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px;',
        '',
        'color: #16a34a;',
        '',
        'font-weight: bold; color: #334155;',
        '',
        'color: #64748b;'
      );
    }
    return response;
  },
  (error) => {
    const caller = error.config?.metadata?.caller;
    const status = error.response?.status || 'NETWORK_FAIL';

    console.group(
      `%cAPI ERR ${status}%c %c${error.config?.url}%c called by %c${caller?.fn || 'unknown'}()%c in %c${caller?.file || 'unknown'}:${caller?.line || '?'}`,
      'background: #dc2626; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
      '',
      'color: #dc2626; font-weight: bold;',
      '',
      'color: #16a34a; font-weight: bold;',
      '',
      'color: #d97706; text-decoration: underline;'
    );

    console.error(`Failed Endpoint : ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    console.error(`Triggered from  : ${caller?.fn}() at ${caller?.file}:${caller?.line}:${caller?.col}`);
    console.error('Error Details   :', error.response?.data || error.message);
    console.groupEnd();

    return Promise.reject(error);
  }
);

export default axiosClient;

```

---

### 3. Example in Action

Suppose a component dispatches an API call:

```jsx
// File: src/pages/VehicleTracking.jsx (Line 42)

import axiosClient from '../api/axiosClient';

export default function VehicleTracking() {
  function handleFetchTelemetry(vin) {
    // Line 42: API dispatched here
    return axiosClient.get(`/vehicles/${vin}/telemetry`);
  }

  return (
    <button onClick={() => handleFetchTelemetry('EC2832')}>
      Refresh Telemetry
    </button>
  );
}

```

#### What Appears in the Browser Console

```text
▼ [API REQ] GET /vehicles/EC2832/telemetry from handleFetchTelemetry() at /src/pages/VehicleTracking.jsx:42
    Initiating Function : handleFetchTelemetry()
    File Location       : /src/pages/VehicleTracking.jsx:42:19
    Payload/Params      : None

```

If the backend throws a `404` or `500`:

```text
▼ [API ERR 404] /vehicles/EC2832/telemetry called by handleFetchTelemetry() in /src/pages/VehicleTracking.jsx:42
    Failed Endpoint : GET /vehicles/EC2832/telemetry
    Triggered from  : handleFetchTelemetry() at /src/pages/VehicleTracking.jsx:42:19
    Error Details   : { message: "Vehicle telemetry packet not found" }



Yes. When an API call is wrapped inside multiple utility or service files (e.g., `Component.jsx` → `vehicleService.js` → `apiClient.js` → `axios`), a simple stack trace often points to the innermost wrapper rather than the component or service that actually initiated the business action.

To handle deeply nested calls, parse the **entire synchronous call stack** and filter out internal plumbing layers. This produces the **full breadcrumb call chain** showing every file and function leading up to the network request.

---

### 1. Nested Chain Parser (`src/utils/nestedCallChain.js`)

This utility walks down the entire call stack and extracts every relevant userland file, ignoring `axios`, `node_modules`, bundler loaders, and internal transport wrappers.

```javascript
/**
 * Walks the stack and returns the complete hierarchical chain of calls.
 */
export function getNestedCallChain(syntheticError = new Error('CallChainSnapshot')) {
  const stack = syntheticError.stack || '';
  const lines = stack.split('\n');

  // Ignored library and infrastructure patterns
  const IGNORE_PATTERNS = [
    'node_modules',
    'axios',
    'axiosClient',
    'nestedCallChain',
    'interceptors',
    'chunk-',
    'vite/dist',
    '@vite',
    'webpack',
    'regenerator-runtime',
  ];

  const callChain = [];

  for (const line of lines) {
    // Check if line is an execution frame
    const isFrame = line.trim().startsWith('at ') || line.includes('@');
    if (!isFrame) continue;

    // Skip ignored libraries and internal tools
    const isIgnored = IGNORE_PATTERNS.some((pattern) => line.includes(pattern));
    if (isIgnored) continue;

    // Parse V8 format: "at FunctionName (http://.../src/services/api.js:20:10)"
    // or Firefox format: "FunctionName@http://.../src/services/api.js:20:10"
    const match =
      line.match(/at\s+(?:(.+?)\s+\()?(?:(.+?):(\d+):(\d+)\)?/) ||
      line.match(/(?:(.*?)@)?(.+?):(\d+):(\d+)/);

    if (match) {
      const [, rawFn, rawPath, lineNumber, colNumber] = match;

      let cleanFile = rawPath || '';
      try {
        const url = new URL(cleanFile, window.location.origin);
        cleanFile = url.pathname; // Strips domain, port, and Vite query hash
      } catch {
        cleanFile = cleanFile.replace(/webpack-internal:\/\/\//, '').replace(/\?.*$/, '');
      }

      const fnName = rawFn ? rawFn.replace(/^Object\./, '') : '<anonymous>';

      callChain.push({
        fn: fnName,
        file: cleanFile,
        line: lineNumber,
        col: colNumber,
      });
    }
  }

  return {
    // The innermost business function that directly called the API wrapper
    immediateCaller: callChain[0] || { fn: '<unknown>', file: '<unknown>', line: '?' },
    // The outermost root component or event handler that triggered the whole sequence
    originCaller: callChain[callChain.length - 1] || { fn: '<root>', file: '<unknown>', line: '?' },
    // Full sequential path: [Origin Component] -> [Hook] -> [Service]
    fullChain: [...callChain].reverse(),
  };
}

```

---

### 2. Plug Into Axios Request & Response Interceptors (`src/api/axiosClient.js`)

Capture the chain synchronously in the request interceptor, store it in request metadata, and print a breadcrumb tree:

```javascript
import axios from 'axios';
import { getNestedCallChain } from '../utils/nestedCallChain';

const axiosClient = axios.create({
  baseURL: 'https://api.spiroiothub.internal/v1',
  timeout: 8000,
});

axiosClient.interceptors.request.use((config) => {
  // Capture nested stack before promise yields to the event loop
  const chainInfo = getNestedCallChain();

  config.metadata = {
    chainInfo,
    startTime: performance.now(),
  };

  const breadcrumbs = chainInfo.fullChain
    .map((step) => `${step.fn}() [${step.file.split('/').pop()}:${step.line}]`)
    .join(' ➔ ');

  console.groupCollapsed(
    `%cAPI CALL%c %c${config.method?.toUpperCase()} ${config.url}%c via %c${breadcrumbs}`,
    'background: #1e60f0; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
    '',
    'color: #0284c7; font-weight: bold;',
    '',
    'color: #64748b; font-family: monospace;'
  );

  console.log('%cFull Invocation Chain (Origin ➔ Transport):', 'font-weight: bold; color: #334155;');
  console.table(chainInfo.fullChain);

  console.log(`Endpoint        : ${config.method?.toUpperCase()} ${config.url}`);
  console.log(`Triggered By UI : ${chainInfo.originCaller.fn}() in ${chainInfo.originCaller.file}:${chainInfo.originCaller.line}`);
  console.log(`Direct Wrapper  : ${chainInfo.immediateCaller.fn}() in ${chainInfo.immediateCaller.file}:${chainInfo.immediateCaller.line}`);
  console.groupEnd();

  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const chainInfo = error.config?.metadata?.chainInfo;
    const origin = chainInfo?.originCaller;

    console.group(
      `%cAPI FAILURE (${error.response?.status || 'ERR'})%c %c${error.config?.url}%c originated at %c${origin?.file}:${origin?.line}%c in %c${origin?.fn}()`,
      'background: #dc2626; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
      '',
      'color: #dc2626; font-weight: bold;',
      '',
      'color: #d97706; text-decoration: underline;',
      '',
      'color: #16a34a; font-weight: bold;'
    );

    if (chainInfo?.fullChain) {
      console.log('%cTrace Path Leading to Failure:', 'font-weight: bold;');
      console.table(chainInfo.fullChain);
    }

    console.error('Error Details:', error.response?.data || error.message);
    console.groupEnd();

    return Promise.reject(error);
  }
);

export default axiosClient;

```

---

### 3. Concrete Example: 3-Layer Deep Call

Imagine your project is structured like this:

**Layer 1 (Direct API Client):**

```javascript
// src/api/telemetryClient.js
import axiosClient from './axiosClient';

export function postImmobilize(vin, payload) {
  // Line 5: Raw network execution
  return axiosClient.post(`/vehicles/${vin}/immobilize`, payload);
}

```

**Layer 2 (Domain Service Layer):**

```javascript
// src/services/vehicleService.js
import { postImmobilize } from '../api/telemetryClient';

export function enforceCurfewLockdown(vin, riderId) {
  // Line 6: Service method adding authorization metadata
  const payload = { riderId, reason: 'CURFEW_BREACH', timestamp: Date.now() };
  return postImmobilize(vin, payload);
}

```

**Layer 3 (UI Component / Event Handler):**

```jsx
// src/pages/VehicleInfo.jsx
import { enforceCurfewLockdown } from '../services/vehicleService';

export default function VehicleInfo() {
  function handleEmergencyLock() {
    // Line 14: Button handler initiates action
    enforceCurfewLockdown('EC2832', 'RDR-88392');
  }

  return (
    <button onClick={handleEmergencyLock}>
      Emergency Immobilize
    </button>
  );
}

```

---

### What Prints in the Console

When the button is clicked, the console logs the full trail across every file:

```text
▼ [API CALL] POST /vehicles/EC2832/immobilize via handleEmergencyLock() [VehicleInfo.jsx:14] ➔ enforceCurfewLockdown() [vehicleService.js:6] ➔ postImmobilize() [telemetryClient.js:5]
    Full Invocation Chain (Origin ➔ Transport):
    ┌───┬────────────────────────┬────────────────────────────────┬──────┬─────┐
    │ # │ fn                     │ file                           │ line │ col │
    ├───┼────────────────────────┼────────────────────────────────┼──────┼─────┤
    │ 0 │ handleEmergencyLock    │ /src/pages/VehicleInfo.jsx     │ 14   │ 5   │
    │ 1 │ enforceCurfewLockdown  │ /src/services/vehicleService.js│ 6    │ 10  │
    │ 2 │ postImmobilize         │ /src/api/telemetryClient.js    │ 5    │ 10  │
    └───┴────────────────────────┴────────────────────────────────┴──────┴─────┘
    Endpoint        : POST /vehicles/EC2832/immobilize
    Triggered By UI : handleEmergencyLock() in /src/pages/VehicleInfo.jsx:14
    Direct Wrapper  : postImmobilize() in /src/api/telemetryClient.js:5

```

If the endpoint returns an HTTP 500 error:

```text
▼ [API FAILURE (500)] /vehicles/EC2832/immobilize originated at /src/pages/VehicleInfo.jsx:14 in handleEmergencyLock()
    Trace Path Leading to Failure:
    [Table showing the exact 3 files and line numbers above]
    Error Details: { code: "DEVICE_OFFLINE", message: "Vehicle cannot be reached over LoRaWAN" }

```

### Why This Works

1. **Bypasses Single-Frame Traps:** Standard stack inspection looks only 1 frame up, which falsely identifies `telemetryClient.js` as the source for every call.
2. **Filters Out Library Noise:** By omitting internal runtime files (`axios`, `node_modules`, bundler scripts), you see only the application files you wrote.
3. **Pinpoints Root Triggers:** Identifies both the direct data layer function (`postImmobilize`) and the root UI event handler (`handleEmergencyLock`) across any depth of nested files.

Tracking a React component typically involves monitoring **renders**, **state/prop changes**, **lifecycle events (mount/unmount)**, or **user interactions/analytics**.

Here are the primary ways to track React components depending on what you need to measure:

---

### 1. Tracking Re-Renders & Prop Changes (Custom Hook)

A custom `useWhyDidYouUpdate` hook logs exactly which prop changed and caused a re-render:

```jsx
import { useEffect, useRef } from 'react';

export function useWhyDidYouUpdate(name, props) {
  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changesObj = {};

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changesObj).length) {
        console.group(`[Re-render] ${name}`);
        console.table(changesObj);
        console.groupEnd();
      }
    }

    previousProps.current = props;
  });
}

```

**Usage inside your component:**

```jsx
export default function VehicleCard(props) {
  useWhyDidYouUpdate('VehicleCard', props);

  return <div>{props.vin}</div>;
}

```

---

### 2. Tracking Lifecycle (Mount, Update, Unmount)

To log when a component enters the DOM, re-renders, or unmounts:

```jsx
import { useEffect, useRef } from 'react';

export function useComponentLifecycleTracker(componentName) {
  const renderCount = useRef(1);

  // Mount & Unmount tracker
  useEffect(() => {
    console.log(`%c[MOUNT] ${componentName}`, 'color: #16a34a; font-weight: bold;');

    return () => {
      console.log(`%c[UNMOUNT] ${componentName}`, 'color: #dc2626; font-weight: bold;');
    };
  }, [componentName]);

  // Re-render tracker
  useEffect(() => {
    if (renderCount.current > 1) {
      console.log(`%c[RENDER #${renderCount.current}] ${componentName}`, 'color: #0284c7;');
    }
    renderCount.current += 1;
  });
}

```

---

### 3. Tracking Render Performance (`React.Profiler`)

React includes a built-in `<Profiler>` API to programmatically track render times and layout shifts without external tools:

```jsx
import React, { Profiler } from 'react';

function onRenderCallback(
  id, // the "id" prop of the Profiler tree
  phase, // "mount" or "update"
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime // when React committed this update
) {
  console.log(`[Profiler] ${id} (${phase}): ${actualDuration.toFixed(2)}ms`);
}

export default function App() {
  return (
    <Profiler id="VehicleDashboard" onRender={onRenderCallback}>
      <VehicleDashboard />
    </Profiler>
  );
}

```

---

### 4. Tracking User Analytics (Impression / Visibility)

To track when a user actually views a component on screen (e.g., in a scrollable list or dashboard):

```jsx
import { useEffect, useRef } from 'react';

export function useImpressionTracker(componentId, onImpression) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onImpression(componentId);
          observer.disconnect(); // Track only once per mount
        }
      },
      { threshold: 0.5 } // 50% visible
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [componentId, onImpression]);

  return ref;
}

```

**Usage:**

```jsx
export function BannerAd() {
  const ref = useImpressionTracker('promo_banner_1', (id) => {
    console.log(`Impression logged for: ${id}`);
  });

  return <div ref={ref}>Promotional Banner</div>;
}

```

---

### 5. Browser DevTools for Component Tracking

* **React Developer Tools (Browser Extension):**
* Check **"Highlight updates when components render"** in the extension settings to visually see green/yellow borders flash when components re-render.
* Use the **Profiler** tab to record interactions and see the flamegraph showing why a component rendered ("Parent rendered", "Hooks changed", etc.).
