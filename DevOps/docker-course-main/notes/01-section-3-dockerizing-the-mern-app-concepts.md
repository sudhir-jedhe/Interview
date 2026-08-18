# Section 3 — Dockerizing the MERN App — Concepts

## Introduction

A MERN application is not a single process. It is a small system made of multiple moving parts. In this course, the application has three runtime pieces:

- a **client** service for the React + Vite frontend
- a **server** service for the Express + TypeScript backend
- a **mongo** service for the MongoDB database

Dockerizing the app means giving each of these parts a predictable runtime environment. Instead of relying on whatever is installed on a laptop, the application is packaged into images and started as containers.

The goal of this section is not to make the stack “production-ready” yet. The goal is to understand the first clean container version of each part.

---

## 1) Understanding which parts get containerized

The frontend and backend are application code. They are natural candidates for custom Docker images because they follow a familiar application lifecycle:

1. copy the source code
2. install dependencies
3. build if needed
4. start the app

MongoDB is different. It is not just code that runs and exits. It owns data. That difference changes how it should be treated.

A good mental model is:

- **frontend** = code that can be rebuilt and replaced
- **backend** = code that can be rebuilt and replaced
- **database** = data that must survive replacement of the container

That is why the course uses custom images for the client and server, but uses the official MongoDB image for the database.

---

## 2) Stateless and stateful containers

One of the most important beginner Docker ideas is the difference between **stateless** and **stateful** containers.

### Stateless containers

A stateless container does not own critical long-term business data. If the container is removed and recreated, the application can still work as long as the image and configuration remain available.

In this course:

- the frontend is stateless
- the backend is stateless

That does not mean they store nothing in memory while running. It means they do not own durable data that must survive container replacement.

### Stateful containers

A stateful container works with durable data that should not disappear when the container is recreated.

In this course:

- MongoDB is stateful

This is why the MongoDB container should not depend on the writable layer of the container alone. The data files need persistent storage outside the container lifecycle. That is where a named volume comes in.

The practical rule is simple:

- the **Mongo container** can be replaced
- the **Mongo data** should stay outside that container’s disposable layer

---

## 3) Reading a Dockerfile as a packaging recipe

A Dockerfile should not be seen as a random list of commands. It is a packaging recipe that explains how an image is built.

The beginner-friendly instruction flow is:

`FROM -> WORKDIR -> COPY -> RUN -> EXPOSE -> CMD`

### `FROM`

This selects the base image. For the Node services in this course, the base image is `node:20-alpine`.

Why use it?

- Node is already installed
- Alpine keeps the image lightweight
- it is common and easy to explain

### `WORKDIR`

This sets the working directory inside the image. All following commands run relative to that folder.

It keeps the image organized and avoids writing long absolute paths in every step.

### `COPY`

This copies files from the project into the image.

A very useful Docker habit is:

1. copy `package.json` and `package-lock.json` first
2. install dependencies
3. copy the rest of the source code

This order helps Docker reuse cached layers when dependencies do not change.

### `RUN`

This executes build-time commands inside the image, such as:

- `npm install`
- `npm run build`

These commands happen while the image is being created, not when the container is already running for users.

### `EXPOSE`

This documents which port the application listens on inside the container.

Important distinction:

- `EXPOSE` documents the internal port
- it does **not** publish the port to the host by itself

### `CMD`

This defines the default startup command for the container.

This is what runs when the container starts.

---

## 4) Mapping the backend to a Docker image

The backend is an Express + TypeScript application. To run it inside Docker, the image must do the following:

- start from a Node base image
- create a working directory
- copy package files
- install dependencies
- copy the source code
- build the TypeScript project
- expose port `5000`
- start the backend process

At this stage, the backend image is intentionally simple. It is not yet optimized for production size. That optimization comes later in the multi-stage build section.

For now, clarity matters more than sophistication.

---

## 5) Mapping the frontend to a Docker image

The frontend is also built with Node, but its runtime shape is different from the backend.

The frontend Dockerfile must:

- start from a Node base image
- accept a frontend API URL at build time
- install dependencies
- copy the source code
- build the Vite app
- serve the built app

In this section, the simplest teaching version uses **Vite preview** as the server. This is not the final production approach, but it is a straightforward first step because it keeps the first Dockerized version easy to understand.

Later, this will be replaced by Nginx.

---

## 6) Why `VITE_API_URL` matters

Frontend configuration is not the same as backend configuration.

The backend reads environment variables at runtime when the server process starts.

The frontend, in a Vite app, behaves differently. Values prefixed with `VITE_` are baked into the frontend build. That means the value must be available during the image build process, not only after the container starts.

So these two cases are different:

- backend runtime config -> read when the server starts
- frontend build config -> embedded when the frontend is built

This is why the frontend Dockerfile uses a build argument such as `VITE_API_URL`.

---

## 7) Why the first manual setup feels repetitive

By the end of this section, all three parts can run in containers, but the workflow is still manual.

The student has to remember:

- which image to build
- which container names to use
- which ports to publish
- which environment variables to pass
- how the backend reaches MongoDB
- how MongoDB keeps its data

That friction is not a mistake. It is useful because it makes the value of Docker Compose obvious in the next section.

---

## Key takeaway

After this section, the student should understand four core ideas clearly:

1. a MERN stack is made of multiple runtime parts, not one app
2. frontend and backend are stateless, but MongoDB is stateful
3. a Dockerfile is a packaging recipe, not just a shell script
4. a manually containerized stack works, but it becomes cumbersome quickly

That is the transition point into Compose.
