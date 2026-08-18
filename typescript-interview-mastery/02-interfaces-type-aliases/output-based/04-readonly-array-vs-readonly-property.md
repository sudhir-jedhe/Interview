# Which of these lines fail to compile?

```typescript
interface Playlist {
  readonly tracks: string[];
}

const playlist: Playlist = { tracks: ["Song A", "Song B"] };

playlist.tracks.push("Song C"); // line 1
playlist.tracks = ["Only One"]; // line 2
```

**Answer:** Line 1 compiles fine. Line 2 fails: `Cannot assign to 'tracks' because it is a read-only property.`

**Why:** `readonly tracks: string[]` marks the *property itself* as non-reassignable — you can't point `playlist.tracks` at a new array — but it says nothing about the mutability of the array value that `tracks` currently holds. Since the array's element type is plain `string[]` (not `readonly string[]`), its mutation methods like `.push()` remain fully available, so line 1 is legal and actually mutates the shared array in place. To block both reassignment *and* in-place mutation, the property would need to be declared `readonly tracks: readonly string[]` — only then would `.push()` also become a compile error (`Property 'push' does not exist on type 'readonly string[]'`). This distinction — readonly-the-binding vs readonly-the-contents — is a frequently tested gotcha, and it mirrors the same shallow-vs-deep immutability gap covered for nested objects in `theory/03-optional-and-readonly-properties.md`.
