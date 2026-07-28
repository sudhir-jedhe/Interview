Here are detailed answers to all 16 Web Application Security questions from your image, tailored with explanations, key technical concepts, and interview tips.

---

### **Q1: What is a DDoS attack?**

**Distributed Denial of Service (DDoS)** is a malicious attempt to disrupt normal traffic to a targeted server, service, or network by overwhelming it with a flood of Internet traffic.

- **How it works:** Attacks originate from a network of infected devices (called a **botnet**) controlled remotely by an attacker. When targeted, each bot sends requests to the victim’s IP address, causing the server or network to overload and crash, making it unavailable to legitimate users.
- **Types of DDoS attacks:**
- **Volume-based:** UDP floods, ICMP floods (saturates bandwidth).
- **Protocol-based:** SYN floods, Ping of Death (consumes server resources like connection tables).
- **Application-layer:** HTTP GET/POST floods (targets specific web application functions).

---

### **Q2: What is "Vulnerability"?**

A **vulnerability** is a weakness, flaw, or loophole in a system's design, implementation, code, or internal control that can be exploited by an attacker to compromise security, confidentiality, integrity, or availability.

- **Formula to remember:** $\text{Risk} = \text{Threat} \times \text{Vulnerability} \times \text{Impact}$
- **Examples:** Outdated software, unvalidated user inputs (allowing SQLi/XSS), weak passwords, misconfigured servers, or unencrypted data transmissions.

---

### **Q3: What is SQL Injection (SQLi)?**

**SQL Injection** is a web security vulnerability that allows an attacker to interfere with the database queries an application makes. It occurs when untrusted user input is directly concatenated into a dynamic database query.

- **Impact:** Attackers can bypass authentication, view unauthorized data, modify or delete database entries, and even execute administrative commands on the database server.
- **Example:**

```sql
-- Vulnerable query constructed via string concatenation:
SELECT * FROM users WHERE username = 'admin' AND password = '' OR '1'='1';

```

Since `'1'='1'` is always true, this query logs the attacker in as `admin` without a password.

---

### **Q4: What is a Botnet?**

A **botnet** (short for "robot network") is a network of internet-connected devices—such as PCs, servers, mobile devices, or IoT devices—that have been infected with malware and are controlled centrally by a cybercriminal known as a **botmaster**.

- **Key Use Cases for Attackers:** Launching DDoS attacks, sending spam emails, stealing credentials, clicking on ads (click fraud), or mining cryptocurrency without the device owner's consent.

---

### **Q5: What is the difference between Authentication vs. Authorization?**

| Feature           | Authentication (AuthN)                               | Authorization (AuthZ)                                     |
| ----------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| **Definition**    | Verifies **who you are** (identity verification).    | Determines **what you can do** (permission/access level). |
| **Process**       | Done before authorization.                           | Done after authentication.                                |
| **Examples**      | Entering passwords, OTPs, biometric checks (FaceID). | Checking if a logged-in user has `Admin` vs `User` roles. |
| **Tokens / Tech** | Passwords, SAML, OAuth 2.0, OpenID Connect.          | RBAC (Role-Based Access Control), ABAC, ACLs.             |

---

### **Q6: What is Security Testing?**

**Security Testing** is a non-functional software testing process designed to uncover vulnerabilities, threats, risks, and weaknesses in a system or software application. Its goal is to prevent unauthorized access, data leaks, and malicious attacks.

- **Key Attributes Tested:**

1. **Confidentiality:** Data is only accessible to authorized users.
2. **Integrity:** Information cannot be tampered with in transit or storage.
3. **Authentication & Authorization:** Proper access control.
4. **Availability:** System remains operational under attack.
5. **Non-repudiation:** Actions can be traced back to specific users.

---

### **Q7: List the various methodologies in Security Testing.**

1. **Vulnerability Assessment:** Scanning automated systems to detect known vulnerabilities.
2. **Penetration Testing (Pen Testing):** Simulating real-world attacks to exploit vulnerabilities manually/automatically.
3. **Security Auditing:** Internal inspection of code, policies, and configurations against security standards.
4. **Security Scanning:** Analyzing system configurations and application structures across networks.
5. **Risk Assessment:** Categorizing risks as high, medium, or low based on likelihood and impact.
6. **Ethical Hacking:** Full-spectrum testing where security experts intentionally attempt to breach an enterprise system.
7. **Posture Assessment:** Evaluating the overall security posture and health of an organization.

---

### **Q8: What is Content Security Policy (CSP)?**

**Content Security Policy (CSP)** is an HTTP response header (e.g., `Content-Security-Policy`) that allows site administrators to restrict the resources (such as JavaScript, CSS, Images) that the browser is allowed to load for a given page.

- **Primary Purpose:** Prevents Cross-Site Scripting (XSS) and data injection attacks by restricting untrusted inline scripts and external domains.
- **Example Directive:**

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trustedscripts.com;

