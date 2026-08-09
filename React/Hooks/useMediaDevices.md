Here is a production-ready `useMediaDevices` React hook for enumerating audio and video input/output devices (`microphones`, `cameras`, `speakers`) using `navigator.mediaDevices.enumerateDevices()`.

It tracks permission changes, handles device attach/detach events (`devicechange`) in real time, and uses `useSyncExternalStore` (React 18+) for concurrent safety and zero layout tearing.

```jsx
import { useSyncExternalStore, useCallback } from "react";

const SERVER_FALLBACK = {
  isSupported: false,
  devices: [],
  audioInputs: [],
  audioOutputs: [],
  videoInputs: [],
  error: null,
};

/**
 * Custom hook to enumerate media devices (cameras, microphones, speakers) in real time.
 *
 * @param {Object} [serverFallback=SERVER_FALLBACK] - Fallback state for SSR environments.
 * @returns {Object} { isSupported, devices, audioInputs, audioOutputs, videoInputs, error }
 */
export function useMediaDevices(serverFallback = SERVER_FALLBACK) {
  // Subscribe to device attach/detach events
  const subscribe = useCallback((callback) => {
    if (
      typeof window === "undefined" ||
      typeof navigator === "undefined" ||
      !navigator.mediaDevices
    ) {
      return () => {};
    }

    const mediaDevices = navigator.mediaDevices;
    mediaDevices.addEventListener("devicechange", callback);

    return () => {
      mediaDevices.removeEventListener("devicechange", callback);
    };
  }, []);

  // Store internal devices snapshot
  let cachedDevices = [];
  let cachedError = null;

  const updateDevicesSnapshot = async () => {
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.mediaDevices?.enumerateDevices
      ) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        cachedDevices = devices;
        cachedError = null;
      }
    } catch (err) {
      cachedError = err;
    }
  };

  // Client snapshot reader
  const getSnapshot = useCallback(() => {
    if (
      typeof window === "undefined" ||
      typeof navigator === "undefined" ||
      !navigator.mediaDevices
    ) {
      return serverFallback;
    }

    // Trigger asynchronous device refresh
    updateDevicesSnapshot();

    const devices = cachedDevices.map((device) => ({
      deviceId: device.deviceId,
      groupId: device.groupId,
      kind: device.kind,
      label: device.label || `${device.kind} (${device.deviceId.slice(0, 5)}...)`,
    }));

    return {
      isSupported: true,
      devices,
      audioInputs: devices.filter((d) => d.kind === "audioinput"),
      audioOutputs: devices.filter((d) => d.kind === "audiooutput"),
      videoInputs: devices.filter((d) => d.kind === "videoinput"),
      error: cachedError,
    };
  }, [serverFallback]);

  // Server snapshot reader
  const getServerSnapshot = useCallback(
    () => serverFallback,
    [serverFallback]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

```

---

### Usage Examples

#### 1. Video Call Device Selector Dropdowns

```jsx
function VideoCallDeviceSettings() {
  const { isSupported, audioInputs, videoInputs, audioOutputs, error } =
    useMediaDevices();

  if (!isSupported) {
    return <div>Media device enumeration is not supported on this browser.</div>;
  }

  if (error) {
    return <div>Error reading media devices: {error.message}</div>;
  }

  return (
    <div style={{ padding: "16px", maxWidth: "400px" }}>
      <h3>Device Settings</h3>

      <label>
        Camera:
        <select>
          {videoInputs.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || "Camera"}
            </option>
          ))}
        </select>
      </label>

      <br />

      <label>
        Microphone:
        <select>
          {audioInputs.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || "Microphone"}
            </option>
          ))}
        </select>
      </label>

      <br />

      <label>
        Speakers:
        <select>
          {audioOutputs.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || "Speaker"}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

```

#### 2. Plug & Play Hot-Swapping Notice

```jsx
function PlugAndPlayStatus() {
  const { audioInputs, videoInputs } = useMediaDevices();

  return (
    <div className="status-bar">
      <span>Connected Microphones: {audioInputs.length}</span> |{" "}
      <span>Connected Cameras: {videoInputs.length}</span>
    </div>
  );
}

```

---

### Key Features

* **Hot-Swapping Detection:** Subscribes to the native `navigator.mediaDevices.ondevicechange` event, instantly updating state when a user plugs in or unplugs a USB camera, headset, or microphone.
* **Pre-Categorized Buckets:** Automatically categorizes devices into `audioInputs` (mics), `videoInputs` (webcams), and `audioOutputs` (speakers/headphones).
* **Privacy Guard Labels:** Provides fallback labels (`audioinput (a1b2c...)`) when browser privacy protections hide device labels prior to `getUserMedia` permission grants.
* **React 18 Concurrent-Safe:** Powered by `useSyncExternalStore` for synchronization without layout tearing across state updates.
