# Output-Based: the `"false"` string is truthy

```js
process.env.FLAG = 'false';
if (process.env.FLAG) {
  console.log('truthy branch');
} else {
  console.log('falsy branch');
}
```

**Answer:** `truthy branch`

**Why:** `process.env.FLAG` holds the *string* `"false"`, and any non-empty string is truthy in JavaScript. Only an actually-unset variable (`undefined`) or an explicitly empty string would take the falsy branch. This is a very common real-world bug source.
