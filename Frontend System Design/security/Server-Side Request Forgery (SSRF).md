In Front-End System Design, **Server-Side Request Forgery (SSRF)** is an attack where an attacker tricks a server component in your front-end architecture into making unauthorized network requests to internal systems, cloud metadata services, or third-party APIs.

While traditional SSRF targets backend microservices, modern front-end architectures—specifically **Server-Side Rendering (SSR) frameworks (Next.js, Remix, Nuxt, SvelteKit)**, **BFFs (Backend-for-Frontend)**, and **Edge Middleware**—run server-side code (Node.js/V8) that acts as an intermediate server. If these components handle user-supplied URLs without proper validation, they become prime targets for SSRF.

---

## 1. How SSRF Manifests in Front-End Architecture

Consider a modern React/Next.js application with features like:

* **Image Optimization & Proxying:** Fetching an image from a user-supplied URL and resizing it.
* **Link Previews / OpenGraph Generators:** Fetching metadata for a URL pasted into a chat or comment field.
* **Server-Side Data Fetching (`getServerSideProps`, Server Components, Actions):** Proxying client requests to backend services.

### The Vulnerability Architecture

```
[ Attacker / Client ]
          │
          │ 1. Request with malicious payload:
          │    POST /api/preview?url=http://169.254.169.254/latest/meta-data/
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 FRONT-END SSR SERVER / BFF (Next.js Node Engine)            │
│                                                                             │
│  fetch(req.query.url) ──►  Fails to validate target URL origin!             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       │ 2. SSR Server executes request 
                                       │    from inside internal network
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 PROTECTED INTERNAL INFRASTRUCTURE                           │
│                                                                             │
│  • AWS EC2 Metadata API (http://169.254.169.254) ──► Leaks IAM Credentials  │
│  • Internal Redis / Database (http://10.0.0.5:6379) ──► Unauthorized Access │
│  • Internal Admin Portals (http://localhost:8080/admin)                     │
└─────────────────────────────────────────────────────────────────────────────┘

```

Because the SSR server runs **inside** your cloud network or VPC, it has network access to internal microservices and cloud metadata endpoints that are blocked from the public internet.

---

## 2. Countering the SSRF Threat (Defense-in-Depth)

To safeguard your front-end server against SSRF, apply a multi-layered defense strategy:

### A. Strict URL Allowlisting (Domain Layer)

Only permit requests to explicitly approved third-party domains or origins. Never allow arbitrary user-defined hosts.

### B. IP Resolution & Private Subnet Blocking (Network Layer)

An attacker can bypass simple domain checks using DNS Rebinding or custom domains pointing to private IPs (e.g., `[http://malicious.com](http://malicious.com)` resolving to `127.0.0.1`).
Before making a request, resolve the domain name to its IPv4/IPv6 address and verify it does **not** fall within private or loopback ranges:

* `127.0.0.0/8` (Loopback)
* `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` (Private RFC 1918)
* `169.254.169.254` (AWS/GCP/Azure Cloud Metadata API)
* `::1/128`, `fc00::/7` (IPv6 Local/Unique)

### C. Disable HTTP Redirect Follows

Attackers often pass a public URL that issues a `302 Redirect` to an internal IP (`302 -> [http://169.254.169.254](http://169.254.169.254)`). Disable automatic redirect following in your server-side `fetch` client.

### D. Network-Level Egress Control

At the container/K8s level, isolate the SSR/Node container so it cannot physically talk to internal databases or metadata services without explicit firewall rules.

---

## 3. Practical Example: Fixing SSRF in Next.js / Node SSR

### Vulnerable Code (DO NOT USE)

```typescript
// pages/api/preview.ts — VULNERABLE TO SSRF
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  // BAD: Blindly fetching dynamic user input!
  const response = await fetch(url as string);
  const data = await response.text();

  res.status(200).send(data);
}

```

---

### Secure Implementation (Fixed)

Here is a production-grade utility using `ipaddr.js` to perform strict DNS resolution, private IP validation, protocol restriction, and redirect disabling.

