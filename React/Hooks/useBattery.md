Here is a production-ready `useBattery` React hook using the Battery Status API (`navigator.getBattery`).

It tracks battery level, charging state, charging time, and discharging time in real time, handles vendor event listeners cleanly, and includes SSR guards and browser compatibility detection.

```jsx
import { useState, useEffect } from "react";

/**
 * Custom hook to monitor battery level and status using the Battery Status API.
 *
 * @returns {Object} { isSupported, isLoading, level, charging, chargingTime, dischargingTime }
 */
export function useBattery() {
  const [batteryState, setBatteryState] = useState({
    isSupported: true,
    isLoading: true,
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null,
  });

  useEffect(() => {
    // Guard for SSR or unsupported browsers
    if (
      typeof window === "undefined" ||
      typeof navigator === "undefined" ||
      typeof navigator.getBattery !== "function"
    ) {
      setBatteryState({
        isSupported: false,
        isLoading: false,
        level: null,
        charging: null,
        chargingTime: null,
        dischargingTime: null,
      });
      return;
    }

    let batteryInstance = null;

    const updateBatteryInfo = (battery) => {
      setBatteryState({
        isSupported: true,
        isLoading: false,
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      });
    };

    const handleChange = () => {
      if (batteryInstance) {
        updateBatteryInfo(batteryInstance);
      }
    };

    navigator.getBattery().then((battery) => {
      batteryInstance = battery;
      updateBatteryInfo(battery);

      // Attach event listeners for real-time updates
      battery.addEventListener("chargingchange", handleChange);
      battery.addEventListener("levelchange", handleChange);
      battery.addEventListener("chargingtimechange", handleChange);
      battery.addEventListener("dischargingtimechange", handleChange);
    }).catch((error) => {
      console.warn("Battery Status API failed to resolve:", error);
      setBatteryState((prev) => ({ ...prev, isSupported: false, isLoading: false }));
    });

    return () => {
      if (batteryInstance) {
        batteryInstance.removeEventListener("chargingchange", handleChange);
        batteryInstance.removeEventListener("levelchange", handleChange);
        batteryInstance.removeEventListener("chargingtimechange", handleChange);
        batteryInstance.removeEventListener("dischargingtimechange", handleChange);
      }
    };
  }, []);

  return batteryState;
}

```

---

### Usage Examples

#### 1. Power-Saving Mode Indicator

```jsx
function BatteryStatusWidget() {
  const { isSupported, isLoading, level, charging } = useBattery();

  if (!isSupported) {
    return <div>Battery API is not supported on this browser/device.</div>;
  }

  if (isLoading) {
    return <div>Reading battery status...</div>;
  }

  const batteryPercentage = Math.round((level ?? 0) * 100);
  const isLowBattery = batteryPercentage <= 20 && !charging;

  return (
    <div style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h4>Device Power Status</h4>
      <p>
        Level: <strong>{batteryPercentage}%</strong> {charging ? "⚡ (Charging)" : "🔋"}
      </p>

      {isLowBattery && (
        <div style={{ color: "orange", fontWeight: "bold" }}>
          ⚠️ Low battery detected. Auto-saving background tasks enabled.
        </div>
      )}
    </div>
  );
}

```

#### 2. Detailed Battery Telemetry Card

```jsx
function BatteryTelemetry() {
  const { level, charging, chargingTime, dischargingTime } = useBattery();

  const formatTime = (seconds) => {
    if (seconds === Infinity || !seconds) return "Calculating / N/A";
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    return hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
  };

  return (
    <ul>
      <li>Battery Percentage: {level !== null ? `${Math.round(level * 100)}%` : "N/A"}</li>
      <li>Charging Status: {charging ? "Plugged in" : "On Battery"}</li>
      <li>Time to Full Charge: {charging ? formatTime(chargingTime) : "N/A"}</li>
      <li>Remaining Battery Life: {!charging ? formatTime(dischargingTime) : "N/A"}</li>
    </ul>
  );
}

```

---

### Key Features

* **Real-time Event Subscriptions:** Subscribes to `chargingchange`, `levelchange`, `chargingtimechange`, and `dischargingtimechange` events on the `BatteryManager` instance to trigger instantaneous React state updates.
* **Feature Detection & Fallbacks:** Gracefully identifies browsers without `navigator.getBattery` support (such as iOS Safari or desktop Firefox) and sets `isSupported: false` without throwing errors.
* **SSR Safe:** Guards against `window` and `navigator` availability during server-side rendering (Next.js, Remix, etc.).
* **Clean Event Teardown:** Unbinds listeners from the resolved `batteryInstance` when the host component unmounts.
