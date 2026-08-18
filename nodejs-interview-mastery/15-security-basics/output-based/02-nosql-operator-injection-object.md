# Output-Based: NoSQL operator injection via an object value

```js
const query = { email: 'a@b.com', password: { $ne: null } };
// Mongo-style: db.users.findOne(query) matches any document where password is not null
console.log(typeof query.password);
```

**Answer:** `object`

**Why:** The password field isn't a string at all — it's a MongoDB query operator object. If the server passes `req.body` directly into `findOne()` without validating that `password` is a string, this bypasses the intended equality check entirely and matches the first user whose password field simply isn't `null`, logging the attacker in without knowing any password.
