# Section 3 — Dockerizing the MERN App — Practical Implementation

## Introduction

This section turns the MERN application into three runnable container pieces:

- a backend image
- a frontend image
- an official MongoDB container backed by a named volume

The goal is not elegance yet. The goal is to get each part running in Docker and understand what each container is responsible for.

---

## Practical 1 — Create the backend Dockerfile

### Objective

Package the Express + TypeScript backend into a simple Docker image.

### File

`server/Dockerfile`

### Content

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### What this file does

- starts from a Node 20 Alpine base image
- creates `/app` as the working folder
- installs dependencies
- copies the backend source code
- builds the TypeScript output
- documents port `5000`
- starts the backend with the default start command

### Why this version is enough for now

This is a learning-friendly image:

- easy to read
- easy to build
- good enough for the first containerized version
- intentionally not optimized yet

### Build command

```bash
docker build -t docker-course-server ./server
```

### Expected result

Docker creates an image named `docker-course-server`.

---

## Practical 2 — Add a backend `.dockerignore`

### Objective

Prevent unnecessary files from being sent into the Docker build context.

### File

`server/.dockerignore`

### Content

```txt
node_modules
dist
.env
.git
npm-debug.log
```

### Why this matters

This keeps the image build cleaner because Docker does not need to copy local noise such as:

- installed dependencies from the host
- build output from the host
- Git metadata
- environment files

A smaller build context usually means faster and cleaner image builds.

---

## Practical 3 — Create the frontend Dockerfile

### Objective

Build the Vite frontend inside Docker and serve it in the simplest possible way for now.

### File

`client/Dockerfile`

### Content

```dockerfile
FROM node:20-alpine

WORKDIR /app

ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
```

### What this file does

- starts from a Node base image
- accepts a build-time frontend API URL
- installs frontend dependencies
- copies the Vite source code
- builds the production bundle
- starts Vite preview on port `4173`

### Why the API URL is passed here

The Vite frontend needs its API URL during the build. That is why `ARG` and `ENV` are used inside the Dockerfile.

### Build command

```bash
docker build --build-arg VITE_API_URL=http://localhost:5000 -t docker-course-client ./client
```

### Expected result

Docker creates an image named `docker-course-client`.

---

## Practical 4 — Add a frontend `.dockerignore`

### Objective

Keep the frontend build context clean.

### File

`client/.dockerignore`

### Content

```txt
node_modules
dist
.env
.git
npm-debug.log
```

### Why this matters

The reason is the same as for the backend:

- faster context upload to Docker
- less accidental file copying
- fewer confusing local artifacts inside the image build

---

## Practical 5 — Start MongoDB from the official image with a named volume

### Objective

Run the database as a container and make sure its data survives container replacement.

### Create the volume

```bash
docker volume create mongo-data
```

### Start the MongoDB container

```bash
docker run -d --name mongo --mount source=mongo-data,target=/data/db -p 27017:27017 mongo:8
```

### What changed after this step

- MongoDB is now running as a container
- its data is stored in the named volume `mongo-data`
- deleting and recreating the container does not automatically remove the database files

### Why the volume matters

MongoDB is stateful. Without persistent storage, the database would lose its contents when the container is removed.

---

## Practical 6 — Build and run the backend container

### Build the backend image

```bash
docker build -t docker-course-server ./server
```

### Run the backend container

```bash
docker run -d --name server -e PORT=5000 -e MONGODB_URI=mongodb://host.docker.internal:27017/docker_course_demo -p 5000:5000 docker-course-server
```

### What to understand here

- `PORT=5000` tells the backend which internal port to listen on
- `MONGODB_URI` points the backend to MongoDB
- `-p 5000:5000` publishes backend port `5000` to the host
- the image name at the end tells Docker which image to run

### Temporary networking note

At this stage, the backend is still connecting to MongoDB through a host-based path. That is only a transitional setup for the “manual containers” stage.

The next section removes this workaround by letting containers communicate by service name.

---

## Practical 7 — Build and run the frontend container

### Build the frontend image

```bash
docker build --build-arg VITE_API_URL=http://localhost:5000 -t docker-course-client ./client
```

### Run the frontend container

```bash
docker run -d --name client -p 4173:4173 docker-course-client
```

### What to understand here

- the frontend bundle was built with `http://localhost:5000` as the backend base URL
- the container exposes port `4173`
- the browser will open the frontend through that host port

At this point, the browser talks to the frontend on port `4173`, and the frontend talks to the backend on port `5000`.

---

## Practical 8 — Verify that the full stack is working

### Open the frontend

```txt
http://localhost:4173
```

### Check the backend health endpoint

```txt
http://localhost:5000/api/health
```

### View logs if something fails

```bash
docker logs mongo
docker logs server
docker logs client
```

### What should be true now

- MongoDB is running
- the backend is reachable
- the frontend loads in the browser
- the app can talk end-to-end

---

## What this section proves

By the end of this section, the student has a working but manually managed stack.

That manual workflow has obvious limitations:

- three containers must be managed separately
- container names must be remembered
- ports must be published manually
- environment values must be passed manually
- storage must be remembered for MongoDB
- container-to-container communication is still awkward

That friction is useful. It creates the exact need for Docker Compose in the next section.
