WebAuthn / FIDO2 provides cryptographic phishing resistance by design. It makes standard **Adversary-in-the-Middle (AitM) reverse proxies** (e.g., Evilginx, Modlishka) and **malicious QR code relay attacks** mathematically impossible to execute, even if a user is completely tricked by a fraudulent website.

Here is how WebAuthn neutralizes both attack vectors at the protocol level.

---

### 1. How WebAuthn Defeats Standard AitM Reverse-Proxy Phishing

In an AitM attack, an attacker stands between the user and the real service:

$$\text{Victim} \longleftrightarrow \text{Attacker Proxy (}\texttt{evil-bank.com}\text{)} \longleftrightarrow \text{Legitimate Server (}\texttt{bank.com}\text{)}$$

With traditional passwords or SMS/TOTP 2FA codes, the proxy forwards the credentials to the real server, steals the session cookie, and compromises the account.

WebAuthn stops this through **Origin & RP ID Binding**:

```
 ┌──────────────┐         1. Loads Phishing Site         ┌─────────────────────────┐
 │ Victim's     │ ─────────────────────────────────────► │ Attacker Reverse Proxy  │
 │ Browser      │                                        │ (https://evil-bank.com) │
 └──────┬───────┘                                        └────────────┬────────────┘
        │                                                             │
        │ [Browser enforces: origin = "https://evil-bank.com"]        │ 2. Proxies Request
        ▼                                                             ▼
 ┌──────────────┐                                        ┌─────────────────────────┐
 │ Authenticator│ ◄── 3. Requests signature with RP ID ─ │ Real Bank Backend       │
 │ Enclave      │        "evil-bank.com"                 │ (https://bank.com)      │
 └──────┬───────┘                                        └─────────────────────────┘
        │
        ├─► Scenario A: No private key registered for "evil-bank.com" ──► Auth Fails Immediately!
        │
        └─► Scenario B (Attacker tampers RP ID to "bank.com"):
              • Client Data JSON sets origin = "https://evil-bank.com"
              • Backend inspects signature and detects mismatch:
                origin ("evil-bank.com") ≠ expectedOrigin ("bank.com") ──► Auth REJECTED!

```

#### The Cryptographic Mechanism: `clientDataJSON`

When `navigator.credentials.get()` is invoked:

1. **Browser Injects Verified Origin:** The browser (not JavaScript or the webpage) constructs a canonical JSON string called `clientDataJSON`. The browser strictly populates the `origin` field using the active window location:

```json
{
  "type": "webauthn.get",
  "challenge": "dGhpcy1pcy1hLXJhbmRvbS1jaGFsbGVuZ2U",
  "origin": "https://evil-bank.com",
  "crossOrigin": false
}

```

1. **Hardware Signs the Hash:** The authenticator hashes `clientDataJSON` along with `rpIdHash` (SHA-256 hash of the effective domain) and signs it using the private key inside the secure enclave:

$$\text{Signature} = \text{Sign}_{K_{\text{private}}}(\text{AuthenticatorData} \parallel \text{SHA-256}(\text{clientDataJSON}))$$

1. **Backend Verifies Origin:** The real server (`bank.com`) receives the signed assertion and inspects the unhashed `clientDataJSON`. If `origin !== "[https://bank.com](https://bank.com)"`, **the server rejects the assertion**.

Because the signature covers the SHA-256 hash of `clientDataJSON`, **the attacker cannot modify the origin string in transit without breaking the cryptographic signature**.

---

### 2. How WebAuthn Defeats Malicious QR Code Relays (Cross-Device Attacks)

In a cross-device attack, an attacker visits `bank.com`, initiates a login that generates a QR code, and displays that QR code on a malicious site (`evil-bank.com`) or streams it to a victim over video/chat.

WebAuthn's **Hybrid Transport (FIDO Cross-Device)** prevents this via three synchronized barriers:

```
Attacker's Laptop (Remote)                    Victim's Phone (Local)
┌────────────────────────────────┐            ┌────────────────────────────────┐
│ Displays real bank's QR code   │ ──(Scan)──►│ Scans QR code with camera      │
│ on a phishing screen           │            │                                │
└──────────────┬─────────────────┘            └───────────────┬────────────────┘
               │                                              │
               │         Internet Rendezvous Relay            │
               │◄────────────────────────────────────────────►│ (Encrypted WebSocket Tunnel)
               │                                              │
               │                                              │
               ▼                                              ▼
    [BLE Broadcast Check] ── ✗ NO PROXIMITY DETECTED ✗ ──► [BLE Listener]
               │                                              │
               └────────────► CEREMONY ABORTED ◄──────────────┘
                         (Bluetooth handshake fails)

```

#### 1. Mandatory Bluetooth Low Energy (BLE) Proximity Verification

* The hybrid transport requires the desktop browser and the mobile phone to exchange cryptographically signed advertisements over **local Bluetooth**.
* The ephemeral keys derived during the QR handshake must match the broadcast signatures over the local BLE radio.
* If the victim is scanning a QR code displayed by an attacker located remotely (e.g., across the internet), **the BLE handshake fails due to physical distance, and the connection is aborted**.

#### 2. Domain Confirmation on the Authenticator Screen

* When the phone parses the CTAP2 message from the encrypted tunnel, the mobile OS queries the Relying Party ID.
* The native biometric prompt explicitly displays:

> *"Sign in to **bank.com**?"*

* If an attacker attempted to forge the tunnel to an evil domain, the prompt displays the attacker's domain, alerting the user.

#### 3. Ephemeral End-to-End Encrypted Tunnel

* The QR code encodes an ephemeral public key.
* The desktop and mobile device derive temporary AES-GCM session keys via HKDF.
* Even if the cloud relay/rendezvous server is compromised or operated by an attacker, it sees only encrypted ciphertext and cannot extract the credentials or tamper with the challenge.

---

### Summary Comparison: WebAuthn vs. Legacy Auth Against AitM

| Authentication Factor     | Attacker Sets Up Reverse Proxy (`evil-bank.com`)                                 | Attacker Relays QR Code Remotely                                |
| ------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Password + SMS / TOTP** | ❌ **Compromised** (Proxy intercepts code & session cookie)                       | ❌ **Compromised** (Victim enters code directly into proxy)      |
| **Push Notification 2FA** | ❌ **Vulnerable** (Fatigue / blind approval)                                      | ❌ **Vulnerable** (Prompt triggered by attacker)                 |
| **WebAuthn / Passkeys**   | ✅ **Immune** (Browser enforces origin mismatch $\rightarrow$ signature rejected) | ✅ **Immune** (BLE physical proximity check fails + RP ID bound) |
