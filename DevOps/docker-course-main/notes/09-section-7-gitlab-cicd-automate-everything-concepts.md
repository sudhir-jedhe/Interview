# Section 7 — GitLab CI/CD — Automate Everything — Concepts

## Introduction

Once manual deployment works, the next problem is repetition.

Every deployment contains the same categories of work:

- build images
- publish images
- connect to the server
- restart the live stack

Doing this manually every time is slow and error-prone. CI/CD turns that repeated workflow into versioned automation.

This section explains the moving parts behind a GitLab-based deployment pipeline.

---

## 1) What CI/CD solves

Without CI/CD, deployment often depends on terminal habits and memory.

That creates common problems:

- commands are forgotten
- steps drift over time
- image tags become inconsistent
- manual deployment becomes annoying
- production updates take longer than they should

CI/CD improves this by turning deployment into code. Instead of trusting memory, the project stores the process in a pipeline file.

In this course, the pipeline automates three responsibilities:

- build
- push
- deploy

---

## 2) Understanding GitLab CI/CD building blocks

### Pipeline

A pipeline is the full automation flow that runs when a Git event occurs, such as a push.

### Stage

A stage is a phase in the pipeline. The stages in this course are:

- `build`
- `push`
- `deploy`

Stages help organize the work in the correct order.

### Job

A job is one unit of work inside a stage.

Examples:

- build backend and frontend images
- push those images to the registry
- connect to the VPS and deploy the new version

### Runner

A runner is the environment that actually executes the jobs.

The runner is important because the pipeline file defines *what* should happen, but the runner is what *performs* those steps.

---

## 3) What `.gitlab-ci.yml` is

GitLab looks for a file named `.gitlab-ci.yml` in the repository.

This file defines the automation logic:

- stages
- jobs
- images
- services
- variables
- artifacts
- scripts
- rules

A useful analogy is this:

- `docker-compose.yml` describes how the application stack runs
- `.gitlab-ci.yml` describes how the application is built and delivered

Both are configuration files, but they solve different problems.

---

## 4) The pipeline structure used in this course

The pipeline flow is:

`build -> push -> deploy`

### Build stage

This stage is responsible for:

- building the backend image
- building the frontend image
- exporting them as artifacts

### Push stage

This stage is responsible for:

- authenticating with GitLab Container Registry
- loading the built image artifacts
- tagging them with their registry paths
- pushing them to the registry

### Deploy stage

This stage is responsible for:

- connecting to the VPS over SSH
- copying deployment files
- generating `.env.production`
- pulling the latest tagged images
- restarting the live stack

This separation keeps each stage focused on one kind of work.

---

## 5) Why artifacts matter between stages

The build stage produces image tar files.

Those tar files are then passed to the push stage as artifacts. This is important because it means the push stage does not rebuild the images. It reuses the exact outputs from the build stage.

That leads to a cleaner pipeline:

- build stage builds
- push stage publishes
- deploy stage deploys

Each stage does one thing well.

---

## 6) Why the registry sits in the middle

GitLab Container Registry is the bridge between CI and the VPS.

The flow becomes:

- CI builds the images
- CI pushes the images to the registry
- the VPS pulls those same images

This keeps the VPS focused on running the application instead of building it.

It also means deployment uses published, traceable artifacts rather than temporary local results.

---

## 7) Which CI variables matter here

GitLab provides useful predefined variables, such as:

- `CI_REGISTRY`
- `CI_REGISTRY_IMAGE`
- `CI_REGISTRY_USER`
- `CI_REGISTRY_PASSWORD`
- `CI_COMMIT_SHORT_SHA`
- `CI_DEFAULT_BRANCH`

The pipeline also uses custom deployment variables, such as:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PATH`
- `SSH_PRIVATE_KEY`
- `SSH_KNOWN_HOSTS`
- `REGISTRY_DEPLOY_USER`
- `REGISTRY_DEPLOY_PASSWORD`
- `PUBLIC_PORT`

These variables keep sensitive values and environment-specific values out of the pipeline file itself.

---

## 8) Why commit-based tags are more useful than only `latest`

If every deployment uses only `latest`, it becomes harder to answer an important question:

**Which exact version is running right now?**

Commit-based tags solve that problem. A tag like `CI_COMMIT_SHORT_SHA` links the deployed image back to a specific Git commit.

This makes deployments easier to trace, debug, and reason about.

---

## 9) Why the deploy stage should not rebuild the app

A clean delivery pipeline keeps responsibilities separate:

- build stage builds
- push stage pushes
- deploy stage deploys

If the deploy stage builds again, it risks creating drift between the artifact that was tested earlier and the artifact that reaches production.

That is why the VPS should pull the already-published images instead of rebuilding the project from source during deployment.

---

## Key takeaway

The purpose of CI/CD is not to make deployment magical. It is to make deployment repeatable, traceable, and less dependent on memory.

A well-structured pipeline turns deployment into a reliable system rather than a manual ritual.
