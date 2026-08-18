# Modeling a repository layer shared across entities

Your backend has a dozen entity types — `User`, `Order`, `Product`, `Invoice` — each backed by its own database table, but the CRUD operations (find by id, list all, save, delete) are structurally identical for every one of them. Writing a hand-rolled repository class per entity means the same bugs get fixed a dozen times.

**Approach:** Define one generic `Repository<T>` interface (or abstract class) that every entity-specific repository implements, parameterized by both the entity shape and its id type, so `findById` returns the right entity type without any casting.

```typescript
interface Entity {
  id: string;
}

interface Repository<T extends Entity> {
  findById(id: string): Promise<T | undefined>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

interface User extends Entity {
  email: string;
  role: "admin" | "member";
}

class InMemoryRepository<T extends Entity> implements Repository<T> {
  private store = new Map<string, T>();

  async findById(id: string): Promise<T | undefined> {
    return this.store.get(id);
  }

  async findAll(): Promise<T[]> {
    return [...this.store.values()];
  }

  async save(entity: T): Promise<T> {
    this.store.set(entity.id, entity);
    return entity;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}

const userRepo: Repository<User> = new InMemoryRepository<User>();

async function promoteToAdmin(id: string) {
  const user = await userRepo.findById(id);
  if (!user) throw new Error("User not found");
  return userRepo.save({ ...user, role: "admin" });
}
```

The `T extends Entity` constraint guarantees every repository has an `id: string` to key off of, while still letting `T` vary freely across `User`, `Order`, or anything else. A production version usually swaps `InMemoryRepository` for a database-backed implementation (Prisma, TypeORM, raw SQL), but the generic `Repository<T>` interface stays the contract that the rest of the application codes against — services depend on `Repository<User>`, not on any specific storage engine, which also makes swapping in an in-memory fake trivial for tests.
