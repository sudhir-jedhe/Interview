Configuring secure CORS with dynamic origin whitelisting requires validating the incoming `Origin` header against an approved list or regex (e.g., staging subdomains, production domains, and local development ports), setting credentials appropriately, handling `OPTIONS` preflight caching, and exposing necessary response headers.

Never reflect arbitrary origins (`req.headers.origin`) blindly alongside `credentials: true`.

---

### 1. Node.js Implementations

#### Option A: Fastify (`@fastify/cors`)

Fastify's official CORS plugin supports callback-driven dynamic origin validation and automatic preflight handling.

```bash
npm install @fastify/cors

```

```typescript
// server.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });

const ALLOWED_ORIGINS = new Set([
  'https://app.example.com',
  'https://admin.example.com',
  'http://localhost:3000',
  'http://localhost:5173',
]);

// Optional: Regex for preview/staging deployments (e.g., Vercel / PR previews)
const STAGING_ORIGIN_REGEX = /^https:\/\/preview-[a-z0-9]+-myorg\.vercel\.app$/;

app.register(cors, {
  origin: (origin, cb) => {
    // Allow non-browser tools (e.g., Postman, curl, server-to-server) where origin is undefined
    if (!origin) {
      cb(null, true);
      return;
    }

    if (ALLOWED_ORIGINS.has(origin) || STAGING_ORIGIN_REGEX.test(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS policy'), false);
    }
  },
  credentials: true, // Enables Access-Control-Allow-Credentials
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'X-Trace-Id',
  ],
  exposedHeaders: ['X-Total-Count', 'X-RateLimit-Remaining'],
  maxAge: 86400, // Cache preflight OPTIONS responses for 24 hours (in seconds)
  preflightContinue: false,
});

app.get('/api/profile', async (request, reply) => {
  return { user: 'Alice', email: 'alice@example.com' };
});

const start = async () => {
  await app.listen({ port: 8080, host: '0.0.0.0' });
};
start();

```

---

#### Option B: Express (`cors` package)

```bash
npm install cors
npm install -D @types/cors

```

```typescript
// server.ts
import express, { Request, Response } from 'express';
import cors, { CorsOptionsDelegate } from 'cors';

const app = express();

const ALLOWED_ORIGINS = new Set([
  'https://app.example.com',
  'https://admin.example.com',
  'http://localhost:3000',
  'http://localhost:5173',
]);

const STAGING_ORIGIN_REGEX = /^https:\/\/preview-[a-z0-9]+-myorg\.vercel\.app$/;

const dynamicCorsOptions: CorsOptionsDelegate<Request> = (req, callback) => {
  const origin = req.header('Origin');

  // Allow requests with no origin (like mobile apps, curl, server-side jobs)
  if (!origin) {
    callback(null, { origin: true });
    return;
  }

  const isAllowed = ALLOWED_ORIGINS.has(origin) || STAGING_ORIGIN_REGEX.test(origin);

  if (isAllowed) {
    callback(null, {
      origin: true, // Reflects the matching incoming origin
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Trace-Id'],
      exposedHeaders: ['X-Total-Count', 'X-RateLimit-Remaining'],
      maxAge: 86400,
    });
  } else {
    // Deny CORS by passing false (does not send Access-Control headers)
    callback(null, { origin: false });
  }
};

app.use(cors(dynamicCorsOptions));

// Handle preflights for all routes
app.options('*', cors(dynamicCorsOptions));

app.get('/api/profile', (req: Request, res: Response) => {
  res.json({ user: 'Alice', email: 'alice@example.com' });
});

app.listen(8080, () => console.log('Server running on port 8080'));

```

---

### 2. Spring Boot Implementation (Java / Kotlin)

In Spring Boot 3.x / Spring Framework 6.x with Spring Security, configure a dynamic `CorsConfigurationSource` inside the `SecurityFilterChain`.

#### `SecurityConfig.java`

```java
package com.example.demo.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Set<String> STATIC_ALLOWED_ORIGINS = Set.of(
            "https://app.example.com",
            "https://admin.example.com",
            "http://localhost:3000",
            "http://localhost:5173"
    );

    private static final Pattern STAGING_ORIGIN_PATTERN = 
            Pattern.compile("^https://preview-[a-z0-9]+-myorg\\.vercel\\.app$");

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(dynamicCorsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Adjust based on your session/token strategy
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource dynamicCorsConfigurationSource() {
        return (HttpServletRequest request) -> {
            String originHeader = request.getHeader("Origin");

            if (originHeader == null) {
                // Non-browser request; standard configuration
                return null;
            }

            boolean isAllowed = STATIC_ALLOWED_ORIGINS.contains(originHeader)
                    || STAGING_ORIGIN_PATTERN.matcher(originHeader).matches();

            if (isAllowed) {
                CorsConfiguration config = new CorsConfiguration();
                // Set explicitly to the matching origin (never use "*" with allowCredentials)
                config.setAllowedOrigins(List.of(originHeader));
                config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(Arrays.asList(
                        "Content-Type",
                        "Authorization",
                        "X-Requested-With",
                        "Accept",
                        "X-Trace-Id"
                ));
                config.setExposedHeaders(Arrays.asList("X-Total-Count", "X-RateLimit-Remaining"));
                config.setAllowCredentials(true);
                config.setMaxAge(86400L); // 24 hours in seconds
                return config;
            }

            // Return null or empty configuration to reject non-whitelisted origins
            return null;
        };
    }
}

```

---

### 3. Security Checklist for Dynamic CORS

* **Never Use Substring or `endsWith()` Matching:**
* ❌ *Vulnerable:* `origin.endsWith("example.com")` allows attackers to register `evil-example.com` or `attacker-example.com`.
* ✅ *Secure:* Use exact set lookup (`ALLOWED_ORIGINS.has(origin)`) or strict anchor-bounded Regex (`^https:\/\/[a-z0-9-]+\.example\.com$`).

* **Handle Null / Port / Protocol Matching:**
* Remember that `http://localhost:3000` and `https://localhost:3000` are completely separate origins.
* Explicitly test the scheme (`https://` vs `http://`).

* **`Vary: Origin` Header:**
* When caching responses via an upstream CDN or reverse proxy (Nginx, Cloudflare), verify your server sends `Vary: Origin` so cached responses for Origin A are not mistakenly served to Origin B.
