# Section 5 — Production-Ready Docker Images — Concepts

## Introduction

The images created in the earlier sections were useful for learning, but they were not the final shape that should be deployed to production.

A beginner-friendly image and a production-shaped image are not always the same thing.

This section upgrades both the backend and frontend images so that they more closely match how real deployments are structured.

---

## 1) Why dev-shaped images should not be the final production images

The earlier images were intentionally simple. That simplicity helped learning, but it also left some inefficiencies in place.

Typical issues with development-shaped images include:

- unnecessary dependencies remaining in the final runtime image
- larger image size than needed
- the frontend being served by Vite preview instead of a dedicated web server
- build responsibilities and runtime responsibilities living in the same image stage

These are normal stepping stones in learning Docker. The next step is to separate concerns more clearly.

---

## 2) What a multi-stage build actually solves

A multi-stage build separates the **build environment** from the **runtime environment**.

### Builder stage

The builder stage contains everything needed to create the application artifact:

- install dependencies
- run TypeScript compilation
- run frontend build commands

This stage is allowed to be heavier because it exists only during image creation.

### Runtime stage

The runtime stage contains only what is required to run the final application.

This makes the final image:

- smaller
- cleaner
- easier to reason about
- closer to production needs

The core idea is simple: **build with one environment, run with another**.

---

## 3) Why the backend benefits from a multi-stage build

The backend source code is written in TypeScript, but production does not need the full TypeScript toolchain once the build is finished.

A cleaner backend image therefore looks like this:

- stage one installs dependencies and builds the TypeScript output
- stage two installs only runtime dependencies
- only the built JavaScript output is copied into the final image

This avoids carrying more than necessary into the runtime image.

---

## 4) Why the frontend benefits even more from a multi-stage build

A Vite application is built into static files such as HTML, CSS, and JavaScript assets.

That means the runtime environment does not need Node for serving the final app. It only needs a web server that can serve static files efficiently.

This leads to the standard production pattern:

- stage one builds the frontend with Node
- stage two serves the generated files with Nginx

This is one of the clearest examples of why multi-stage builds are useful.

---

## 5) Why Nginx replaces Vite preview

Vite preview is useful as a quick testing server. It is not the ideal production web server pattern for this course.

Nginx is a better fit because it can:

- serve static files efficiently
- support SPA fallback routing
- act as a reverse proxy for API requests

That lets the application behave like one public website even though it still contains multiple internal services.

---

## 6) Understanding Nginx as a reverse proxy

With Nginx in front of the application:

- the browser talks to the frontend container on port `80`
- Nginx serves the built frontend files directly
- requests to `/api` are forwarded to the backend service

This creates a cleaner public architecture:

- the browser sees one entry point
- the backend port no longer needs to be public
- MongoDB remains internal as well

This is a more production-shaped design than exposing every service separately.

---

## 7) Why `/api` becomes a cleaner frontend base URL

When Nginx is responsible for both frontend file serving and backend proxying, the frontend can simply use `/api` as its base URL.

That is useful because:

- the browser stays on one origin
- frontend deployment becomes easier to reason about
- many CORS issues are avoided
- the public architecture is cleaner

So the frontend production build shifts from a host-specific backend URL to a path-based API URL.

---

## Key takeaway

This section is not about making the stack more complicated. It is about making the image boundaries more accurate.

The student should leave this section with three clear ideas:

1. production images should be leaner than beginner images
2. multi-stage builds separate build work from runtime work
3. Nginx gives the frontend a proper production-shaped runtime and a clean reverse-proxy layer
