# MERN Demo App for Docker Course

This is a **very small MERN app** built specifically as the demo project for your Docker + GitLab CI/CD YouTube course.

## Why this app is intentionally simple
- Docker is the main topic, not app architecture.
- The code is kept small so later Docker sections stay easy to explain.
- No Docker files are included yet.
- No extra utils, services, hooks, or over-engineering.

## App features
- React + Vite + TypeScript frontend
- Express + TypeScript backend
- MongoDB Atlas connection
- Add products
- List products
- Delete products
- Health route for later Docker/Compose checks

## Project structure

```txt
docker-mern-demo/
├── client/
└── server/
```

## 1) Backend setup

```bash
cd server
npm install
npm run dev
```

Update `server/.env` with your MongoDB Atlas connection string.

## 2) Frontend setup

```bash
cd client
npm install
npm run dev
```

## Backend env

`server/.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/docker_course_demo?retryWrites=true&w=majority
```

## Frontend env

`client/.env`

```env
VITE_API_URL=http://localhost:5000
```

## API routes

- `GET /api/health`
- `GET /api/products`
- `POST /api/products`
- `DELETE /api/products/:id`

## Sample product payload

```json
{
  "name": "Black Hoodie",
  "price": 1499,
  "category": "Clothing"
}
```
