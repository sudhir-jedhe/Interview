# Interview Q&A: Spread

**Q: Does object spread `{ ...obj }` produce a deep or shallow copy?**
Shallow. It copies the object's own enumerable properties one level deep — primitive values are copied by value, but any property whose value is itself an object or array is copied by reference, so mutating a nested structure on the copy also mutates it on the original. A true deep copy requires `structuredClone`, a recursive utility, or a library like lodash's `cloneDeep`.

**Q: What happens if you spread an object with getter properties?**
The getter is invoked once at spread time, and the *resulting value* is copied as a plain data property onto the new object — the getter itself is not carried over. So `{ ...objWithGetter }` gives you a snapshot value, not a live-computed property.

**Q: How do you merge two arrays while removing duplicates, using spread?**
Combine spread with `Set`: `[...new Set([...arr1, ...arr2])]`. The two arrays are concatenated via spread into a single array, `Set` deduplicates by value equality (using SameValueZero), and spreading the `Set` back into an array literal converts it back to a plain array.
