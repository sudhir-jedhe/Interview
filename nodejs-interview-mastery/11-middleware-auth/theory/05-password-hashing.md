# Password Hashing

Never store plaintext passwords — if your database leaks, every user's password leaks. Use `bcrypt`, which automatically salts (so two identical passwords produce different hashes) and includes a tunable **cost factor** to deliberately slow down hashing, making brute-force/rainbow-table attacks impractical even as hardware gets faster.

```js
const bcrypt = require('bcrypt');

const hash = await bcrypt.hash(plainPassword, 12); // 12 = cost factor (rounds)
const isValid = await bcrypt.compare(plainPassword, hash);
```
Never roll your own hashing (`md5`, `sha256` alone, or a homemade scheme) — general-purpose hash functions are fast, which is exactly the wrong property for password storage; they're designed for speed, not for resisting brute force.

## bcrypt vs plain hashing (SHA-256/MD5) for passwords

| Aspect | bcrypt (or argon2/scrypt) | Plain SHA-256/MD5 |
|---|---|---|
| Speed | Deliberately slow, tunable via cost factor | Extremely fast — designed for that |
| Salting | Automatic, built into the hash output | Must be added manually, easy to forget or misuse |
| Resistance to brute force / GPU cracking | High — cost factor can be raised as hardware improves | Low — billions of hashes/sec on commodity GPUs |

Always use a purpose-built password hashing algorithm (bcrypt, argon2, scrypt) — never a general-purpose cryptographic hash function alone, no matter how "secure" it sounds, because speed is a liability for password storage, not a feature. The common mistake is using `crypto.createHash('sha256')` on a password because it's already in Node's standard library — it's fast precisely because it wasn't designed to resist offline brute-force attacks against leaked hash dumps.

## Why not roll your own scheme

Cryptographic hashing and salting have subtle failure modes (timing attacks in comparison, insufficient salt randomness/length, weak iteration counts) that are easy to get wrong even with good intentions, and a homemade scheme has had none of the years of public cryptanalysis that bcrypt/argon2/scrypt have survived. The engineering cost of using a well-audited, battle-tested library call (`bcrypt.hash`) is essentially zero compared to the risk of a subtly broken custom implementation.

**A common async footgun:** `bcrypt.compare` is asynchronous and returns a promise. Forgetting to `await` it (or return the promise) means the caller reads a result before the comparison has actually completed, silently getting `undefined` back instead of a boolean.
