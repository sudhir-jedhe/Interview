# Section 4 — Docker Compose — Wiring the Stack Together — Practical Implementation

## Introduction

In this section, the individual frontend, backend, and database containers are replaced by one Compose-managed stack.

The result is a cleaner development workflow:

- one file describes the application
- one command starts the application
- one command stops the application

---

## Practical 1 — Create `docker-compose.yml`

### Objective

Describe the full MERN stack in one Compose file.

### File

`docker-compose.yml`

### Content

```yaml
services:
  mongo:
    image: mongo:8
    volumes:
      - mongo-data:/data/db

  server:
    build:
      context: ./server
    environment:
      PORT: ${SERVER_PORT}
      MONGODB_URI: ${MONGODB_URI}
    depends_on:
      - mongo
    ports:
      - "${SERVER_PORT}:${SERVER_PORT}"

  client:
    build:
      context: ./client
      args:
        VITE_API_URL: ${VITE_API_URL}
    depends_on:
      - server
    ports:
      - "${CLIENT_PORT}:4173"

volumes:
  mongo-data:
```

### How to read this file

- `mongo` uses the official MongoDB image
- `server` is built from the local backend folder
- `client` is built from the local frontend folder
- `mongo-data` is the named volume for database persistence

### Why this is better than manual `docker run`

The entire stack now lives in one file. This makes it easier to start, stop, rebuild, and share the project setup.

---

## Practical 2 — Add the root `.env` file

### Objective

Store the frequently changing configuration values in one place.

### File

`.env`

### Content

```env
SERVER_PORT=5000
CLIENT_PORT=4173
MONGODB_URI=mongodb://mongo:27017/docker_course_demo
VITE_API_URL=http://localhost:5000
```

### What each value means

- `SERVER_PORT` -> host and container port for the backend
- `CLIENT_PORT` -> host port for the frontend
- `MONGODB_URI` -> backend runtime connection string
- `VITE_API_URL` -> frontend build-time API base URL

### Important detail

The hostname `mongo` works here because Compose creates an internal network where services can find each other by service name.

---

## Practical 3 — Start the full stack

### Command

```bash
docker compose up --build
```

### What this command does

- reads the Compose file
- builds local images where required
- pulls `mongo:8` if needed
- creates the internal network
- creates the named volume
- starts the three services together

### Expected result

The terminal shows logs from the three services, and the full stack starts as one coordinated application.

---

## Practical 4 — Run the stack in detached mode

### Command

```bash
docker compose up -d --build
```

### Why detached mode matters

Detached mode is useful once the stack is stable because it allows the terminal to be used for other work while the containers keep running in the background.

---

## Practical 5 — View logs

### View logs for the full stack

```bash
docker compose logs
```

### View logs for a single service

```bash
docker compose logs mongo
docker compose logs server
docker compose logs client
```

### Why this is helpful

Logs are still one of the quickest ways to debug:

- startup failures
- missing environment variables
- database connection problems
- frontend server issues

Compose keeps this easier because it already knows which containers belong to the application.

---

## Practical 6 — Stop the stack

### Command

```bash
docker compose down
```

### What this does

- stops the containers
- removes the containers created by Compose
- keeps the named volume unless it is removed explicitly

### Why the volume remains

MongoDB data should survive normal stop/start cycles. That is why the volume is not removed by default.

---

## Practical 7 — Perform a full reset when needed

### Command

```bash
docker compose down -v
```

### What changes here

This does everything from `docker compose down`, but also removes the named volumes created by the stack.

### When to use it

Use this only when a completely fresh database is needed. It is not the normal daily workflow.

---

## Practical 8 — Verify the application end-to-end

### Open the frontend

```txt
http://localhost:4173
```

### Check the backend health route

```txt
http://localhost:5000/api/health
```

### Verify application behavior

- load the frontend in the browser
- perform an action that writes data
- refresh and confirm the data still exists

### What this proves

- the frontend is running
- the backend is running
- the backend can reach MongoDB by service name
- MongoDB data persists through the named volume

---

## What changed after adopting Compose

The stack is now easier to operate because:

- one file defines the application
- one command starts the application
- one command stops the application
- service names replace temporary networking workarounds
- persistent database storage is part of the same stack definition

This is the first point where the application starts to feel organized rather than manually assembled.
