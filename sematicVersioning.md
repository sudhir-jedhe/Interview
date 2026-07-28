# Compare Semantic Versions (JavaScript Interview)

Semantic Versioning uses:

```text
MAJOR.MINOR.PATCH

1.2.3
```

Rules:

```text
1.0.0 < 1.0.1
1.2.0 < 1.3.0
1.9.9 < 2.0.0
```

Semantic versions are defined as `MAJOR.MINOR.PATCH` and commonly compared using SemVer rules. The npm `semver` tooling supports comparison operations such as `gt`, `lt`, and `compare`. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/POC94/Shared%20Documents/Source/node_modules/semver/README.md?web=1), [\[bing.com\]](https://bing.com/search?q=compare+semantic+versions+JavaScript+interview+problem+semantic+version+compare)

---

## Problem

Implement:

```js
compareVersions("1.2.3", "1.3.0");
```

Return:

```text
-1 => v1 < v2
 0 => equal
 1 => v1 > v2
```

---

## Complete Solution

```js
function compareVersions(version1, version2) {
  const v1 = version1.split(".").map(Number);

  const v2 = version2.split(".").map(Number);

  const length = Math.max(v1.length, v2.length);

  for (let i = 0; i < length; i++) {
    const num1 = v1[i] || 0;
    const num2 = v2[i] || 0;

    if (num1 > num2) {
      return 1;
    }

    if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}
```

---

## Example

```js
console.log(compareVersions("1.2.3", "1.2.4"));
```

Output:

```js
-1;
```

---

```js
console.log(compareVersions("2.0.0", "1.9.9"));
```

Output:

```js
1;
```

---

```js
console.log(compareVersions("1.0", "1.0.0"));
```

Output:

```js
0;
```

---

## Dry Run

### Input

```text
1.10.2
1.2.10
```

Arrays:

```js
[1, 10, 2][(1, 2, 10)];
```

Compare:

```text
1 vs 1  => equal

10 vs 2 => greater
```

Return:

```js
1;
```

---

# TypeScript Version

```ts
function compareVersions(version1: string, version2: string): number {
  const v1 = version1.split(".").map(Number);

  const v2 = version2.split(".").map(Number);

  const maxLength = Math.max(v1.length, v2.length);

  for (let i = 0; i < maxLength; i++) {
    const num1 = v1[i] ?? 0;
    const num2 = v2[i] ?? 0;

    if (num1 > num2) {
      return 1;
    }

    if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}
```

---

# Support Pre-Release Versions

Examples:

```text
1.0.0-alpha

1.0.0-beta

1.0.0-rc

1.0.0
```

Order:

```text
alpha
   <
beta
   <
rc
   <
release
```

SemVer specifications also define handling for prerelease identifiers and version precedence. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/POC94/Shared%20Documents/Source/node_modules/semver/README.md?web=1), [\[bing.com\]](https://bing.com/search?q=compare+semantic+versions+JavaScript+interview+problem+semantic+version+compare)

---

## Interview Follow-Up

### Sort Versions

```js
const versions = ["1.2.3", "1.10.0", "1.3.0"];

versions.sort(compareVersions);
```

Output:

```js
["1.2.3", "1.3.0", "1.10.0"];
```

---

## Complexity

```text
n = number of segments

Time  : O(n)

Space : O(n)
```

---

## Senior-Level Answer

> Split both version strings by `"."`, compare corresponding segments numerically from left to right, and treat missing segments as `0`. Return `1`, `-1`, or `0` as soon as a difference is found. This runs in `O(n)` time and is the standard solution for semantic version comparison. For full SemVer support, including prerelease identifiers, libraries such as npm's SemVer implementation provide spec-compliant comparison functions. [\[persistent...epoint.com\]](https://persistentsystems.sharepoint.com/sites/POC94/Shared%20Documents/Source/node_modules/semver/README.md?web=1), [\[stackoverflow.com\]](https://stackoverflow.com/questions/6832596/how-can-i-compare-software-version-number-using-javascript-only-numbers)
