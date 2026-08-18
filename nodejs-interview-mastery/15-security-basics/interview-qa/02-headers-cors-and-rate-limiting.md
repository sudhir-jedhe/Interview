# Interview Q&A: Security Headers, CORS, and Rate Limiting

**Q: What does `helmet()` actually do?**

It's a collection of small middleware functions, each setting one security-related HTTP response header with sensible defaults — things like `Strict-Transport-Security` (force HTTPS), `X-Content-Type-Options: nosniff` (block MIME-sniffing), frame-ancestors/`X-Frame-Options` (clickjacking protection), and a configurable `Content-Security-Policy`. It's not a firewall or a magic fix for XSS/injection — it reduces the impact of certain attack classes and closes some low-effort information-disclosure issues (like the `X-Powered-By` header).

**Q: Why is `Access-Control-Allow-Origin: '*'` combined with credentials dangerous?**

If a wildcard origin were honored alongside credentialed requests, any website could make an authenticated request to your API using a victim's cookies and read the response — defeating the same-origin protections CORS exists to provide. Browsers actually refuse this combination at the spec level, but developers work around it by dynamically reflecting the request's `Origin` header back as the allowed origin, which technically satisfies the spec while behaving exactly like an unrestricted wildcard for credentialed requests.

**Q: Why does rate limiting matter, and where should it be applied most aggressively?**

It throttles how many requests a client can make in a time window, blunting brute-force credential guessing and basic denial-of-service attempts. Apply the strictest limits on sensitive, low-cost-to-abuse endpoints — login, password reset, signup — since those are the ones attackers automate against; general read-only API traffic can tolerate a looser limit.
