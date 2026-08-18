```typescript
class Connection {
  status: "open" | "closed" = "open";

  close(): void {
    this.status = "closed";
  }
}

function useConnection(conn: Connection): void {
  if (conn.status === "open") {
    conn.close();
    console.log(conn.status.toUpperCase()); // does this still say "open"?
  }
}
```

Does this compile, and does TypeScript still treat `conn.status` as `"open"` after the call to `conn.close()`?

**Answer:** It compiles, but TypeScript widens `conn.status` back to the full `"open" | "closed"` union after the `conn.close()` call — it does not keep assuming `"open"`. `.toUpperCase()` still works either way since both members are strings, but if the code instead branched on the assumption that `status` was still `"open"`, that assumption would be wrong both at the type level and at runtime.

**Why:** TypeScript narrows a property access (`conn.status`) only for as long as it can prove nothing in between could have changed it. A call to an arbitrary method (`conn.close()`) is exactly the kind of operation the compiler can't see into for narrowing purposes — `close()` could reassign `this.status`, and in this example it explicitly does, so TypeScript conservatively drops the earlier `"open"` narrowing the moment a method call happens on the same object. This is a stricter, more defensive relative of the closure-narrowing pitfall: even fully synchronous code loses a property narrowing across any call whose implementation isn't visible to be proven side-effect-free. The safe pattern is the same one used for closures — capture the narrowed value in a local `const` *before* the call, if you need to depend on the pre-call state afterward, rather than re-reading `conn.status` and assuming it's unchanged.
