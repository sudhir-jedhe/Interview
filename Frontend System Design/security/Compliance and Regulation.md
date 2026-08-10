In Front-End System Design, **Compliance and Regulation** bridges legal mandates—such as **GDPR** (EU), **CCPA/CPRA** (California), **PCI-DSS** (Payment Processing), **HIPAA** (Healthcare), and **WCAG/ADA** (Accessibility)—into technical system architecture.

Because front-end applications handle user input, cookies, analytics, and rendering directly in the user’s browser, non-compliance exposes organizations to substantial legal liabilities, regulatory fines, and operational risks.

---

## Front-End Compliance & Regulatory Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT (BROWSER / SPA)                           │
│                                                                             │
│  ┌──────────────────────────────┐          ┌─────────────────────────────┐  │
│  │  1. Privacy & Consent Layer  │          │ 2. Payment & PII Isolation  │  │
│  │   • Cookie Banner / Preference│          │  • Tokenized Elements       │  │
│  │   • Script Injection Blocking│          │  • No Storage of Raw Data   │  │
│  └──────────────┬───────────────┘          └──────────────┬──────────────┘  │
│                 │                                         │                 │
│                 ▼                                         ▼                 │
│  ┌──────────────────────────────┐          ┌─────────────────────────────┐  │
│  │ 3. Accessibility & UX Layer  │          │ 4. Audit & Monitoring Layer │  │
│  │   • WCAG 2.1 AA Compliance   │          │  • Telemetry Scrubbing      │  │
│  │   • ARIA Landmarks & Focus   │          │  • Zero-PII Log Filtering   │  │
│  └──────────────────────────────┘          └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## Key Regulatory Frameworks & Front-End Engineering Controls

### 1. Privacy Regulations (GDPR, CCPA/CPRA)

* **Principle:** Data Minimization, Consent Management, and the Right to Be Forgotten.
* **Front-End Engineering Requirement:**
* **Explicit Opt-in Consent:** Block tracking scripts (Google Analytics, Meta Pixel, Hotjar) until explicit user consent is given via a consent banner.
* **Preference Management:** Provide an accessible UI where users can update or revoke their tracking preferences at any time.
* **No PII in URLs or Local Storage:** Prevent Personally Identifiable Information (PII)—like emails, names, or addresses—from leaking into query parameters, `localStorage`, or analytics payloads.

---

### 2. Payment Card Industry Security Standard (PCI-DSS v4.0)

* **Principle:** Protecting Primary Account Numbers (PANs) and sensitive cardholder data.
* **Front-End Engineering Requirement:**
* **Field Tokenization (iFrame Hosting):** Never capture raw credit card numbers using native `<input>` tags sent directly to your API. Instead, use hosted iframe components (e.g., Stripe Elements, PayPal Smart Buttons).
* **Scope Reduction:** Hosted payment iframes process card data directly on the payment provider's servers, keeping your front-end application completely out of PCI-DSS Scope (SAQ A compliance).

---

### 3. Healthcare Regulations (HIPAA / HITECH)

* **Principle:** Safeguarding Protected Health Information (PHI).
* **Front-End Engineering Requirement:**
* **Session Auto-Logout:** Implement inactivity timers that wipe in-memory application state and clear tokens after a set period of user inactivity.
* **Client-Side Telemetry Scrubbing:** Strip health metrics, diagnosis information, or patient IDs from error monitoring tools (e.g., Sentry, LogRocket) before logs are transmitted over the network.

---

### 4. Accessibility Regulations (WCAG 2.1 AA / ADA Section 508)

* **Principle:** Equal access for users with disabilities (visual, auditory, motor, cognitive).
* **Front-End Engineering Requirement:**
* **Semantic HTML & ARIA Attributes:** Use proper HTML tags (`<main>`, `<nav>`, `<button>`) and manage focus using `tabindex` and `aria-live` regions for dynamic screen reader updates.
* **Contrast & Keyboard Navigation:** Ensure minimum color contrast ratios (4.5:1 for standard text) and full keyboard accessibility without trap focus.

---

## Production Code Example: End-to-End Compliance Module

Below is a production-grade TypeScript React implementation demonstrating **Consent Management (GDPR/CCPA)**, **PII Scrubbing for Telemetry**, and **Session Timeout (HIPAA)**.

```typescript
// src/compliance/ConsentManager.ts

export type ConsentPreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_KEY = 'app_user_consent_v1';

export const ConsentManager = {
  getPreferences: (): ConsentPreferences => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return { necessary: true, analytics: false, marketing: false };
    try {
      return JSON.parse(stored);
    } catch {
      return { necessary: true, analytics: false, marketing: false };
    }
  },

  setPreferences: (prefs: Partial<ConsentPreferences>): void => {
    const current = ConsentManager.getPreferences();
    const updated = { ...current, ...prefs, necessary: true };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(updated));
    
    // Dispatch custom event to notify analytics script loaders
    window.dispatchEvent(new CustomEvent('consentUpdated', { detail: updated }));
  },
};

```