```

This tells the browser to execution scripts _only_ from the same origin (`'self'`) or `trustedscripts.com`.

---

### **Q9: What is Cross-Site Scripting (XSS)?**

**Cross-Site Scripting (XSS)** is a client-side injection attack where an attacker injects malicious scripts (usually JavaScript) into a trusted website. When other users visit the site, their browser executes the script automatically.

- **Types:**
- **Stored XSS:** Malicious payload is permanently stored in a database/comment field and served to every user viewing that page.
- **Reflected XSS:** Payload is part of an HTTP request (e.g., URL parameters) and reflected off the web server in the response.
- **DOM-based XSS:** Flaw exists entirely in client-side code where JavaScript dynamically modifies the DOM unsafely.

- **Impact:** Theft of session cookies, user credentials, keylogging, or redirecting to malicious sites.

---

### **Q10: How can we Protect Web Applications From Forced Browsing?**

**Forced Browsing** (also known as Predictable Resource Location) occurs when an attacker manually types URL paths to access restricted pages (e.g., `/admin/dashboard`, `/backup.zip`) bypassing the UI navigation.

- **Prevention Measures:**

1. **Strict Authorization Checks:** Enforce server-side role and permission checks on **every single endpoint**, not just hidden UI buttons.
2. **Indirect Object References:** Use UUIDs or hashes instead of sequential IDs (e.g., `/user/a8f9-4b12` instead of `/user/12`).
3. **Disable Directory Browsing:** Configure the web server (Apache/Nginx/IIS) so file listing is turned off.
4. **Custom 404/403 Pages:** Do not expose system information on error pages.

---

### **Q11: Explain what threat arises from not flagging HTTP cookies with tokens as secure?**

If a cookie containing a session token or authentication JWT is **not** flagged with the `Secure` attribute:

- **The Threat:** The browser will transmit that cookie over unencrypted HTTP protocol connections in cleartext.
- **Attack Scenario:** An attacker on the same local network (e.g., public Wi-Fi) can perform a **Man-in-the-Middle (MitM)** attack or packet sniffing to intercept the cookie and hijack the user's session.
- **Best Practice:** Always flag session cookies with `Secure` (forces HTTPS transmission) and `HttpOnly` (prevents client-side JS access to mitigate XSS).

---

### **Q12: What is an SSL Certificate?**

An **SSL/TLS Certificate** is a digital document issued by a trusted Certificate Authority (CA) that authenticates a website's identity and enables an encrypted link between a web server and a browser using HTTPS.

- **Key Roles:**

1. **Encryption:** Encrypts data in transit using symmetric/asymmetric cryptography to prevent eavesdropping.
2. **Identity Verification:** Validates that you are communicating with the genuine server (e.g., `bank.com`) and not an impersonator.

---

### **Q13: How to mitigate SQL Injection risks?**

1. **Parameterized Queries / Prepared Statements:** Ensures user input is treated as data, not executable SQL code (e.g., using PDO in PHP, PreparedStatement in Java, or parameterized queries in Node.js).

```javascript
// Secure (Parameterized Query):
db.query("SELECT * FROM users WHERE id = ?", [userId]);
```

2. **Use Object-Relational Mappers (ORMs):** Frameworks like Prisma, Hibernate, or Entity Framework automatically parameterize queries.
3. **Input Validation & Sanitization:** Enforce strict type, length, and format validation on inputs.
4. **Principle of Least Privilege:** Ensure database user accounts used by applications have only necessary permissions (e.g., disabling `DROP TABLE` privileges).

---

### **Q14: What is Session Hijacking?**

**Session Hijacking** (or cookie hijacking) occurs when an attacker steals a valid user session ID or token to impersonate that user and gain unauthorized access to their account on a web application.

- **Common Attack Vectors:**
- Cross-Site Scripting (XSS) to read `document.cookie`.
- Packet sniffing over insecure/unencrypted Wi-Fi networks (lack of HTTPS/`Secure` flag).
- Session prediction due to weak or sequential session IDs.
- Malware or spyware installed on the client machine.

---

### **Q15: Mention what flaw arises from session tokens having poor randomness across a range of values?**

- **The Flaw:** **Predictable Session Tokens** (or Weak Session Management).
- **Consequence:** If session tokens have low entropy (poor randomness) or follow sequential patterns, an attacker can use automated brute-force scripts to calculate or guess valid session IDs of active users without stealing them via traditional attacks. This leads directly to **Session Hijacking**.
- **Solution:** Generate high-entropy, cryptographically secure pseudo-random numbers (CSPRNG) for session identifiers.

---

### **Q16: What is DOM-based XSS?**

**DOM-based XSS** is a subtype of Cross-Site Scripting where the vulnerability exists entirely in client-side code (JavaScript). It occurs when JavaScript reads data from an untrusted **Source** (like `window.location.href`, `location.search`, or `document.referrer`) and passes it to an unsafe **Sink** (like `element.innerHTML`, `document.write()`, or `eval()`) without proper sanitization.

- **Key Characteristic:** Unlike Stored or Reflected XSS, the HTTP payload/response from the server does **not** change. The entire attack payload is executed entirely within the victim's browser DOM manipulation logic.
- **Fix:** Avoid unsafe sinks like `innerHTML` or `eval()`. Instead, use safe methods like `textContent` or `innerText`.

Here are detailed, interview-ready answers for questions **Q17 to Q31** from your image, covering essential Application Security and Cryptography concepts.

---

### **Q17: What is CORS and how to enable one?**

- **What is CORS?**
  **Cross-Origin Resource Sharing (CORS)** is a browser security mechanism based on HTTP headers. It determines whether a web browser allows front-end JavaScript code running on one origin (domain, protocol, or port) to request resources from a different origin. By default, browsers enforce the **Same-Origin Policy (SOP)**, blocking cross-origin requests.
- **How to Enable CORS:**
  CORS is enabled on the **backend server** by configuring HTTP response headers:
- `Access-Control-Allow-Origin`: Specifies allowed origins (e.g., `[https://example.com](https://example.com)` or `*` for public APIs).
- `Access-Control-Allow-Methods`: Lists permitted HTTP methods (e.g., `GET, POST, PUT, DELETE`).
- `Access-Control-Allow-Headers`: Lists allowed custom headers (e.g., `Content-Type, Authorization`).

**Express.js Example:**

```javascript
const cors = require("cors");
app.use(cors({ origin: "https://my-frontend.com", methods: ["GET", "POST"] }));
```

---

### **Q18: What is Intrusion Detection System (IDS)?**

An **Intrusion Detection System (IDS)** is a security monitoring system that passively monitors network traffic or system logs for malicious activity, policy violations, or unauthorized access attempts.

- **Key Function:** It **detects and alerts** administrators about suspicious activity (it does _not_ automatically block traffic).
- **Types:**

1. **NIDS (Network IDS):** Analyzes incoming and outgoing network traffic across a subnet.
2. **HIDS (Host IDS):** Runs on individual devices/servers to monitor system calls, file integrity, and local log files.

---

### **Q19: What is Cross-Site Scripting (XSS)?**

**Cross-Site Scripting (XSS)** is an injection vulnerability that occurs when an application includes untrusted, user-supplied data in a web page without proper validation or escaping.

- **How it works:** Attackers inject client-side scripts (usually JavaScript) into dynamic web pages. When other users open the web page, their browser executes the script automatically under the authority of the victim's browser session.

---

### **Q20: Why is the Root Certificate important?**

A **Root Certificate** is a public key certificate that identifies a Root Certificate Authority (CA). It forms the foundation of the **Public Key Infrastructure (PKI)** trust model.

- **Why it matters:**
- It acts as the **Trust Anchor**: Operating systems and browsers come pre-installed with a "Trust Store" containing trusted Root Certificates.
- Intermediate certificates and SSL/TLS certificates on web servers are digitally signed in a chain leading back to this Root Certificate (**Chain of Trust**).
- If the Root Certificate is compromised, the security and validity of _all_ certificates signed below it are completely broken.

---

### **Q21: What is impersonation?**

**Impersonation** is an attack or authorization mechanism where a user or process assumes the identity and permissions of another user or system entity.

- **Malicious Impersonation:** An attacker steals access tokens, credentials, or session cookies to pose as a legitimate user (or admin) to access unauthorized resources.
- **Legitimate Use (Impersonation Tokens):** Systems like AWS (AssumeRole) or admin dashboards allow authorized admins to "impersonate" a user for troubleshooting purposes under strict audit trails.

---

### **Q22: How can I prevent XSS?**

To protect applications from XSS attacks:

1. **Context-Aware Output Encoding:** Encode user input before rendering it in HTML, attributes, or JavaScript variables (e.g., converting `<` to `&lt;`).
2. **Use Modern Frameworks:** React, Angular, and Vue automatically escape data rendered via template bindings (e.g., JSX `{data}`).
3. **Avoid Dangerous Functions:** Do not use `dangerouslySetInnerHTML` in React, `eval()`, or `innerHTML` in raw JS.
4. **Content Security Policy (CSP):** Restrict inline script execution using CSP HTTP headers.
5. **Set `HttpOnly` Flag on Cookies:** Prevents client-side scripts from stealing session cookies via `document.cookie`.

---

### **Q23: Apart from mailing links of error pages, are there other methods of exploiting XSS?**

Yes. Attackers exploit XSS through many attack vectors beyond links:

- **Stored Inputs (Persistent XSS):** Injecting scripts into comment sections, user profiles, forum posts, or chat messages saved in databases and shown to all users.
- **File Uploads:** Uploading SVG or HTML files containing embedded `<script>` payloads.
- **DOM-based Payloads:** Exploiting parameters within single-page applications via client-side routing hash fragments (`/#<script>...`).
- **HTTP Headers:** Injecting scripts via modified `User-Agent`, `Referer`, or custom headers logged and displayed in administrative dashboards.

---

### **Q24: Can XSS be prevented without modifying the source code?**

**Yes, partially.** While proper code fixes are ideal, you can mitigate XSS externally using:

1. **Web Application Firewall (WAF):** A WAF (e.g., Cloudflare, AWS WAF) inspects incoming HTTP requests and blocks common XSS attack payloads before they reach the server.
2. **Enforcing Content Security Policy (CSP):** Injecting strict HTTP response headers at the reverse proxy/web server level (e.g., Nginx, Apache) to block inline execution and untrusted domain scripts.
3. **Setting `HttpOnly` on Cookies:** Configured via web server middleware to prevent session theft even if an XSS vulnerability exists.

---

### **Q25: List the attributes of Security Testing.**

The core principles (often mapped to the CIA Triad + extensions) evaluated during security testing are:

1. **Confidentiality:** Protection against unauthorized information disclosure.
2. **Integrity:** Ensuring data cannot be altered or tampered with without detection.
3. **Authentication:** Verifying user identities correctly.
4. **Authorization:** Enforcing privileges and access limits.
5. **Availability:** Ensuring services remain operational under stress/attacks (DDoS resilience).
6. **Non-Repudiation:** Guaranteeing that actions cannot be denied by the user who performed them (via logging).

---

### **Q26: How to mitigate the risk of Sensitive Data Exposure?**

Sensitive Data Exposure occurs when applications fail to protect data like passwords, credit cards, or PII.

- **Mitigation Steps:**
- **Data in Transit:** Enforce HTTPS everywhere with strong TLS (TLS 1.2/1.3) and HTTP Strict Transport Security (HSTS).
- **Data at Rest:** Encrypt databases and sensitive backups using industry-standard algorithms (AES-256).
- **Password Storage:** Hash passwords using strong adaptive functions (Bcrypt, Argon2, PBKDF2) with random salts.
- **Data Minimization:** Do not collect or store unnecessary sensitive data.
- **Disable Caching:** Set `Cache-Control: no-store` headers on responses containing sensitive data.

---

### **Q27: Name the elements of PKI (Public Key Infrastructure).**

Public Key Infrastructure relies on the following key components:

1. **Certificate Authority (CA):** Issue and digitally sign digital certificates.
2. **Registration Authority (RA):** Verifies the identity of entities requesting digital certificates before the CA issues them.
3. **Certificate Database:** Stores issued certificates and request metadata.
4. **Certificate Revocation List (CRL) / OCSP:** Mechanisms to check if a certificate has been revoked.
5. **Digital Certificates & Public/Private Key Pairs:** Cryptographic credentials used for encryption and identity verification.

---

### **Q28: What is the difference between IDS and Firewalls?**

| Feature          | Firewall                                                                                                              | Intrusion Detection System (IDS)                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Primary Role** | **Prevention / Active Protection**: Filters and blocks unauthorized incoming/outgoing traffic based on IP/port rules. | **Detection / Passive Monitoring**: Analyzes traffic patterns and payloads to raise alerts on suspicious behavior. |
| **Action**       | Drops, blocks, or allows packet traffic actively.                                                                     | Passes traffic through, but logs and notifies administrators if an attack is suspected.                            |
| **Position**     | Situated at network boundaries (inline).                                                                              | Placed out-of-band or inline (via span/mirror ports) to monitor traffic.                                           |

---

### **Q29: List Top 10 OWASP Vulnerabilities.**

_(As defined in the current OWASP Top 10 standard)_:

1. **A01: Broken Access Control**
2. **A02: Security Misconfiguration**
3. **A03: Software Supply Chain Failures** (Vulnerable/Outdated Components)
4. **A04: Cryptographic Failures**
5. **A05: Injection** (SQLi, Command Injection, XSS)
6. **A06: Insecure Design**
7. **A07: Authentication Failures**
8. **A08: Software and Data Integrity Failures**
9. **A09: Security Logging & Alerting Failures**
10. **A10: Mishandling of Exceptional Conditions**

---

### **Q30: Mention what threat can be avoided by having unique usernames produced with a high degree of entropy?**

- **Threat Prevented:** **User Enumeration Attacks**, **Credential Stuffing**, and **Targeted Account Harvesting**.
- **Explanation:** When usernames are predictable (like `john.doe`, sequential IDs like `user101`, or standard emails), attackers can easily guess valid user accounts and perform password-spraying or brute-force attacks. High-entropy usernames (or obscure handles/UUIDs) make guessing valid user accounts virtually impossible.

---

### **Q31: What information can an attacker steal using XSS?**

Because JavaScript runs in the context of the victim's session, an attacker exploiting XSS can steal:

1. **Session Identifiers & Auth Tokens:** Cookies without `HttpOnly` flags and tokens saved in `localStorage` or `sessionStorage`.
2. **Personal Identifiable Information (PII):** Form inputs, credit card details, addresses, and user inputs on the page.
3. **CSRF Tokens:** Session protection tokens rendered in the DOM, allowing attackers to forge user actions.
4. **Keystrokes:** Logging user input on login/payment forms via injected keyloggers.
5. **DOM / Page Content:** Sensitive document content rendered strictly for that logged-in user.
   Here are detailed, interview-ready answers for questions **Q32 to Q46** from your image, covering web application security, cryptography, and authentication principles.

---

### **Q32: What is Cross-Site Request Forgery (CSRF)?**

**Cross-Site Request Forgery (CSRF)** is an attack that forces an authenticated user to execute unwanted actions on a web application in which they are currently logged in.

- **How it works:** Attackers trick the victim's browser into sending a malicious HTTP request (such as transferring money or changing an email address) to a target site. Because the browser automatically attaches stored cookies (like session identifiers), the web server trusts the request, believing it originated intentionally from the legitimate user.

---

### **Q33: What is PKI?**

**Public Key Infrastructure (PKI)** is a framework of hardware, software, policies, roles, and procedures required to create, manage, distribute, use, store, and revoke digital certificates and manage public-key encryption.

- **Purpose:** It establishes secure, trusted communication over untrusted networks (like the Internet) through identity verification and asymmetric cryptography (e.g., SSL/TLS certificates).

---

### **Q34: What is Cross-site request forgery and how to mitigate it?**

- **Definition:** _(See Q32)_ An attack that exploits the server's implicit trust in requests sent by an authenticated user's browser.
- **Mitigation Strategies:**

1. **Anti-CSRF Tokens (Synchronizer Token Pattern):** Generate a unique, secret, and unpredictable token per session/request. Send it in headers or form payloads and validate it on the server.
2. **SameSite Cookie Attribute:** Set cookie properties to `SameSite=Strict` or `SameSite=Lax` to restrict cookies from being sent automatically on cross-site requests.
3. **Re-Authentication / MFA:** Require password re-entry or OTP checks for sensitive operations (e.g., changing passwords or bank transfers).
4. **Custom Request Headers:** Require non-standard headers (e.g., `X-Requested-With`) via AJAX, which browsers block in cross-origin environments unless allowed by CORS.

---

### **Q35: Could you explain the difference between penetration testing and other forms of security testing?**

| Feature      | Penetration Testing                                                                                                   | Other Security Testing (e.g., Vulnerability Scanning, Security Audits)                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Approach** | **Simulated Active Attack**: Ethically attempts to actively exploit vulnerabilities to assess actual business impact. | **Identification & Compliance**: Identifies known vulnerabilities without actively exploiting them or verifies policy adherence. |
| **Method**   | Highly manual, creative, and goal-driven (e.g., "try to extract database admin credentials").                         | Automated tools/scanners and checklist-driven compliance reviews.                                                                |
| **Output**   | Proof-of-concept exploits, risk assessment, and attack paths.                                                         | List of detected vulnerabilities sorted by severity scores (e.g., CVSS).                                                         |

---

### **Q36: What Is Failure to Restrict URL Access?**

**Failure to Restrict URL Access** occurs when an application hides sensitive administrative URLs or paths in the UI (e.g., not displaying an "Admin Dashboard" button to regular users) but fails to enforce authorization checks on the server side when someone types the URL directly (e.g., `[https://example.com/admin/delete-user](https://example.com/admin/delete-user)`).

- **Fix:** Enforce server-side role-based access control (RBAC) checks on every request, independent of client-side navigation restrictions.

---

### **Q37: What is the difference between encryption, encoding, and hashing?**

| Method         | Purpose                                                                          | Key Characteristic                                                         | Reversible?                    | Example Algorithm / Technique |
| -------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------ | ----------------------------- |
| **Encoding**   | Transform data format for compatibility or safe transmission (not for security). | Uses public, standard algorithms; no keys involved.                        | **Yes** (trivial)              | Base64, URL Encoding, ASCII   |
| **Encryption** | Maintain confidentiality and keep data secret from unauthorized parties.         | Requires a cryptographic key to decrypt back to plaintext.                 | **Yes** (with the correct key) | AES-256, RSA, ECC             |
| **Hashing**    | Verify data integrity and store passwords safely.                                | One-way mathematical transformation resulting in a fixed-size hash output. | **No** (one-way function)      | SHA-256, Bcrypt, Argon2       |

---

### **Q38: How to mitigate the risk of Weak authentication and session management?**

1. **Multi-Factor Authentication (MFA):** Require MFA for user logins.
2. **Strong Password Policies:** Prevent common passwords and use adaptive hashing (Bcrypt, Argon2) with salt.
3. **Secure Cookie Configuration:** Set session cookies with `HttpOnly`, `Secure`, and `SameSite` flags.
4. **Session Timeout & Invalidation:** Implement automatic idle session timeouts and invalidate sessions completely upon logout or password resets.
5. **High-Entropy Tokens:** Use cryptographically secure pseudo-random generators (CSPRNG) for session tokens to prevent token prediction.

---

### **Q39: What is HTTP Public Key Pinning (HPKP) and when to use it?**

- **What is HPKP?**
  HPKP was a security mechanism (via HTTP headers) that instructed web browsers to associate (pin) a specific cryptographic public key with a domain name to prevent Man-in-the-Middle (MitM) attacks using forged certificates.
- **When to use it:**
  **Never in modern production.** HPKP has been **deprecated and removed** by all major browsers (Chrome, Firefox, Safari) due to high risk of self-denial-of-service (bricking sites if keys were lost). Modern web applications use **Certificate Transparency (CT)** logs and CAA records instead.

---

### **Q40: Mention what happens when an application takes user inserted data and sends it to a web browser without proper validation and escaping?**

This leads directly to **Cross-Site Scripting (XSS)** vulnerabilities.

- **Result:** The browser interprets raw user-supplied strings as executable code (JavaScript/HTML). Attackers can execute arbitrary scripts inside the victim's session, leading to session hijacking, credential theft, or unauthorized site manipulation.

---

### **Q41: What is a Honeypot?**

A **Honeypot** is a decoy computer system, network, or application designed to attract, trap, and analyze cyberattacks.

- **Purpose:** It appears as a vulnerable, legitimate system to attackers. Security teams use honeypots to detect unauthorized intrusion attempts early, gather intelligence on emerging attack patterns, and divert bad actors away from real production infrastructure.

---

### **Q42: What is Clickjacking?**

**Clickjacking** (also known as a _UI Redress Attack_) is a technique where an attacker overlays transparent or disguised HTML frames (`<iframe>`) over legitimate, actionable web pages.

- **How it works:** Tricked users believe they are clicking on benign elements (e.g., "Play Video"), but are actually clicking on invisible buttons on the underlying framed site (e.g., "Confirm Bank Transfer" or "Delete Account").
- **Prevention:** Use the `X-Frame-Options: DENY` or `frame-ancestors 'none'` directive in Content Security Policies (CSP).

---

### **Q43: Is it possible to decrypt MD5 hashes? Explain.**

**Strictly speaking, No—but they can be cracked.**

- **Explanation:** MD5 is a **one-way hashing function**, meaning mathematical information is lost during computation, making direct "decryption" mathematically impossible.
- **How MD5 is broken:** MD5 is cryptographically weak and susceptible to:

1. **Rainbow Tables / Pre-computed Lookups:** Looking up pre-computed hash values in massive databases to find original inputs.
2. **Hash Collisions:** Producing identical hashes from two different inputs.
3. **Brute-Force GPU Cracking:** Computing billions of hashes per second to match the target output.

- _Note:_ While not "decrypted," MD5 hashes can be quickly reversed to find the original text via lookup tables or collisions, making MD5 unsafe for password storage.

---

### **Q44: If you can decode JWT, how are they secure?**

JSON Web Tokens (JWTs) are typically **Base64URL encoded**, not encrypted, meaning anyone can read their payload contents.

- **Why they are secure:** JWT security relies on **Integrity through Digital Signatures**, not secrecy.
- **How it works:**
  A standard JWT consists of three parts: `Header.Payload.Signature`. The signature is computed on the server using a secret key (or private key) over the Header and Payload:

$$\text{Signature} = \text{HMAC-SHA256}(\text{Header} + "." + \text{Payload}, \text{Secret})$$

If a user modifies any claim in the payload, the server detects the mismatch during verification and rejects the token.

- _Note:_ If sensitive/confidential data must be sent in a token, **JSON Web Encryption (JWE)** should be used instead of standard JWS.

---

### **Q45: How to ensure that a file can only be decrypted after a specific date?**

1. **Trusted Third-Party Key Release (Standard Commercial Approach):** Encrypt the file symmetrically. Store the decryption key on a secure Key Management Server (KMS) or Vault, configured with time-release policies to release the key only after the specified timestamp.
2. **Time-Lock Puzzles / Timed-Release Cryptography (Algorithmic Approach):** Encrypt data using a mathematical puzzle (e.g., sequential modular squarings) calibrated to require a precise amount of continuous CPU computation time that cannot be parallelized.
3. **Smart Contracts / Blockchain Timelocks:** Use decentralized smart contracts paired with decentralized oracles (e.g., Chainlink) to execute key releases automatically upon reaching a target block/timestamp.

---

### **Q46: What's the difference between OpenID and OAuth?**

| Feature               | OAuth 2.0                                                              | OpenID Connect (OIDC)                                                 |
| --------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Primary Goal**      | **Authorization** (Access delegation).                                 | **Authentication** (Identity verification).                           |
| **Question Answered** | _"What resources is this application allowed to access on my behalf?"_ | _"Who is this user?"_                                                 |
| **Key Artifact**      | **Access Token** (opaque or JWT format).                               | **ID Token** (always a formatted JWT containing user profile claims). |
| **Analogy**           | A hotel keycard giving access to Room 204.                             | A Passport/Driver's License proving identity.                         |
| **Relationship**      | Core framework protocol.                                               | An identity layer built directly **on top of** OAuth 2.0.             |

Here are detailed, interview-ready answers for questions **Q47 to Q62** and the **Code Challenges (Q1 to Q3)** from your image, covering advanced Application Security, WebSockets, Cryptography, and hands-on scenarios.

---

### **Q47: How does SSL/TLS work?**

SSL/TLS secures communications using a combination of **asymmetric** and **symmetric cryptography** during the **TLS Handshake**:

1. **Client Hello:** Client sends supported TLS versions, cipher suites, and a random string.
2. **Server Hello & Certificate:** Server responds with chosen settings, a random string, and its **SSL/TLS Certificate** containing its public key.
3. **Authentication:** Client validates the certificate against its trust store (CA root certificates).
4. **Key Exchange:** Client and server use asymmetric encryption (e.g., Diffie-Hellman or RSA) to securely derive a shared secret session key without transmitting it over the wire.
5. **Symmetric Encryption:** Both sides switch to fast, efficient **symmetric encryption** (e.g., AES-GCM) using the shared key for all subsequent HTTP traffic (HTTPS).

---

### **Q48: Explain briefly CORS (Cross-Origin Resource Sharing)?**

**CORS** is an HTTP-header-based security mechanism enforced by browsers. It allows a server to explicitly permit cross-origin requests (requests originating from a different domain, protocol, or port than the server's own).

- Without CORS headers, browsers enforce the **Same-Origin Policy (SOP)** and block front-end JavaScript scripts from reading resources fetched from external origins.
- For complex requests (e.g., `PUT`, `DELETE`, or custom headers), the browser sends an automatic **preflight `OPTIONS` request** first to check server permissions.

---

### **Q49: What is a Bug Bounty?**

A **Bug Bounty** program is a crowdsourced security initiative offered by organizations that rewards independent ethical hackers and security researchers with recognition or financial payouts (bounties) for discovering and reporting software vulnerabilities safely.

---

### **Q50: What is Stored XSS?**

**Stored (Persistent) XSS** occurs when malicious user input is permanently saved in a database, file, or log (e.g., in comment fields or user profiles). Whenever other users load that stored data, the browser executes the injected script within their session context automatically.

---

### **Q51: What is Reflected XSS?**

**Reflected (Non-Persistent) XSS** occurs when a malicious script is included in an HTTP request payload (typically via URL query parameters) and reflected directly back in the server’s response without validation. It requires tricking the target user into clicking a crafted malicious link.

---

### **Q52: What are X-Frame-Options?**

`X-Frame-Options` is an HTTP response header used to control whether a browser is allowed to render a page inside `<frame>`, `<iframe>`, `<embed>`, or `<object>` tags.

- **Directives:**
- `X-Frame-Options: DENY` (Blocks framing completely).
- `X-Frame-Options: SAMEORIGIN` (Only allows framing from the same origin).

- **Primary Use:** To prevent **Clickjacking** attacks.

---

### **Q53: What is Cross Site Tracing (XST)? How can it be prevented?**

- **What is XST?**
  Cross-Site Tracing occurs when an attacker combines an **XSS** vulnerability with the HTTP **`TRACE`** method. The `TRACE` method causes the web server to echo back the exact HTTP request it received, including `HttpOnly` cookies and custom headers that standard JavaScript is normally forbidden from reading.
- **How to Prevent It:** Disable the HTTP `TRACE` method on web servers (Nginx, Apache, IIS) and reverse proxies.

---

### **Q54: How to Prevent Breaches Due to Failure to Restrict URL Access?**

1. **Server-Side Access Control Checks:** Enforce authorization checks programmatically on every API endpoint and backend route.
2. **Deny by Default:** Design routing middleware so all paths require explicit permissions unless publicly specified.
3. **Role-Based Access Control (RBAC):** Map user tokens/roles to concrete permission checks on the server, not just conditionally hiding links in the front-end UI.

---

### **Q55: What is HSTS?**

**HTTP Strict Transport Security (HSTS)** is a web security policy header (`Strict-Transport-Security`) that forces web browsers to interact with the server **only via secure HTTPS connections**, automatically upgrading any `http://` attempts to `https://`.

- **Header Example:**

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

```

- **Prevents:** SSL stripping attacks and cookie hijacking during HTTP downgrades.

---

### **Q56: What are the types of XSS?**

1. **Stored XSS (Persistent):** Malicious code resides in backend storage/databases.
2. **Reflected XSS (Non-persistent):** Payload comes directly from the immediate HTTP request (URL parameters).
3. **DOM-based XSS:** Vulnerability lives purely in client-side JavaScript reading from unsafe sources (`location.search`) and writing to unsafe sinks (`innerHTML`).

---

### **Q57: Mention what is the basic design of OWASP ESAPI?**

**OWASP ESAPI (Enterprise Security API)** is an open-source security control library designed to help developers build secure applications.

- **Basic Design Principles:**
- **Abstraction & Encapsulation:** Provides simple interfaces for complex security controls (e.g., `Encoder`, `Validator`, `Encryptor`, `AccessController`).
- **Singleton Pattern:** Key components are instantiated once per application context using central configuration files (`ESAPI.properties`).
- **Framework Neutrality:** Decouples core security logic from underlying web frameworks.

---

### **Q58: How to use Content Security Policy (CSP) against clickjacking?**

Instead of legacy `X-Frame-Options`, modern clickjacking protection uses the CSP `frame-ancestors` directive:

```http
Content-Security-Policy: frame-ancestors 'none';

```

_(To allow framing only from the same domain: `frame-ancestors 'self';`)_

---

### **Q59: How to use CHAP Authentication (Challenge Response Authentication) for WebSockets?**

Challenge-Handshake Authentication Protocol (CHAP) protects against replay attacks over WebSockets:

1. **Handshake Setup:** Client establishes an initial connection.
2. **Challenge Sent:** Server generates and sends a cryptographically random string (a **nonce/challenge**).
3. **Response Generated:** Client hashes the nonce concatenated with their secret key/password ($\text{Response} = \text{Hash}(\text{Challenge} + \text{Secret})$) and sends it back.
4. **Verification:** Server computes the exact same hash locally. If they match, the WebSocket connection is authenticated without transmitting cleartext credentials.

---

### **Q60: How would you secure WebSockets communication on your project?**

1. **Use `wss://` (WebSocket Secure):** Encrypts WebSocket communication using TLS/SSL to prevent eavesdropping and MitM attacks.
2. **Authenticate Before Handshake:** Verify JWTs or session tokens passed via HTTP headers or query parameters during the initial HTTP upgrade request.
3. **Validate Input & Sanitize Data:** Treat incoming WebSocket messages as untrusted user input to avoid XSS or injection vulnerabilities.
4. **Origin Header Checking:** Verify the `Origin` header during handshake to prevent Cross-Site WebSocket Hijacking (CSWSH).
5. **Rate Limiting:** Protect WebSocket endpoints against message flooding attacks.

---

### **Q61: What is Content Security Policy (CSP)?**

An added layer of security (delivered via the `Content-Security-Policy` HTTP header) that allows site operators to restrict the resources (scripts, images, stylesheets) that the browser is allowed to load and execute. It is primarily used to mitigate **XSS** and **Clickjacking** attacks.

---

### **Q62: What is a Salt and How Does It Make Password Hashing More Secure?**

- **What is a Salt?**
  A **salt** is a cryptographically random, unique string appended to a plaintext password before hashing ($\text{Hash}(\text{Password} + \text{Salt})$).
- **Why it matters:**
- **Defeats Rainbow Tables:** Pre-computed hash lookup tables become useless because hashes differ per salt.
- **Prevents Duplicate Identical Hashes:** If two users share the password `Password123`, unique salts ensure their hashed values in the database are completely different.

---

## **Code Challenges**

### **Q1: Provide some "robots.txt" anti-pattern usage.**

`robots.txt` is designed to tell search engines which URLs to crawl; **it is publicly visible to everyone and does NOT enforce security**.

- **Anti-Pattern 1: Listing sensitive/hidden endpoints**

```txt
# BAD: Exposing administrative routes to attackers
User-agent: *
Disallow: /admin-secret-portal/
Disallow: /backup-db.sql
Disallow: /internal-api/v1/

```

- **Anti-Pattern 2: Relying on `robots.txt` for access control**
- Assuming that setting `Disallow: /admin` prevents users from visiting the path. Attacker bots completely ignore `robots.txt` rules.

---

### **Q2: How to check if HSTS is enabled?**

You can check if HSTS is configured using `curl` command-line tools or browser developer tools:

- **Using `curl` in Terminal:**

```bash
curl -I https://example.com

```

Look for the following header in the response:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains

```

- **Using Browser Developer Tools:** Open Network tab $\rightarrow$ Click main page request $\rightarrow$ Inspect Response Headers for `Strict-Transport-Security`.

---

### **Q3: How come that hash values are not reversible?**

Hash functions (like SHA-256) are **one-way mathematical functions** because they purposefully lose information during computation:

1. **Many-to-One Mapping (Pigeonhole Principle):** An infinite number of input strings map to a fixed number of output bits (e.g., 256 bits for SHA-256).
2. **Irreversible Mathematical Operations:** Hash functions rely on non-linear modular arithmetic and bitwise operations (like XOR, bit rotations, and modulo operations). For instance, if $X \pmod{10} = 4$, it is mathematically impossible to know whether $X$ was $4$, $14$, $24$, or $10004$ without external context.
