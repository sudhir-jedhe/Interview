The **Web Geolocation API** allows web applications to request the user's geographic location (latitude and longitude). Because location data is sensitive, browsers enforce explicit user permission before sharing coordinates, and the API works exclusively over secure origins (`https://`).

---

## 1. Checking API Availability

Access the API via **`navigator.geolocation`**. Always feature-detect before making requests:

```javascript
if ("geolocation" in navigator) {
  console.log("Geolocation API is available!");
} else {
  console.log("Geolocation is NOT supported by this browser.");
}

```

---

## 2. Core Methods & Code Examples

### A. Get Current Position (`getCurrentPosition`)

Fetches the user's current coordinates a single time.

```javascript
const options = {
  enableHighAccuracy: true, // Uses GPS hardware if available
  timeout: 5000,            // Time limit to obtain location (ms)
  maximumAge: 0             // Disable cached position results
};

function successCallback(position) {
  const coords = position.coords;
  
  console.log(`Latitude: ${coords.latitude}`);
  console.log(`Longitude: ${coords.longitude}`);
  console.log(`Accuracy: within ${coords.accuracy} meters`);
  
  // Optional hardware metrics (may be null depending on device/sensor support):
  console.log(`Altitude: ${coords.altitude}`);
  console.log(`Heading: ${coords.heading}`);
  console.log(`Speed: ${coords.speed}`);
}

function errorCallback(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.error("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.error("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.error("The request to get user location timed out.");
      break;
  }
}

// Trigger location request
navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);

```

---

### B. Track Real-Time Movement (`watchPosition` & `clearWatch`)

Monitors the device location continuously and fires a callback whenever the coordinates update (e.g., turn-by-turn navigation or fitness apps).

```javascript
let watchId;

function startTracking() {
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      console.log("New Position:", position.coords.latitude, position.coords.longitude);
    },
    (error) => {
      console.error("Tracking Error:", error.message);
    },
    { enableHighAccuracy: true }
  );
}

function stopTracking() {
  if (watchId !== undefined) {
    // Unsubscribe from location updates
    navigator.geolocation.clearWatch(watchId);
    console.log("Location tracking stopped.");
  }
}

```

---

## 3. Position Object Structure

When a location lookup succeeds, the API passes a `GeolocationPosition` object:

```javascript
GeolocationPosition {
  coords: GeolocationCoordinates {
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 15,          // In meters
    altitude: null,        // In meters above sea level
    altitudeAccuracy: null,
    heading: null,         // Direction in degrees (0-360)
    speed: null            // Speed in meters/second
  },
  timestamp: 1775574561000 // Epoch milliseconds
}

```

---

## 4. Key Security & Best Practices

1. **HTTPS Required:** Modern browsers block the Geolocation API on insecure `http://` origins (except for `localhost` during development).
2. **Handle Rejections Gracefully:** Users often click "Block" on location popups. Always provide manual input fallbacks (e.g., a zip code or city search box).
3. **Permissions API Check:** You can pre-check permission status without immediately triggering a browser prompt:

```javascript
async function checkLocationPermission() {
  const status = await navigator.permissions.query({ name: "geolocation" });
  console.log("Permission state:", status.state); // "granted", "prompt", or "denied"

  status.onchange = () => {
    console.log("Permission state changed to:", status.state);
  };
}

```
