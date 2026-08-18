# Section 6 — Deploying to VPS with Docker — Concepts

## Introduction

So far, the Dockerized MERN application has been running locally. The next step is to move it onto a real remote machine.

That machine is the VPS.

The purpose of this section is to explain what changes when the stack stops running on a laptop and starts running on a server that is reachable from the internet.

---

## 1) What a VPS does in this workflow

A VPS, or Virtual Private Server, is the remote host where the application will run continuously.

In this course, the VPS becomes responsible for:

- storing and running the final containers
- exposing the app publicly
- acting as the production host for the stack

It is not meant to be the place where the developer edits code. It is the place where the already-packaged application runs.

---

## 2) Why Docker makes VPS deployment easier

Without Docker, deploying to a server often means recreating the local environment by hand:

- install Node
- install the right npm version
- install frontend tooling
- install MongoDB
- keep all versions aligned

Docker avoids most of that repetition.

With Docker:

- the application runtime is packaged into images
- the VPS only needs Docker and Compose
- the stack can be recreated from container definitions

This makes the server setup more repeatable and less dependent on machine-specific differences.

---

## 3) Why a registry exists in the deployment flow

A container registry is the cloud storage location for Docker images.

The deployment flow becomes:

1. build the images
2. tag the images
3. push the images to the registry
4. pull those images on the VPS
5. run the application from those images

This is an important separation of responsibilities.

The build machine builds.
The registry stores.
The VPS runs.

That is cleaner than turning the VPS into the main build machine.

---

## 4) Why the VPS uses a separate production Compose file

A local learning stack and a server deployment stack are related, but not identical.

On the VPS, the stack usually needs:

- registry images instead of local build contexts
- a public port only for the frontend
- internal-only backend and MongoDB services
- environment values that belong specifically to production

That is why a dedicated production Compose file is useful. It describes how the VPS should run the stack, not how the local machine should build it.

---

## 5) Why image tags matter

An image tag identifies a specific version of an image.

Examples include:

- `v1`
- `v2`
- commit-based tags

Tags matter because deployment should be predictable. The server should not be left guessing which version to run.

A good deployment flow points the server to an explicit tag, which means the running version can always be identified later.

---

## 6) Why the VPS should pull rather than rebuild

A cleaner production workflow looks like this:

- build once
- push once
- pull on the VPS
- run on the VPS

This keeps the VPS focused on runtime responsibilities. It also avoids accidental drift between what was built and what was deployed.

---

## 7) Why this section is intentionally manual before CI/CD

This section does not skip straight to automation because the manual flow is important to understand first.

Students should see the real deployment path clearly:

- images are built
- images are tagged
- images are pushed
- the VPS authenticates and pulls them
- the application is started remotely

Once that sequence is understood, the next section can automate it with confidence.

---

## Key takeaway

The student should leave this section with one strong mental model:

A VPS deployment is not “copy the project and run random commands.” It is a controlled flow where already-built images are pulled onto a remote server and started with a production stack definition.
