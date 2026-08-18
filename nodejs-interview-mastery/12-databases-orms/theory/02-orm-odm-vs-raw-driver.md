# ORM/ODM Concept vs Raw Driver

An **ORM** (Object-Relational Mapper, for SQL — Sequelize, Prisma) or **ODM** (Object-Document Mapper, for MongoDB — Mongoose) maps rows/documents to JS objects, generates queries from a higher-level API, enforces schema validation in application code, and often handles migrations. It trades some control and query transparency for developer productivity and safety (e.g. built-in parameterization prevents SQL injection almost by default).

```js
// Mongoose (ODM) — schema validation lives in code, not just the DB
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 },
});
const User = mongoose.model('User', userSchema);

const user = await User.findById(id); // returns a hydrated document, not a raw object
```
```js
// raw MongoDB driver — no schema enforcement, you get exactly what's in the DB
const doc = await db.collection('users').findOne({ _id: id });
```
Raw drivers give you full control over exactly what query runs and full visibility into performance — no abstraction hiding the shape of the SQL/aggregation being generated. ORMs win on velocity for CRUD-heavy apps but can obscure what's actually happening against the database, which is exactly how the N+1 problem sneaks in.

## ORM/ODM vs raw SQL driver

| Aspect | ORM/ODM (Sequelize, Prisma, Mongoose) | Raw driver (`pg`, `mysql2`, MongoDB driver) |
|---|---|---|
| Developer velocity | High — CRUD is a method call, migrations are generated, relations are declarative | Lower — you hand-write every query and manage schema changes yourself |
| Query transparency | Can hide what's actually sent to the DB (the N+1 problem is a direct consequence) | Full visibility — you see exactly what SQL/aggregation runs |
| SQL injection risk | Low by default — parameterization is baked into the query builder API | Still low *if* you always parameterize (`$1`, `?`) — but nothing stops a raw string concatenation bug |
| Performance ceiling | Good enough for most CRUD apps, but hand-tuned raw queries usually win for complex reporting/aggregation | Full control — you can hand-optimize indexes, joins, and query plans |

Use an ORM/ODM for the majority of application code — standard CRUD, simple relations, and anywhere migrations and schema-as-code pay off in team velocity. Drop to the raw driver (or an ORM's raw-query escape hatch, e.g. `prisma.$queryRaw`, `sequelize.query`) for reporting queries, bulk operations, or anything where the ORM's generated query is provably suboptimal.

## Mongoose vs Sequelize vs Prisma

| Aspect | Mongoose (MongoDB ODM) | Sequelize (SQL ORM) | Prisma (SQL ORM + query builder) |
|---|---|---|---|
| Data model | Schema-flexible documents; schema is enforced in app code, not the DB engine | Relational tables with foreign keys enforced by the DB itself | Relational tables; schema defined in a dedicated `.prisma` schema file, generates a typed client |
| Query style | Chainable model methods (`.find().populate()`) returning hydrated documents | Model methods (`.findAll({ include })`) close to ActiveRecord-style | Generated, fully-typed client methods (`prisma.post.findMany({ include })`) |
| Migrations | No built-in migration system (schema changes are just code changes since Mongo is schemaless) | Built-in migration CLI, but migrations are written by hand as JS files | First-class migration system (`prisma migrate`) generated from schema diffs |

Pick based on your database first (Mongo vs SQL isn't usually a "pick the nicer library" decision), then pick the ORM that fits your team's tooling maturity — Prisma for strong typing and modern DX on a fresh SQL project, Sequelize for an existing codebase already built on it, Mongoose for MongoDB.
