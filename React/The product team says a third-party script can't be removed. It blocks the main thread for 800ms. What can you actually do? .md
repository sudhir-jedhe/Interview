When a third-party script cannot be removed, you have to transition from treating it as a standard dependency to isolating, deferring, or offloading it.

Here are the practical strategies to neutralize an 800ms main-thread block, ordered from most isolated to least invasive.

---

### 1. Offload Execution to a Web Worker (Partytown)

If the script is an analytics, tag manager, or tracking tool (e.g., Google Tag Manager, Segment, Facebook Pixel, Mixpanel), it can run entirely inside a background Web Worker using **Partytown**.

* **How it works:** Partytown moves third-party scripts into a Web Worker and proxies DOM/BOM requests (`window`, `document`, `navigator`) synchronously over `Atomics` and `SharedArrayBuffer` (or synchronous XMLHttpRequest fallback).
* **The Result:** The **800ms execution cost runs on a background thread**, reducing main-thread blocking time to near zero.

```html
<!-- 1. Configure Partytown in HTML head -->
<script>
  partytown = {
    forward: ['dataLayer.push', 'fbq', 'mixpanel.track'],
    lib: '/~partytown/',
  };
</script>
<script src="/~partytown/partytown.js"></script>

<!-- 2. Mark the 3rd-party script with type="text/partytown" -->
<script type="text/partytown" src="https://cdn.third-party.com/heavy-tracker.js"></script>

```

---

### 2. Move to Server-Side Tagging (Edge / Backend Proxy)

If the script’s only purpose is collecting metrics and dispatching network requests:

* **Eliminate the client SDK entirely:** Instead of loading an 800ms JavaScript bundle, capture user actions in your first-party application code.
* **Relay via Edge/BFF:** Send a lightweight event payload to your own API (`navigator.sendBeacon('/api/analytics', payload)`), and have your backend or Edge Worker (Cloudflare / Fastly / AWS Lambda@Edge) invoke the third-party API via REST/Server-Side GTM.

---

### 3. Defer Execution to Idle / Post-Interaction

If the script must run on the main thread (e.g., it manipulates DOM elements or injects interactive widgets like a support chat bubble), ensure it **never executes during the critical load path (FCP, LCP, TBT)**.

#### A. Defer until User Interaction (Facade Pattern)

For chat widgets (Intercom, Zendesk, Drift), render a fake lightweight button (HTML/CSS only). Only load the real 800ms bundle when the user hovers, focuses, or clicks:

```tsx
export function SupportChatFacade() {
  const [loaded, setLoaded] = useState(false);

  const loadChatScript = () => {
    if (loaded) return;
    setLoaded(true);

    const script = document.createElement('script');
    script.src = 'https://widget.thirdparty.com/chat.js';
    script.async = true;
    document.body.appendChild(script);
  };

  return (
    <button
      onPointerEnter={loadChatScript}
      onFocus={loadChatScript}
      onClick={loadChatScript}
      aria-label="Open support chat"
      className="chat-button-facade"
    >
      💬 Chat with us
    </button>
  );
}

```

#### B. Defer with `requestIdleCallback` + `requestAnimationFrame`

If it must run automatically without explicit interaction, delay initialization until the main thread is completely idle:

```javascript
window.addEventListener('load', () => {
  const loadThirdParty = () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.thirdparty.com/script.js';
    script.async = true;
    document.body.appendChild(script);
  };

  // Run only when the browser has idle CPU budget after page load
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => loadThirdParty(), { timeout: 3000 });
  } else {
    setTimeout(loadThirdParty, 2500);
  }
});

```

---

### 4. Sandboxed Cross-Origin `<iframe>` Isolation

If the script requires UI presentation (e.g., an embedded survey, feedback widget, or dynamic banner), isolate its JavaScript runtime:

1. Host a minimal static HTML page on a separate domain/subdomain (`[https://widgets.yourdomain.com/survey.html](https://widgets.yourdomain.com/survey.html)`).
2. Load the heavy third-party script inside that HTML file.
3. Embed it into your main application using an `<iframe>`:

```html
<iframe
  src="https://widgets.yourdomain.com/survey.html"
  title="Customer Survey"
  loading="lazy"
  sandbox="allow-scripts allow-forms allow-same-origin"
  style="border: none; width: 100%; height: 300px;"
></iframe>

```

* **The Benefit:** The script's 800ms parsing and execution are sandboxed inside the iframe's isolated browsing context.

---

### 5. Establish Performance Budgets & Contractual Pushback

If none of the technical mitigations are permitted (e.g., an A/B testing tool or security script like anti-fraud/bot detection that *must* run synchronously before the page renders):

* **Quantify the Business Cost:** Run a split test (or use Chrome User Experience Report data) showing the direct correlation between the 800ms TBT spike, drop in Lighthouse/Core Web Vitals scores, and the corresponding conversion rate drop.
* **Audit Bundles with Vendor:** Many enterprise vendors have "lite" or modular SDKs (e.g., Datadog Logs without Session Replay, or GTM server containers).
* **Self-Host & Tree-Shake:** Download the vendor source into your build pipeline, strip unused polyfills and legacy compatibility layers, and host it on your own CDN with HTTP/3 and Brotli compression.
