✅ 7 Common Front End security attacks:

1. Cross-site scripting (XSS):
   It is a type of attack that injects malicious client-side code. For example, an attacker could input JavaScript that steals user cookies into a comment form that doesn't sanitize entries. When victims load the compromised page, the script executes to give the attacker access to user accounts.

2. Dependency risks:
   Front-end apps rely on many third-party libraries and components. If these have vulnerabilities, they undermine the whole app. Using outdated dependencies with known issues is a common developer oversight.

3. Cross-site request forgery (CSRF):
   These force victims to execute unwanted actions in an app they're logged into. For example, an attacker could trick users with a disguised link that quietly transfers funds from their account using their stored credentials.

4. Clickjacking:
   Uses transparent overlays on a trusted page to trick users into clicking on something different than they perceive. For example, an attacker could overlay a transfer funds button on a cat video's play button.

5. CDN tampering:
   If libraries are loaded from external CDNs, attackers could modify them there to inject malicious code that then gets downloaded by app users.

6. HTTPS downgrades:
   Stripping away HTTPS encryption facilitates spying on user traffic. Attackers exploit bugs or lack of HSTS headers to downgrade HTTP requests to plain unprotected HTTP.

7. Man-in-the-middle attacks:
   The attacker secretly relays and possibly alters the way two parties believe they are communicating. This enables spying and spreading of false information between victims.