```typescript
// src/security/safeFetch.ts
import dns from 'dns/promises';
import ipaddr from 'ipaddr.js';

// Define allowed protocols and block private IP ranges
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

function isPrivateIp(ipString: string): boolean {
  try {
    const addr = ipaddr.parse(ipString);
    const range = addr.range();

    // Block private, loopback, linkLocal (metadata), and reserved IPs
    const forbiddenRanges = [
      'loopback',
      'private',
      'linkLocal', // Catches 169.254.169.254
      'uniqueLocal',
      'unspecified',
      'broadcast',
    ];

    return forbiddenRanges.includes(range);
  } catch {
    return true; // Reject if IP parsing fails
  }
}

export async function safeFetch(targetUrl: string, init?: RequestInit): Promise<Response> {
  // 1. Validate URL syntax & protocol
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    throw new Error('Invalid URL format');
  }

  if (!ALLOWED_PROTOCOLS.has(parsedUrl.protocol)) {
    throw new Error(`Forbidden protocol: ${parsedUrl.protocol}`);
  }

  // 2. Resolve DNS hostname to underlying IP addresses
  const host = parsedUrl.hostname;
  
  // Direct IP input check
  if (ipaddr.isValid(host)) {
    if (isPrivateIp(host)) {
      throw new Error('[SECURITY] Access to private IP addresses is prohibited.');
    }
  } else {
    // Resolve hostname to IP
    const addresses = await dns.resolve(host);
    if (!addresses || addresses.length === 0) {
      throw new Error('Unable to resolve domain name.');
    }

    // Verify EVERY resolved IP address against private subnet blocks
    for (const ip of addresses) {
      if (isPrivateIp(ip)) {
        throw new Error(`[SECURITY] Host resolves to a restricted private IP: ${ip}`);
      }
    }
  }

  // 3. Execute request with REDIRECTS DISABLED (Prevents HTTP 302 Bypass)
  const secureInit: RequestInit = {
    ...init,
    redirect: 'error', // Fails if the server attempts to redirect to internal IPs
  };

  return fetch(parsedUrl.toString(), secureInit);
}

```

### Applying `safeFetch` in an SSR Endpoint

```typescript
// pages/api/preview.ts — SECURED AGAINST SSRF
import type { NextApiRequest, NextApiResponse } from 'next';
import { safeFetch } from '../../src/security/safeFetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Use our safeFetch utility instead of raw fetch
    const response = await safeFetch(url);
    const contentType = response.headers.get('content-type') || '';

    // Only allow parsing HTML/JSON responses
    if (!contentType.includes('text/html') && !contentType.includes('application/json')) {
      return res.status(415).json({ error: 'Unsupported media type' });
    }

    const data = await response.text();
    return res.status(200).send(data.substring(0, 10000)); // Limit response size
  } catch (error: any) {
    console.error('[SSRF Prevented]:', error.message);
    return res.status(400).json({ error: 'Failed to fetch the requested resource securely.' });
  }
}

```

---

## Summary Strategy Matrix

| SSRF Threat Vector                          | Vulnerability Source                                                       | Front-End Architectural Fix                                                                |
| ------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **AWS Metadata Access (`169.254.169.254`)** | SSR Server fetches dynamic Cloud URLs                                      | `ipaddr.js` range validation blocking `linkLocal` and `private` ranges.                    |
| **DNS Rebinding Attacks**                   | Domain resolves to public IP during check, but private IP during `fetch()` | Resolve IP address via DNS first, validate IP, and make the request directly or re-verify. |
| **HTTP 302 Redirect Bypass**                | Public URL redirects server to `http://localhost:8080`                     | Set `redirect: 'error'` or `redirect: 'manual'` in fetch options.                          |
| **Non-HTTP Protocol Injection**             | URLs like `file:///etc/passwd` or `gopher://`                              | Enforce an explicit protocol allowlist (`http:` and `https:` only).                        |
