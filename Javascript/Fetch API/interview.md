Q1: "What is the difference between REST and GraphQL?"
REST gives you fixed endpoints. You call /users and you get whatever the server decides to send back. GraphQL lets you ask for exactly what you need. Nothing more, nothing less.
REST = server decides the data. GraphQL = client decides the data.

Q2: "What is over-fetching and under-fetching?"
Over-fetching means you asked for user data but got name, email, age, address, and phone number when you only needed the name. You got too much.
Under-fetching means one endpoint did not have everything you needed, so you had to call two or three more. You got too little.
GraphQL was built to solve both of these problems at once.

Q3: "What are HTTP methods and when do you use each one?"
GET is for reading data. Never use it to change anything.
POST is for creating something new.
PUT is for replacing an entire resource.
PATCH is for updating only part of a resource.
DELETE is for removing something.
The trap is using POST for everything. It works but it breaks the contract every developer expects from a clean API.

Q4: "What are HTTP status codes and why do they matter?"
They are a contract between your API and whoever is calling it. Using the wrong code makes debugging a nightmare for everyone.
200 means success.
201 means something was created.
400 means the client sent bad data.
401 means the user is not logged in.
403 means logged in but no permission.
404 means the resource does not exist.
429 means too many requests.
500 means something broke on your server.

Q5: "What is idempotency and why does it matter?"
Idempotent means calling the same request ten times gives the exact same result as calling it once.
GET, PUT and DELETE are idempotent.
POST is not.
Networks fail. Clients retry automatically. If your API is not idempotent where it should be, those retries create duplicate records, double charges or corrupted data. This is one of the most underrated concepts in backend development.

Q6: "What is API rate limiting and why should you implement it?"
Rate limiting controls how many requests a client can make in a given time window. For example 100 requests per minute.
Without it a buggy client stuck in a loop can bring down your entire server. A bad actor can scrape all your data in minutes.
Rate limiting protects your server, your database and your real users. Always implement it. Return 429 when the limit is hit so clients know exactly why they are being blocked.
