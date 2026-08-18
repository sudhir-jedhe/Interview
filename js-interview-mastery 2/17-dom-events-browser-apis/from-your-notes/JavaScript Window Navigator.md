The **`window.navigator`** object contains information about the visitor's browser, operating system, network connection, device hardware, and capabilities.

---

## 1. Common `navigator` Properties

| Property                            | Type      | Description                                            | Example Output                                         |
| ----------------------------------- | --------- | ------------------------------------------------------ | ------------------------------------------------------ |
| **`navigator.userAgent`**           | `string`  | The user-agent header string sent to the server.       | `"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..."` |
| **`navigator.language`**            | `string`  | The primary language of the browser interface.         | `"en-US"`                                              |
| **`navigator.languages`**           | `Array`   | Array of preferred languages configured by user.       | `["en-US", "en", "es"]`                                |
| **`navigator.onLine`**              | `boolean` | `true` if the browser is connected to the network.     | `true`                                                 |
| **`navigator.hardwareConcurrency`** | `number`  | Total number of logical CPU core processors available. | `8`                                                    |
| **`navigator.maxTouchPoints`**      | `number`  | Maximum simultaneous touch points supported by screen. | `0` (desktop) or `5` (mobile)                          |
| **`navigator.cookieEnabled`**       | `boolean` | `true` if browser cookies are enabled.                 | `true`                                                 |
| **`navigator.pdfViewerEnabled`**    | `boolean` | `true` if inline PDF rendering is supported.           | `true`                                                 |

---

## 2. Useful `navigator` Web APIs with Code Examples

### A. Clipboard API (`navigator.clipboard`)

Allows reading and writing text or data to the system clipboard asynchronously:

```javascript
// Copy text to clipboard
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

// Read text from clipboard
async function pasteText() {
  const text = await navigator.clipboard.readText();
  console.log("Pasted text:", text);
}

```

---

### B. Geolocation API (`navigator.geolocation`)

Retrieves the physical location coordinates of the user's device (requires user permission):

```javascript
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    },
    (error) => {
      console.error("Location access denied or unavailable:", error.message);
    }
  );
}

```

---

### C. Network Information API (`navigator.connection`)

Checks the user's connection type and network speed:

```javascript
if ("connection" in navigator) {
  const conn = navigator.connection;
  console.log("Connection Type:", conn.effectiveType); // e.g., '4g', '3g'
  console.log("Downlink Speed:", conn.downlink, "Mbps");

  // Listen for online/offline connectivity changes
  window.addEventListener("offline", () => console.log("User went offline!"));
  window.addEventListener("online", () => console.log("User reconnected!"));
}

```

---

### D. User-Agent Client Hints (`navigator.userAgentData`)

The modern, structured privacy-preserving alternative to parsing raw `navigator.userAgent` strings:

```javascript
if (navigator.userAgentData) {
  // Check platform and mobile status instantly
  console.log("Mobile device?", navigator.userAgentData.mobile);
  console.log("Platform:", navigator.userAgentData.platform);

  // Request high-entropy details (brand version, OS architecture)
  navigator.userAgentData.getHighEntropyValues(["architecture", "model"])
    .then(ua => console.log(ua));
}

```

---

### E. Web Share API (`navigator.share`)

Triggers the native operating system share dialog on mobile or supported desktop browsers:

```javascript
async function shareContent() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "JavaScript Navigator API",
        text: "Check out this guide on window.navigator!",
        url: window.location.href,
      });
      console.log("Content shared successfully");
    } catch (err) {
      console.log("Share canceled or failed", err);
    }
  }
}

```

---

## 3. Legacy/Deprecated Properties to Avoid

* **`navigator.appName` / `navigator.appCodeName`:** Legacy values returning `"Netscape"` or `"Mozilla"` for historical compatibility across all browsers.
* **`navigator.appVersion`:** Unreliable string format replaced by `navigator.userAgent` or `navigator.userAgentData`.
* **`navigator.platform`:** Superseded by `navigator.userAgentData.platform`.
