To redirect a webpage from HTTP to HTTPS using JavaScript, you can use the `location.protocol` property to check the current protocol. If the protocol is not `https:`, you can construct the HTTPS version of the URL using `location.href` and perform a redirect using `location.replace()`. 

Here’s the code explained and implemented:

### Code Explanation
1. **`location.protocol`:** This gives the current protocol, e.g., `http:` or `https:`.
2. **`location.replace()`:** This changes the current page without adding the original page to the browser's history, ensuring the back button won't lead back to the HTTP version.
3. **`location.href.split('//')`:** This separates the protocol (`http:`) from the rest of the URL to construct the HTTPS version.

### JavaScript Code
```javascript
const httpsRedirect = () => {
  if (location.protocol !== 'https:') {
    // Construct the HTTPS URL
    const secureURL = 'https://' + location.href.split('//')[1];
    location.replace(secureURL); // Redirect to the HTTPS version
  }
};

// Execute the redirect
httpsRedirect();
```

### Example Scenario
- If the user visits `http://example.com/page`, the script redirects them to `https://example.com/page`.

### **Key Considerations**
1. **Server Configuration:** This client-side redirect should ideally be complemented with server-side HTTPS enforcement using HTTP 301 (permanent redirect) responses to ensure security.
2. **SEO Impact:** Search engines prefer server-side redirects, as they are faster and more reliable for indexing.
3. **Browser Behavior:** Modern browsers block certain scripts on HTTP pages, which might prevent this redirect from executing. Using server-side enforcement avoids such issues.

This approach is useful for client-side redirection but is best used as a fallback to proper server-side HTTPS enforcement.