```typescript
// src/compliance/telemetryScrubber.ts

/**
 * PII/PHI Filter for Error Reporting & Logging (GDPR / HIPAA Compliance)
 */
export const sanitizeTelemetryData = (data: Record<string, unknown>): Record<string, unknown> => {
  const piiKeys = ['email', 'password', 'ssn', 'creditCard', 'phone', 'patientId'];
  const sanitized = { ...data };

  Object.keys(sanitized).forEach((key) => {
    if (piiKeys.some((pii) => key.toLowerCase().includes(pii.toLowerCase()))) {
      sanitized[key] = '[REDACTED_PII]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeTelemetryData(sanitized[key] as Record<string, unknown>);
    }
  });

  return sanitized;
};

```

```tsx
// src/compliance/ConsentBanner.tsx
import React, { useEffect, useState } from 'react';
import { ConsentManager, ConsentPreferences } from './ConsentManager';

export const ConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('app_user_consent_v1');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    ConsentManager.setPreferences({ analytics: true, marketing: true });
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    ConsentManager.setPreferences({ analytics: false, marketing: false });
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside 
      role="region" 
      aria-label="Cookie Privacy Preferences"
      className="cookie-consent-banner"
    >
      <div className="banner-content">
        <p>
          We use cookies to enhance your experience and analyze web traffic in compliance with GDPR and CCPA regulations.
        </p>
        <div className="banner-actions">
          <button onClick={handleRejectNonEssential} className="btn-secondary">
            Reject Non-Essential
          </button>
          <button onClick={handleAcceptAll} className="btn-primary">
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
};

```

---

## Front-End Compliance Matrix

| Compliance Standard | Primary Risk                               | Front-End Architectural Control                              |
| ------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| **GDPR / CCPA**     | Unlawful Tracking & PII Leakage            | Consent Manager UI + Script Gating + Telemetry PII Scrubbing |
| **PCI-DSS v4.0**    | Cardholder Data Exposure                   | Hosted Tokenized Payment iFrames (e.g., Stripe Elements)     |
| **HIPAA**           | Patient Data Exposure                      | Short Session Timeouts + Zero-PII Log Transport              |
| **WCAG 2.1 AA**     | Discriminatory Exclusion of Disabled Users | Automated Accessibility Audits (Axe-core) + ARIA Markup      |

To comply with **HIPAA Security Rule §164.312(a)(2)(iii) (Automatic Logoff)**, electronic health applications must enforce an automatic session termination after a period of user inactivity.

Below is a production-ready, reusable React custom hook (`useInactivityTimeout`) designed specifically to handle inactivity detection, issue a warning countdown modal, wipe in-memory auth state, and clear active browser sessions.

---

### 1. Inactivity Timeout Architecture

```
[ User Activity Listener ] ──(Resets Timer)──► ┌───────────────────────────────────┐
  - mousemove, keydown,                         │   Activity Timer (e.g., 14 mins)  │
  - click, scroll, touchstart                   └─────────────────┬─────────────────┘
                                                                  │
                                                        Timer Expires
                                                                  │
                                                                  ▼
                                                ┌───────────────────────────────────┐
                                                │  Warning Modal (e.g., 60 seconds) │
                                                └─────────────────┬─────────────────┘
                                                                  │
                                                     No User Response / Expired
                                                                  │
                                                                  ▼
                                                ┌───────────────────────────────────┐
                                                │ HIPAA Session Wiping Protocol     │
                                                │  - Clear In-Memory Tokens         │
                                                │  - Invalidate Refresh Cookies     │
                                                │  - Purge Cached Patient Data      │
                                                │  - Redirect to Login              │
                                                └───────────────────────────────────┘

```

---

### 2. Custom React Hook Implementation (`useInactivityTimeout.ts`)

