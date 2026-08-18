# Section 6 — Deploying to VPS with Docker — Practical Implementation

## Introduction

In this section, the Dockerized MERN application moves from local development to a VPS.

The deployment path used here is:

1. install Docker and Compose on the VPS
2. build and tag images
3. push images to GitLab Container Registry
4. create a production Compose file
5. pull and run the stack on the VPS

---

## Practical 1 — Install Docker and Compose on the VPS

### Objective

Prepare the server so it can run Docker containers and Compose-managed stacks.

### Commands

```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

```bash
sudo tee /etc/apt/sources.list.d/docker.sources <<'EOF'
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: amd64
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker run hello-world
```

### Verify the installation

```bash
docker --version
docker compose version
sudo systemctl status docker
```

### What this proves

- Docker is installed
- Compose is installed
- the Docker daemon is running
- the server can start a test container

---

## Practical 2 — Build and tag the backend image locally

### Objective

Create a backend image that is ready to be pushed to GitLab Container Registry.

### Command

```bash
docker build -t registry.gitlab.com/YOUR_GROUP/YOUR_PROJECT/server:v1 ./server
```

### What this tag means

- `registry.gitlab.com/...` points to the registry path
- `server` is the image name
- `v1` is the version tag

This prepares the image for pushing to the registry.

---

## Practical 3 — Build and tag the frontend image locally

### Objective

Create a frontend image with a production-style API base path.

### Command

```bash
docker build --build-arg VITE_API_URL=/api -t registry.gitlab.com/YOUR_GROUP/YOUR_PROJECT/client:v1 ./client
```

### Why `/api` is used here

The frontend will later sit behind Nginx, so `/api` is the clean public-facing API path.

---

## Practical 4 — Authenticate with GitLab Container Registry locally

### Objective

Allow the local machine to push the images.

### Command

```bash
echo "$GITLAB_TOKEN" | docker login registry.gitlab.com -u YOUR_GITLAB_USERNAME --password-stdin
```

### What this does

- reads the token from standard input
- logs in to GitLab Container Registry without exposing the password in the command history

---

## Practical 5 — Push both images to the registry

### Push the backend image

```bash
docker push registry.gitlab.com/YOUR_GROUP/YOUR_PROJECT/server:v1
```

### Push the frontend image

```bash
docker push registry.gitlab.com/YOUR_GROUP/YOUR_PROJECT/client:v1
```

### What changed after this step

Both images now exist in the registry and can be pulled from the VPS.

---

## Practical 6 — Create the production Compose file for the VPS

### Objective

Describe the server-side stack using registry images instead of local build folders.

### File

`compose.production.yaml`

### Content

```yaml
services:
  mongo:
    image: mongo:8
    restart: unless-stopped
    volumes:
      - mongo-data:/data/db

  server:
    image: ${REGISTRY_IMAGE}/server:${APP_TAG}
    restart: unless-stopped
    environment:
      PORT: 5000
      MONGODB_URI: mongodb://mongo:27017/docker_course_demo
    depends_on:
      - mongo

  client:
    image: ${REGISTRY_IMAGE}/client:${APP_TAG}
    restart: unless-stopped
    depends_on:
      - server
    ports:
      - "${PUBLIC_PORT}:80"

volumes:
  mongo-data:
```

### Why this file is different from local Compose

The VPS should not build the application from source in this flow. It should pull specific image versions from the registry and run them.

---

## Practical 7 — Create the production environment file on the VPS

### Objective

Store the deployment-specific values separately from the Compose file.

### File

`.env.production`

### Content

```env
REGISTRY_IMAGE=registry.gitlab.com/YOUR_GROUP/YOUR_PROJECT
APP_TAG=v1
PUBLIC_PORT=80
```

### What each value controls

- `REGISTRY_IMAGE` -> base registry path
- `APP_TAG` -> which version of the app should run
- `PUBLIC_PORT` -> which host port should expose the frontend

---

## Practical 8 — Authenticate with the registry on the VPS

### Objective

Allow the VPS to pull the images.

### Command

```bash
echo "$GITLAB_TOKEN" | docker login registry.gitlab.com -u YOUR_GITLAB_USERNAME --password-stdin
```

### Why this is needed

The server cannot pull private images unless it can authenticate with the registry.

---

## Practical 9 — Pull and run the production stack on the VPS

### Pull the images

```bash
docker compose --env-file .env.production -f compose.production.yaml pull
```

### Start the stack

```bash
docker compose --env-file .env.production -f compose.production.yaml up -d
```

### What this does

- reads the production environment file
- uses the production Compose definition
- pulls the tagged images from the registry
- starts the containers in detached mode

---

## Practical 10 — Verify that the application is live

### Browser check

Open:

```txt
http://YOUR_SERVER_IP
```

Or open the connected domain if DNS already points to the VPS.

### Terminal checks

```bash
docker compose --env-file .env.production -f compose.production.yaml ps
```

```bash
docker compose --env-file .env.production -f compose.production.yaml logs
```

```bash
docker compose --env-file .env.production -f compose.production.yaml logs client
```

```bash
docker compose --env-file .env.production -f compose.production.yaml logs server
```

### What should be true now

- the frontend loads publicly
- API calls work through the frontend entry point
- the backend is running internally
- MongoDB is still backed by its named volume

---

## Practical 11 — Deploy a newer version by changing the image tag

### Build and push `v2`

```bash
docker build -t registry.gitlab.com/YOUR_GROUP/YOUR_PROJECT/server:v2 ./server
```

```bash
docker build --build-arg VITE_API_URL=/api -t registry.gitlab.com/YOUR_GROUP/YOUR_PROJECT/client:v2 ./client
```

```bash
docker push registry.gitlab.com/YOUR_GROUP/YOUR_PROJECT/server:v2
```

```bash
docker push registry.gitlab.com/YOUR_GROUP/YOUR_PROJECT/client:v2
```

### Update `.env.production`

```env
APP_TAG=v2
```

### Redeploy

```bash
docker compose --env-file .env.production -f compose.production.yaml pull
```

```bash
docker compose --env-file .env.production -f compose.production.yaml up -d
```

### Why this matters

The application version on the VPS can now be changed by updating the tag and redeploying. This prepares the exact flow that CI/CD will automate in the next section.
