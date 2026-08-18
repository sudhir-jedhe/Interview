# Section 5 — Production-Ready Docker Images — Practical Implementation

## Introduction

This section upgrades the earlier Docker setup into a more production-shaped stack.

The key changes are:

- the backend image becomes a multi-stage build
- the frontend image becomes a multi-stage build
- Nginx replaces Vite preview
- only the frontend service publishes a public port

---

## Practical 1 — Rewrite the backend Dockerfile as a multi-stage build

### Objective

Create a smaller and cleaner backend runtime image by separating build work from runtime work.

### File

`server/Dockerfile`

### Content

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

### How to read this file

#### Builder stage
- installs all dependencies
- copies the source code
- builds the TypeScript output

#### Runtime stage
- starts from a fresh Node image
- installs only production dependencies
- copies only the built `dist` folder
- runs the compiled server

### Why this is better

The final image is cleaner because the runtime stage does not need to carry the full development setup.

---

## Practical 2 — Rewrite the frontend Dockerfile as a multi-stage build

### Objective

Build the Vite frontend with Node and serve the final static assets with Nginx.

### File

`client/Dockerfile`

### Content

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### What changed compared to the earlier version

- Node is still used to build the app
- Nginx is now used to serve the built app
- the public container port becomes `80`
- the production build uses `/api` as the API base URL

### Why `/api` is cleaner here

Because Nginx will sit in front of the application, the browser can call `/api` and let Nginx forward those requests to the backend.

---

## Practical 3 — Add the Nginx configuration

### Objective

Configure Nginx to serve the frontend and proxy API traffic to the backend service.

### File

`client/nginx/default.conf`

### Content

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }

  location /api/ {
    proxy_pass http://server:5000;
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### What each part is doing

- `listen 80` -> Nginx listens on the standard HTTP port inside the container
- `root` -> points to the folder that contains the frontend build output
- `try_files $uri /index.html` -> supports SPA routing
- `location /api/` -> matches API requests
- `proxy_pass http://server:5000` -> forwards those requests to the backend by Compose service name

### Why the service name matters

Nginx and the backend live on the same Compose network, so `server` is enough to reach the backend container.

---

## Practical 4 — Adjust the frontend API fallback

### Objective

Let the frontend work cleanly in both local development and production-shaped Docker mode.

### File

`client/src/App.tsx`

### Change

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});
```

### Why this is useful

- during local development, a specific backend URL can still be used
- during the Docker production-shaped build, `/api` becomes the default
- the same frontend code works in both environments

---

## Practical 5 — Update `docker-compose.yml` for the production-shaped local stack

### Objective

Use the improved images locally and expose only the frontend service to the browser.

### File

`docker-compose.yml`

### Content

```yaml
services:
  mongo:
    image: mongo:8
    restart: unless-stopped
    volumes:
      - mongo-data:/data/db

  server:
    build:
      context: ./server
    restart: unless-stopped
    environment:
      PORT: 5000
      MONGODB_URI: mongodb://mongo:27017/docker_course_demo
    depends_on:
      - mongo

  client:
    build:
      context: ./client
      args:
        VITE_API_URL: /api
    restart: unless-stopped
    depends_on:
      - server
    ports:
      - "80:80"

volumes:
  mongo-data:
```

### What changed in this Compose file

- the backend no longer publishes its port to the host
- MongoDB remains internal
- the frontend publishes port `80`
- the browser enters through Nginx, not directly through the backend

### Why only the client publishes a port now

This matches the production-shaped architecture:

- browser -> frontend container
- frontend container -> backend service
- backend service -> MongoDB service

---

## Practical 6 — Run the production-shaped stack locally

### Start the stack

```bash
docker compose up --build
```

### Or run it in detached mode

```bash
docker compose up -d --build
```

### What to verify

- open `http://localhost`
- confirm the frontend loads
- confirm API requests succeed
- confirm the backend port is not directly exposed
- confirm MongoDB still persists data through the named volume

---

## Practical 7 — Understand the outcome

By the end of this section, the application behaves more like a production deployment:

- the backend image has a clean build/runtime split
- the frontend image has a clean build/runtime split
- Nginx becomes the frontend runtime
- the browser sees one public entry point
- internal services stay internal

This is the version of the stack that makes sense to carry forward into VPS deployment.