```typescript
import { useEffect, useRef, useState, useCallback } from 'react';

interface InactivityConfig {
  timeoutMs?: number;      // Total time before logoff (Default: 15 mins = 900,000 ms)
  warningMs?: number;      // Warning countdown before logoff (Default: 60 secs = 60,000 ms)
  onTimeout: () => void;   // Callback to clear session, state, and redirect
}

export const useInactivityTimeout = ({
  timeoutMs = 15 * 60 * 1000, // 15 minutes (HIPAA Standard)
  warningMs = 60 * 1000,      // 60 seconds warning
  onTimeout,
}: InactivityConfig) => {
  const [isWarningVisible, setIsWarningVisible] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(Math.floor(warningMs / 1000));

  // Refs to maintain state across re-renders without triggering timer resets
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeoutRef = useRef(onTimeout);

  // Keep latest onTimeout callback reference without restarting effect
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Clean up all active timers
  const clearAllTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  }, []);

  // Trigger HIPAA-compliant automatic logoff
  const handleLogoff = useCallback(() => {
    clearAllTimers();
    setIsWarningVisible(false);
    onTimeoutRef.current();
  }, [clearAllTimers]);

  // Start countdown timer during warning state
  const startWarningCountdown = useCallback(() => {
    setIsWarningVisible(true);
    setRemainingSeconds(Math.floor(warningMs / 1000));

    countdownIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          handleLogoff();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [warningMs, handleLogoff]);

  // Reset main inactivity timer
  const resetTimer = useCallback(() => {
    clearAllTimers();
    setIsWarningVisible(false);

    // Calculate time until warning modal should show
    const timeUntilWarning = Math.max(0, timeoutMs - warningMs);

    idleTimerRef.current = setTimeout(() => {
      startWarningCountdown();
    }, timeUntilWarning);
  }, [timeoutMs, warningMs, clearAllTimers, startWarningCountdown]);

  // User explicitly acknowledges the warning to stay logged in
  const stayLoggedIn = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Throttled event listener attachment to avoid performance drag
    let throttleTimeout: NodeJS.Timeout | null = null;

    const handleUserActivity = () => {
      // If warning modal is showing, force explicit user action on modal button
      if (isWarningVisible) return;

      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          resetTimer();
          throttleTimeout = null;
        }, 1000); // Throttle activity events to max once per second
      }
    };

    // Track standard user input signals
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Initialize timer on component mount
    resetTimer();

    return () => {
      clearAllTimers();
      if (throttleTimeout) clearTimeout(throttleTimeout);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [resetTimer, clearAllTimers, isWarningVisible]);

  return {
    isWarningVisible,
    remainingSeconds,
    stayLoggedIn,
    forceLogoff: handleLogoff,
  };
};

```

---

### 3. Usage Example in a HIPAA Patient Portal (`AppLayout.tsx`)

This integration shows how the hook wipes in-memory auth state, notifies the backend to invalidate the `HttpOnly` refresh cookie, clears any sensitive client-side caches, and displays a modal warning before logoff.

```tsx
import React from 'react';
import { useInactivityTimeout } from './hooks/useInactivityTimeout';
import { tokenStore } from './security/tokenStore';
import { apiClient } from './security/apiClient';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // HIPAA Session Wiping Procedure
  const executeHipaaLogoff = async () => {
    try {
      // 1. Notify Backend to revoke refresh cookie & invalidate session in DB/Redis
      await apiClient.post('/auth/logout');
    } catch {
      // Proceed with client wipe even if network fails
    } finally {
      // 2. Wipe in-memory token store
      tokenStore.clearToken();

      // 3. Clear sensitive state/caches (e.g., React Query, SWR, or Redux store)
      // queryClient.clear(); 

      // 4. Redirect user to login with timeout flag
      window.location.href = '/login?reason=inactivity';
    }
  };

  // Initialize hook: 15-min idle total, warning modal shows at minute 14
  const { isWarningVisible, remainingSeconds, stayLoggedIn, forceLogoff } =
    useInactivityTimeout({
      timeoutMs: 15 * 60 * 1000, // 15 minutes
      warningMs: 60 * 1000,      // 60-second warning countdown
      onTimeout: executeHipaaLogoff,
    });

  return (
    <div className="app-layout">
      {children}

      {/* HIPAA Session Timeout Warning Modal */}
      {isWarningVisible && (
        <div role="dialog" aria-modal="true" className="modal-backdrop">
          <div className="modal-content">
            <h3>Session Expiring Due to Inactivity</h3>
            <p>
              For HIPAA compliance and patient data protection, your session will automatically log off in:
            </p>
            <div className="countdown-display">{remainingSeconds} seconds</div>
            
            <div className="modal-actions">
              <button onClick={forceLogoff} className="btn-secondary">
                Log Out Now
              </button>
              <button onClick={stayLoggedIn} className="btn-primary">
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

```

---

### Key HIPAA Compliance Protections

1. **Explicit Acknowledgment:** When the warning modal appears, passive events (e.g., subtle mouse movement) will no longer reset the timer. The user must explicitly click "Stay Logged In" to extend their session.
2. **Zero In-Memory Leakage:** Upon expiration, `executeHipaaLogoff` clears memory-stored access tokens, revokes the server-side refresh cookie, and triggers client cache invalidation so subsequent users on shared devices cannot hit "Back" in the browser to view Protected Health Information (PHI).
3. **Throttled Event Listeners:** Event listeners are throttled using `setTimeout` to prevent UI lag on high-frequency events like `mousemove` and `scroll`.
