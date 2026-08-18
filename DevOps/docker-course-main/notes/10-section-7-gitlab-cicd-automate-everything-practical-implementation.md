# Section 7 — GitLab CI/CD — Automate Everything — Practical Implementation

## Introduction

This section automates the deployment flow that was done manually in the previous section.

The pipeline will:

1. build the backend and frontend images
2. push those images to GitLab Container Registry
3. connect to the VPS
4. pull the new images
5. restart the live stack

---

## Practical 1 — Push the project to GitLab

### Objective

Make sure the repository exists in GitLab before the pipeline is introduced.

### The project should now contain

- frontend code
- backend code
- `compose.production.yaml`
- `.gitlab-ci.yml`

### Why this comes first

The pipeline file only has meaning once GitLab can read it from the repository.

---

## Practical 2 — Add the required CI/CD variables in GitLab

### Deployment connection variables

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PATH`

### SSH file variables

- `SSH_PRIVATE_KEY`
- `SSH_KNOWN_HOSTS`

### Registry pull variables for the VPS

- `REGISTRY_DEPLOY_USER`
- `REGISTRY_DEPLOY_PASSWORD`

### Optional public port variable

- `PUBLIC_PORT`
  - default can be `80`

### Important handling notes

- sensitive values should be masked and protected where appropriate
- `SSH_PRIVATE_KEY` should be added as a file variable
- `SSH_KNOWN_HOSTS` should be added as a file variable

### Why this matters

The pipeline should not hardcode private credentials in the repository. Variables let GitLab inject those values securely at runtime.

---

## Practical 3 — Create `.gitlab-ci.yml`

### Objective

Define the full build, push, and deploy automation flow.

### File

`.gitlab-ci.yml`

### Content

```yaml
stages:
  - build
  - push
  - deploy

default:
  image: docker:24.0.5-cli
  services:
    - docker:24.0.5-dind
  variables:
    DOCKER_HOST: tcp://docker:2375
    DOCKER_TLS_CERTDIR: ""
    SERVER_LOCAL_IMAGE: "docker-course-server:${CI_COMMIT_SHORT_SHA}"
    CLIENT_LOCAL_IMAGE: "docker-course-client:${CI_COMMIT_SHORT_SHA}"
    SERVER_IMAGE: "${CI_REGISTRY_IMAGE}/server:${CI_COMMIT_SHORT_SHA}"
    CLIENT_IMAGE: "${CI_REGISTRY_IMAGE}/client:${CI_COMMIT_SHORT_SHA}"
  before_script:
    - docker info

build_images:
  stage: build
  rules:
    - if: '$CI_COMMIT_BRANCH'
  script:
    - docker build --pull -t "$SERVER_LOCAL_IMAGE" ./server
    - docker build --pull --build-arg VITE_API_URL=/api -t "$CLIENT_LOCAL_IMAGE" ./client
    - docker save -o server-image.tar "$SERVER_LOCAL_IMAGE"
    - docker save -o client-image.tar "$CLIENT_LOCAL_IMAGE"
  artifacts:
    paths:
      - server-image.tar
      - client-image.tar
    expire_in: 1 day

push_images:
  stage: push
  needs:
    - job: build_images
      artifacts: true
  rules:
    - if: '$CI_COMMIT_BRANCH'
  script:
    - echo "$CI_REGISTRY_PASSWORD" | docker login "$CI_REGISTRY" -u "$CI_REGISTRY_USER" --password-stdin
    - docker load -i server-image.tar
    - docker load -i client-image.tar
    - docker tag "$SERVER_LOCAL_IMAGE" "$SERVER_IMAGE"
    - docker tag "$CLIENT_LOCAL_IMAGE" "$CLIENT_IMAGE"
    - docker push "$SERVER_IMAGE"
    - docker push "$CLIENT_IMAGE"

deploy_to_vps:
  stage: deploy
  image: alpine:3.20
  services: []
  needs:
    - job: push_images
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
  before_script:
    - apk add --no-cache openssh-client
    - eval "$(ssh-agent -s)"
    - chmod 400 "$SSH_PRIVATE_KEY"
    - ssh-add "$SSH_PRIVATE_KEY"
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - cp "$SSH_KNOWN_HOSTS" ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts
  script:
    - mkdir -p deploy
    - |
      cat > deploy/.env.production <<EOF2
      REGISTRY_IMAGE=${CI_REGISTRY_IMAGE}
      APP_TAG=${CI_COMMIT_SHORT_SHA}
      PUBLIC_PORT=${PUBLIC_PORT:-80}
      EOF2
    - ssh "$DEPLOY_USER@$DEPLOY_HOST" "mkdir -p '$DEPLOY_PATH'"
    - scp compose.production.yaml "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/compose.production.yaml"
    - scp deploy/.env.production "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/.env.production"
    - |
      ssh "$DEPLOY_USER@$DEPLOY_HOST" "
        echo '$REGISTRY_DEPLOY_PASSWORD' | docker login '$CI_REGISTRY' -u '$REGISTRY_DEPLOY_USER' --password-stdin &&
        cd '$DEPLOY_PATH' &&
        docker compose --env-file .env.production -f compose.production.yaml pull &&
        docker compose --env-file .env.production -f compose.production.yaml up -d
      "
  environment:
    name: production
```

### What this pipeline contains

- a build stage for image creation
- a push stage for publishing images
- a deploy stage for updating the live server

---

## Practical 4 — Understand what the build stage is doing

### Build stage responsibilities

- run Docker inside GitLab CI
- build the backend image
- build the frontend image with `VITE_API_URL=/api`
- save both images as tar files
- publish those tar files as artifacts

### Why the tar files matter

The next stage can reuse the exact built images instead of building again.

---

## Practical 5 — Understand what the push stage is doing

### Push stage responsibilities

- authenticate with GitLab Container Registry
- load the image tar files
- tag them with the full registry image names
- push them to the registry

### Why this stage exists separately

It creates a clean split between “building artifacts” and “publishing artifacts.”

---

## Practical 6 — Understand what the deploy stage is doing

### Deploy stage responsibilities

- install the SSH client
- start `ssh-agent`
- load the SSH private key
- copy the known-hosts file
- generate `.env.production`
- copy deployment files to the VPS
- log the VPS into the registry
- pull the tagged images
- restart the Compose stack

### Why this is useful

The server update is now driven from GitLab instead of being performed manually from a local terminal each time.

---

## Practical 7 — Trigger the pipeline

### Commands

```bash
git add .
git commit -m "add gitlab pipeline"
git push
```

### What to watch in GitLab

- the pipeline starts automatically
- the build stage runs first
- the push stage runs after build succeeds
- the deploy stage runs after push succeeds on the default branch

---

## Practical 8 — Verify the live application after deployment

### Open the live app

- the VPS IP
- or the connected domain

### Confirm the result

- the frontend loads
- the API works
- MongoDB data is still present
- the stack updated through the pipeline

This proves the deployment is no longer manual.

---

## Practical 9 — Understand branch behavior

This pipeline deploys only from the default branch.

That is a sensible beginner-friendly production rule because:

- feature branches should not deploy automatically to production
- the production path stays simple
- the promotion path is easier to reason about

---

## Final outcome

By the end of this section, deployment has moved from manual shell work to a versioned GitLab pipeline.

That is the major shift:

- before -> build, push, and deploy were terminal tasks
- after -> build, push, and deploy are stored as automation in the repository
