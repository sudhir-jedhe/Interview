# Source Map — js_polyfills/Node JS → this repo

29 of your standalone notes and 4 diagram images were physically copied in (under each topic's `from-your-notes/` and `assets/`). Everything else below is mapped, not copied — worth a manual look.

## Physically copied

| File | Copied into |
|---|---|
| Api Developement.md, Design REST APIs for a simple E-Commerce application.md, Build CRUD APIs with proper validation, error handling, and pagination.md, WebHooks.md | `09-rest-api-design/from-your-notes/` |
| httpsStatusCodes.md | `07-http-server-basics/from-your-notes/` |
| RateLimmiter.md, JWT.md, Authentication Methods.md, authentication securely.md, Implement Authentication using JWT...md | `11-middleware-auth/from-your-notes/` |
| package json.md, packageJson.md, Package-lock.json.md, Be Cautious with NPM Libraries.md | `03-npm-package-management/from-your-notes/` |
| Blocking vs. Non-blocking vs. Async.md, Explain the differences between the Node.js Event Loop phases...md | `01-nodejs-runtime-event-loop/from-your-notes/` |
| building-predictable-reliable-resilient.md, How would you improve API performance...md, A CPU-intensive task...md, A Node.js server becomes unresponsive...md, An API response time suddenly increased...md, How do you identify Event Loop blocking in production?.md | `16-performance-debugging/from-your-notes/` |
| Explain MongoDB Indexing, Aggregation Pipeline, and Transactions...md | `12-databases-orms/from-your-notes/` |
| One endpoint starts receiving 10,000+ requests per second...md | `13-child-processes-clustering/from-your-notes/` |
| Show how to create an express-async-handler wrapper...md, Show how to design enterprise-level error handling...md, Show how to integrate Zod validation...md | `10-async-error-handling/from-your-notes/` |
| AWS S3 for file uploads.md, renameExtension.md | `04-filesystem-streams/from-your-notes/` |
| Backend Roadmap.jpeg, esssentials.jpeg | `01-nodejs-runtime-event-loop/assets/` |
| Express packages 2.jpeg, Express packages1.jpeg | `08-express-fundamentals/assets/` |

## Mapped — worth checking by hand

| New topic | Check in `js_polyfills/Node JS/` |
|---|---|
| `11-middleware-auth` | `JWT/` (dedicated folder) |
| `12-databases-orms` | `MongoDB/` (dedicated folder) |
| `09-rest-api-design` | `Rest API/` (dedicated folder) |
| `08-express-fundamentals` | `ownExpressJS/` — **this looks like you already built your own Express clone.** That's exactly the kind of thing worth comparing against `08-express-fundamentals/problems/01-mini-express-router-from-scratch.md` in this repo. |
| `13-child-processes-clustering` | `nodejs-microservices/` — also relevant to the separate Microservices repo (coming later) |
| *(general/foundations)* | `NamasteNode/` — looks like notes from Akshay Saini's well-regarded "Namaste Node.js" course, likely a strong general reference across most topics here |
| *(interview review)* | `Interview/` (dedicated folder), `interview quiz.md`, `interview.md`, `interviewQuestion.md`, `interview 1.pdf` / `interview.pdf` — good for cross-checking against every `interview-qa/` folder in this repo |
| *(large reference PDFs, not auto-categorized)* | Several large numbered PDFs (e.g. a ~15MB one) and images sit at the folder root without descriptive names — worth a manual skim, likely course slides or saved articles |

## What wasn't touched

Nothing outside `js_polyfills/Node JS` was touched. Database-specific deep dives belong in the upcoming SQL + Database repo; Express/React integration content stays in the React repo.
