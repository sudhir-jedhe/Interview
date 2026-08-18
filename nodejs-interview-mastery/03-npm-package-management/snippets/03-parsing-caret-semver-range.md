# Parsing a Semver Range to Check If a Version Satisfies It

```js
function satisfiesCaret(range, version) {
  // simplistic ^x.y.z check for demonstration -- use the 'semver' package in real code
  const [rMajor] = range.replace('^', '').split('.').map(Number);
  const [vMajor] = version.split('.').map(Number);
  return rMajor === vMajor;
}
console.log(satisfiesCaret('^4.0.0', '4.19.2')); // true
console.log(satisfiesCaret('^4.0.0', '5.0.0'));  // false
```

This is a deliberately simplified, from-scratch illustration of what `^` range checking conceptually does — comparing major versions — but it's **not** production-correct: it doesn't handle the pre-1.0 special case (`^0.x.y` locks the minor digit, not the major — see `../theory/02-semantic-versioning-ranges.md`), pre-release tags, or `~` ranges at all. Real code should always use the battle-tested `semver` package (`semver.satisfies(version, range)`) rather than hand-rolling range parsing — this snippet exists purely to build intuition for what a full solution needs to account for, which is exactly what `../problems/01-semver-range-validator.md` builds properly.
