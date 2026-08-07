The **`window.screen`** object (a child property of the global `window` object) provides metrics and details about the user's physical display monitor rather than the browser window itself.

It is particularly useful for optimizing multi-monitor setups, placing popup windows relative to screen dimensions, or determining high-DPI scaling.

---

## 1. Key `window.screen` Properties

```javascript
// Physical monitor dimensions (includes OS taskbars/dock)
const screenWidth = window.screen.width;
const screenHeight = window.screen.height;

// Available screen real estate (EXCLUDES OS taskbars/dock)
const availWidth = window.screen.availWidth;
const availHeight = window.screen.availHeight;

// Color and pixel depth
const colorDepth = window.screen.colorDepth;   // e.g., 24 or 30 bits
const pixelDepth = window.screen.pixelDepth;   // Same as colorDepth in modern browsers

// Screen Orientation
const orientationType = window.screen.orientation.type; // e.g., "landscape-primary"

```

---

## 2. Screen Dimensions vs. Viewport Dimensions

It is important to distinguish between **Physical Screen**, **Available Screen**, and **Browser Viewport**:

```text
┌─────────────────────────────────────────────────────────────┐  ◄── Physical Screen (screen.width x screen.height)
│ [OS Menu Bar / Header Taskbar]                              │
├─────────────────────────────────────────────────────────────┤  ◄── Available Screen Top (screen.availHeight starts)
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Browser Window Chrome (Tabs, Address Bar, Bookmarks)   │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │  Browser Viewport                                     │  │
│  │  (window.innerWidth x window.innerHeight)             │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│ [OS Taskbar / Dock at Bottom]                               │  ◄── Available Screen Bottom (screen.availHeight ends)
└─────────────────────────────────────────────────────────────┘

```

| Metric               | Property                                   | Description                                                                    |
| -------------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| **Physical Screen**  | `screen.width` / `screen.height`           | The total physical pixel resolution of the monitor (e.g., $1920 \times 1080$). |
| **Available Screen** | `screen.availWidth` / `screen.availHeight` | Monitor space minus system taskbars, docks, or toolbars.                       |
| **Browser Viewport** | `window.innerWidth` / `window.innerHeight` | Visible HTML layout space inside the current browser window.                   |

---

## 3. Practical Use Cases

### A. Centering a Pop-up Window on the Screen

When opening pop-ups, use `screen.availWidth` and `screen.availHeight` to position the new window in the center of the user's monitor:

```javascript
function openCenteredPopup(url, title, w, h) {
  // Calculate center relative to available monitor space
  const left = (window.screen.availWidth - w) / 2;
  const top = (window.screen.availHeight - h) / 2;

  const features = `width=${w},height=${h},top=${top},left=${left},resizable=yes,scrollbars=yes`;
  
  return window.open(url, title, features);
}

// Usage: Open a 600x400 popup centered on the screen
// openCenteredPopup("https://example.com", "Auth", 600, 400);

```

---

### B. Detecting Screen Orientation and Changes

Modern browsers provide the **`window.screen.orientation`** API to query or listen for changes when a mobile device or tablet is rotated:

```javascript
// Read current orientation type
console.log("Current Orientation:", window.screen.orientation.type); 
// Output: "landscape-primary", "portrait-primary", etc.

// Listen for screen orientation angle changes
window.screen.orientation.addEventListener("change", () => {
  console.log("Orientation rotated to:", window.screen.orientation.type);
  console.log("Current Angle:", window.screen.orientation.angle);
});

```

---

### C. Multi-Screen Details API (Modern Web API)

For advanced web applications (like video editors or multi-monitor dashboards), modern browsers support `window.getScreenDetails()` to query multiple connected monitors:

```javascript
async function inspectMonitors() {
  if ("getScreenDetails" in window) {
    try {
      const screenDetails = await window.getScreenDetails();
      console.log(`Connected monitors: ${screenDetails.screens.length}`);
      
      screenDetails.screens.forEach((scr, idx) => {
        console.log(`Monitor ${idx + 1}: ${scr.label} (${scr.width}x${scr.height})`);
      });
    } catch (err) {
      console.log("Screen details permission denied or unsupported.");
    }
  }
}

```
