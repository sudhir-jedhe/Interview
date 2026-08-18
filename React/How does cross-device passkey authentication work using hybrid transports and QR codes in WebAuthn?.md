Cross-device passkey authentication—formally specified in the FIDO Alliance and W3C WebAuthn standards as the **Hybrid Transport** (previously called **caBLE** / *Client-to-Authenticator Bridge over Local Proximity*)—allows a user on a desktop/laptop browser to use a smartphone (iOS or Android) as a roaming FIDO2 authenticator.

It relies on a two-channel architecture: an **encrypted internet signaling channel** (rendezvous server) paired with a **local Bluetooth Low Energy (BLE) proximity check** to prevent remote phishing.

---

### Step-by-Step Architecture Flow

```
 Desktop Browser                    Rendezvous Server                   Phone (Authenticator)
 (Client/Relying Party)               (Cloud Relay)                       (iOS / Android)
        │                                   │                                    │
        │── 1. Displays QR Code ────────────┼───────────────────────────────────►│ (Phone scans QR)
        │      (Secret + Tunnel Key)        │                                    │
        │                                   │                                    │
        │── 2. Advertises / Listens via BLE ┼ ─ ─ (Proximity Verification) ─ ─ ─►│
        │                                   │                                    │
        │── 3. Connects WebSockets ────────►│◄── 4. Connects WebSockets ─────────│
        │      (End-to-End Encrypted Tunnel)│      (End-to-End Encrypted Tunnel) │
        │                                   │                                    │
        │── 5. Transmits CTAP2 Request ─────┴───► (Relayed Encrypted Payload) ──►│
        │                                                                        │ (Biometric: Touch/Face ID)
        │◄── 6. Transmits Signed Assertion ─┬───◄ (Relayed Encrypted Payload) ───│
        │                                   │                                    │
        ▼                                   ▼                                    ▼
 Verifies Assertion &
 Authenticates Session

```

---

### 1. Generating the QR Code & Ephemeral Secrets

When a desktop browser initiates `navigator.credentials.get()` or `create()` and the user selects *"Use a phone or tablet"*:

1. **Ephemeral Key Pair Generation:** The desktop browser generates an ephemeral Diffie-Hellman (P-256 or X25519) key pair specifically for this transaction.
2. **QR Code Payload Construction:** The browser encodes a standardized `fido:/` URI into a QR code on screen. This URI contains:

* **Rendezvous Routing Identifier:** A temporary hash identifying the session on the signaling relay server.
* **Desktop Public Key / Shared Secret Seed:** Used to derive end-to-end encryption keys.
* **Random Salt / Nonce:** Prevents replay attacks.

---

### 2. Scanning the QR Code & Establishing the Encrypted Relay

1. **Native Camera Scanning:** The user scans the QR code using the native iOS/Android camera.
2. **Tunnel Key Derivation (HKDF):** Both devices use the ephemeral secrets from the QR code and standard HKDF (HMAC-based Key Derivation Function) to derive symmetric AES-GCM encryption keys.
3. **Rendezvous Server Relay:** Both the desktop and phone connect via WebSockets to a secure cloud relay (such as Google’s or Apple’s signaling infrastructure).

* The rendezvous server **cannot decrypt** the traffic; it acts strictly as a blind packet forwarder matching the two clients by their routing ID.

---

### 3. Proximity Enforcement via Bluetooth Low Energy (BLE)

To guarantee that the phone is **physically in the same room as the computer** (preventing remote phishing where an attacker streams the QR code over video chat):

* The phone and desktop exchange ephemeral BLE advertisements.
* The desktop checks the signal strength (RSSI) and verifies a cryptographic signature broadcast over BLE that could only be derived from the initial QR code handshake.
* If BLE proximity cannot be confirmed, the handshake is aborted—even if the internet relay tunnel is active.

---

### 4. CTAP2 Message Exchange & Biometric Signing

Once proximity is verified and the tunnel is established:

1. **CTAP2 Assertion Request:** The desktop encapsulates the standard WebAuthn assertion/registration request (`authenticatorGetAssertion` or `authenticatorMakeCredential`) into a CTAP2 message, encrypts it with the derived AES key, and sends it over the relay.
2. **Biometric Prompt:** The phone decrypts the message, validates the `rpId` (e.g., `example.com`), and displays a native prompt: *"Sign in to example.com with Face ID / Touch ID"*.
3. **Hardware-Backed Signature:** The secure enclave on the phone signs the server challenge using the private key associated with that `rpId`.
4. **Encrypted Return:** The phone encrypts the signed assertion and sends it back through the tunnel to the desktop browser.
5. **Session Resolution:** The desktop browser unwraps the payload and resolves the `navigator.credentials` Promise, submitting the assertion to the web application's backend.

---

### 5. Persistent Pairing (Subsequent Logins without QR Scanning)

After completing the QR ceremony once, the devices can store a persistent pairing token:

* The phone and desktop exchange long-term identity keys stored in the browser profile / OS credential manager.
* On future logins, the desktop can automatically send a silent push notification via the cloud relay to the paired phone.
* The user only needs to confirm the prompt and tap their fingerprint on the phone—**no QR scan required**.

---

### How to Enable Hybrid Transport in Code

Hybrid transport works out of the box in WebAuthn if you allow `"hybrid"` in your `transports` array and avoid restricting authenticators strictly to internal platform authenticators:

```typescript
// Registration / Authentication Options
const options = {
  challenge: base64UrlChallenge,
  rpId: "example.com",
  // Omit authenticatorAttachment: "platform" if you want to explicitly allow cross-device hybrid
  // Or include "hybrid" in allowed transports:
  allowCredentials: [
    {
      id: credentialId,
      type: "public-key",
      transports: ["hybrid", "internal", "usb", "nfc", "ble"],
    },
  ],
  userVerification: "preferred",
};

// Desktop will automatically render the "Use a phone or tablet" QR option
const credential = await navigator.credentials.get({ publicKey: options });

```

---

### Security Properties at a Glance

* **Phishing Resistance:** The origin/RP ID verification is enforced by the desktop browser and verified by the phone's OS against the TLS connection, preventing credential relay to fake domains.
* **Proximity Guarantee:** The mandatory BLE handshake ensures an attacker on the other side of the world cannot trick a user into scanning a proxied QR code.
* **Zero-Knowledge Signaling:** The rendezvous relay sees only encrypted ciphertext and ephemeral routing hashes.
