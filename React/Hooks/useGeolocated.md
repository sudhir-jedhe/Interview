Here is a production-ready `useGeolocated` React hook for tracking user location via the native `navigator.geolocation` API.

It supports both one-time position requests and continuous position watching, custom positioning options (`enableHighAccuracy`, `timeout`, `maximumAge`), explicit state management, and permission handling.

```jsx
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to obtain and track user location using the Navigator Geolocation API.
 *
 * @param {Object} [options] - Configuration options.
 * @param {boolean} [options.isOptimistic=false] - If true, immediately fetches location on mount.
 * @param {boolean} [options.watchPosition=false] - If true, continuously tracks position updates instead of fetching once.
 * @param {PositionOptions} [options.userDecisionTimeout=null] - Maximum time in ms to wait for user to grant permission.
 * @param {boolean} [options.enableHighAccuracy=false] - Provides high accuracy (GPS) location if supported.
 * @param {number} [options.timeout=Infinity] - Maximum time allowed to return a position (ms).
 * @param {number} [options.maximumAge=0] - Maximum age in ms of a cached position that is acceptable.
 */
export function useGeolocated(options = {}) {
  const {
    isOptimistic = false,
    watchPosition = false,
    userDecisionTimeout = null,
    enableHighAccuracy = false,
    timeout = Infinity,
    maximumAge = 0,
  } = options;

  const [state, setState] = useState({
    isGeolocationAvailable: typeof navigator !== "undefined" && "geolocation" in navigator,
    isGeolocationEnabled: true, // Will flip to false if user denies permission
    coords: null,
    timestamp: null,
    error: null,
    isLoading: false,
  });

  const watchIdRef = useRef(null);
  const userDecisionTimeoutIdRef = useRef(null);

  // Store options in ref to avoid re-triggering watch listeners unnecessarily
  const optionsRef = useRef({ enableHighAccuracy, timeout, maximumAge });
  useEffect(() => {
    optionsRef.current = { enableHighAccuracy, timeout, maximumAge };
  });

  // Handle successful position retrieval
  const handleSuccess = useCallback((position) => {
    if (userDecisionTimeoutIdRef.current) {
      clearTimeout(userDecisionTimeoutIdRef.current);
    }

    setState({
      isGeolocationAvailable: true,
      isGeolocationEnabled: true,
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
      },
      timestamp: position.timestamp,
      error: null,
      isLoading: false,
    });
  }, []);

  // Handle geolocation errors (denied permission, timeout, unavailable)
  const handleError = useCallback((error) => {
    if (userDecisionTimeoutIdRef.current) {
      clearTimeout(userDecisionTimeoutIdRef.current);
    }

    setState((prev) => ({
      ...prev,
      isGeolocationEnabled: error.code !== error.PERMISSION_DENIED,
      error,
      isLoading: false,
    }));
  }, []);

  // Trigger position fetch / watch
  const getPosition = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        isGeolocationAvailable: false,
        isLoading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Set decision timeout if provided
    if (userDecisionTimeout) {
      userDecisionTimeoutIdRef.current = setTimeout(() => {
        handleError({
          code: 3,
          message: "User decision timeout expired",
        });
      }, userDecisionTimeout);
    }

    const geoOptions = optionsRef.current;

    if (watchPosition) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        geoOptions
      );
    } else {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        geoOptions
      );
    }
  }, [watchPosition, userDecisionTimeout, handleSuccess, handleError]);

  // Stop watching position
  const cancelWatch = useCallback(() => {
    if (
      typeof navigator !== "undefined" &&
      navigator.geolocation &&
      watchIdRef.current !== null
    ) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isOptimistic) {
      getPosition();
    }

    return () => {
      cancelWatch();
      if (userDecisionTimeoutIdRef.current) {
        clearTimeout(userDecisionTimeoutIdRef.current);
      }
    };
  }, [isOptimistic, getPosition, cancelWatch]);

  return {
    ...state,
    getPosition,
    cancelWatch,
  };
}

```

---

### Usage Examples

#### 1. One-Time Location Request (User Triggered)

```jsx
function StoreLocator() {
  const { coords, isLoading, isGeolocationEnabled, error, getPosition } =
    useGeolocated();

  return (
    <div>
      <button onClick={getPosition} disabled={isLoading}>
        {isLoading ? "Locating..." : "Find Stores Near Me"}
      </button>

      {!isGeolocationEnabled && (
        <p style={{ color: "red" }}>Location permission denied in browser.</p>
      )}

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {coords && (
        <ul>
          <li>Latitude: {coords.latitude}</li>
          <li>Longitude: {coords.longitude}</li>
          <li>Accuracy: ±{Math.round(coords.accuracy)} meters</li>
        </ul>
      )}
    </div>
  );
}

```

#### 2. Live Position Tracking (`watchPosition`)

```jsx
function LiveMapTracker() {
  const { coords, isGeolocationAvailable } = useGeolocated({
    isOptimistic: true, // Start fetching immediately
    watchPosition: true, // Continuously track updates as user moves
    enableHighAccuracy: true, // Request GPS precision
  });

  if (!isGeolocationAvailable) {
    return <div>Geolocation is not supported by your browser.</div>;
  }

  return (
    <div>
      <h3>Live Tracking Coordinates</h3>
      {coords ? (
        <p>
          Lat: {coords.latitude.toFixed(5)}, Lng: {coords.longitude.toFixed(5)}{" "}
          | Speed: {coords.speed ?? 0} m/s
        </p>
      ) : (
        <p>Awaiting GPS lock...</p>
      )}
    </div>
  );
}

```

---

### Key Features

* **Continuous Tracking & One-Time Requests:** Supports both single position resolution (`getCurrentPosition`) and real-time movement monitoring (`watchPosition`).
* **Permission & Availability Guards:** Exposes clear flags (`isGeolocationAvailable`, `isGeolocationEnabled`) to gracefully guide users when browser support is missing or permissions are blocked.
* **Full Coordinate Payload:** Extracts standard properties safely (`latitude`, `longitude`, `altitude`, `accuracy`, `speed`, `heading`).
* **User Decision Timeout:** Accepts a `userDecisionTimeout` option to handle scenarios where the user ignores or delays accepting the browser permission prompt.
* **Leak-Free Teardown:** Automatically cancels `watchPosition` listeners and pending decision timers when the component unmounts.
