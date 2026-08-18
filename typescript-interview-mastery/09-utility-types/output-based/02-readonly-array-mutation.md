```typescript
interface Playlist {
  name: string;
  trackIds: string[];
}

const playlist: Readonly<Playlist> = {
  name: "Focus",
  trackIds: ["t1", "t2"],
};

playlist.name = "Deep Focus";        // (1)
playlist.trackIds.push("t3");        // (2)
```

**Answer:** Line (1) fails to compile: `Cannot assign to 'name' because it is a read-only property`. Line (2) compiles fine and mutates the array at runtime — `playlist.trackIds` becomes `["t1", "t2", "t3"]`.

**Why:** `Readonly<T>` only makes the *top-level property bindings* read-only; it does not touch the types of the values themselves. `trackIds` has type `string[]`, and `string[]` is still a fully mutable array type — `Readonly` never rewrote it to `readonly string[]`. So you can't reassign `playlist.trackIds = [...]` (that reassignment is blocked), but you absolutely can call mutating array methods like `push`, `pop`, or `splice` on the array that binding points to. To lock down the array itself you'd need `readonly trackIds: readonly string[]` explicitly, or a deep-readonly utility.
