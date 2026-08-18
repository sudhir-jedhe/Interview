# Section 4 — Docker Compose — Wiring the Stack Together — Concepts

## Introduction

After Dockerizing the frontend, backend, and database separately, the application works, but the workflow is still clumsy. Starting the full stack means remembering multiple commands, multiple ports, and multiple configuration values.

Docker Compose solves that problem by describing the entire application stack in one file.

The purpose of this section is to move from **individual containers** to **one coordinated multi-container application**.

---

## 1) Why running multi-container apps manually does not scale well

A MERN stack is not one command. It is a group of related services.

In the manual setup, the student has to:

- start MongoDB separately
- start the backend separately
- start the frontend separately
- remember the correct ports
- remember the correct environment variables
- keep container names consistent
- rebuild individual images when changes happen

This is manageable once or twice, but it becomes frustrating as the project grows. The stack needs a single source of truth.

That is exactly what Compose provides.

---

## 2) What `docker-compose.yml` represents

A Compose file is a structured description of the full application stack.

Instead of starting containers one by one, the student defines the stack in a single file:

- which services exist
- how each service is built or pulled
- which ports are published
- which environment variables are passed
- which services depend on each other
- which volumes are used

Once that file exists, Docker Compose can recreate the same stack repeatedly.

This is the key value: **repeatability**.

---

## 3) Understanding services in Compose

In Compose, each runtime piece of the application becomes a service.

For this course, the service list is simple:

- `mongo`
- `server`
- `client`

Each service has its own configuration, but they all belong to the same application definition.

This is a major upgrade over the manual approach because the stack is no longer defined by memory or terminal history. It is defined in code.

---

## 4) The practical role of networks in Compose

A beginner does not need deep Docker networking theory to be productive with Compose.

The practical rule is enough:

- services started by the same Compose project can talk to each other on an internal network
- they can use the **service name** as the hostname

That leads to very useful application URLs such as:

- backend reaching MongoDB via `mongodb://mongo:27017/...`
- Nginx later reaching the backend via `http://server:5000`

This is much cleaner than routing traffic through the host machine.

---

## 5) The practical role of volumes in Compose

The MERN stack still contains one stateful part: MongoDB.

That means the database still needs persistent storage. Compose makes this easier by declaring a named volume directly in the application file.

The practical meaning is:

- the MongoDB service uses a named volume
- the database files survive container recreation
- the storage configuration becomes part of the same stack definition

The student no longer has to remember to create and mount the volume separately each time.

---

## 6) Why the root `.env` file helps

A Compose file becomes easier to maintain when frequently changing values live in a root `.env` file.

Typical examples:

- server port
- client port
- MongoDB connection string
- frontend API URL

This separation gives two benefits:

1. the Compose file stays focused on the stack structure
2. environment-specific values can change without rewriting the service definitions

This also introduces students to a useful configuration pattern they will keep using later.

---

## 7) Why Compose becomes the normal daily workflow

Once the stack is described in Compose, the daily workflow becomes much simpler.

Common commands now look like:

- `docker compose up --build`
- `docker compose up -d`
- `docker compose logs`
- `docker compose down`

That is a major quality-of-life improvement because the student stops thinking in terms of three unrelated containers and starts thinking in terms of one application stack.

---

## Key takeaway

By the end of this section, the student should understand the following shift clearly:

- before Compose -> separate containers managed manually
- after Compose -> one application stack described in one file

That shift is not only about convenience. It is also the foundation for later production deployment, because real deployments depend on consistent stack definitions.
