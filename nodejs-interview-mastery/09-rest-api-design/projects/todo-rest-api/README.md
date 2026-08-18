# todo-rest-api

A small, genuine multi-file REST API for a todo list, built to demonstrate the REST API design principles covered in this topic: correct HTTP verb usage, consistent response envelopes, request validation, cursor-based pagination, and centralized error handling.

## Run it

```sh
npm install
npm start
# server listening on http://localhost:3000
```

## Project structure

```
todo-rest-api/
  app.js                    entrypoint — wires up middleware, routes, error handler
  db.js                     in-memory data layer (swap for a real DB without touching routes)
  errors.js                 typed ApiError hierarchy
  routes/todos.js           the actual REST endpoints
  middleware/asyncHandler.js  forwards async rejections to next(err)
  middleware/errorHandler.js  turns any error into a consistent JSON response
  middleware/validate.js    generic Zod-schema validation middleware factory
  schemas/todoSchemas.js    Zod schemas for create/replace/patch payloads
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/todos?done=&after=&limit=` | Cursor-paginated list, optional `done` filter |
| GET | `/todos/:id` | Get a single todo |
| POST | `/todos` | Create a todo (`{ title, dueDate? }`) |
| PUT | `/todos/:id` | Replace a todo entirely (`{ title, done, dueDate? }`) |
| PATCH | `/todos/:id` | Partially update a todo (any subset of fields) |
| DELETE | `/todos/:id` | Delete a todo |

All success responses are wrapped as `{ data, meta? }`; all errors are wrapped as `{ error: { code, message, details? } }` with an appropriate HTTP status code (400 validation, 404 not found, 500 unexpected).

## Example

```sh
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Write REST API notes"}'
# 201 { "data": { "id": 1, "title": "Write REST API notes", "done": false, ... } }

curl http://localhost:3000/todos
# 200 { "data": [ ... ], "meta": { "nextCursor": null, "limit": 20, "total": 1 } }

curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'
# 200 { "data": { "id": 1, "title": "Write REST API notes", "done": true, ... } }
```
