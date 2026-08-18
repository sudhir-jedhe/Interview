# Interview Q&A: Password Hashing

**Q: Why is bcrypt used for password hashing instead of something like SHA-256?**
General-purpose hash functions like SHA-256 are designed to be fast, which is exactly the wrong property for password storage — it makes brute-forcing a leaked hash dump computationally cheap, especially with GPUs. bcrypt is deliberately slow, has a tunable cost factor you can raise as hardware improves, and automatically salts each hash so identical passwords don't produce identical hashes (defeating precomputed rainbow-table attacks).

**Q: Why shouldn't you write your own password hashing scheme?**
Cryptographic hashing and salting have subtle failure modes (timing attacks in comparison, insufficient salt randomness/length, weak iteration counts) that are easy to get wrong even with good intentions, and a homemade scheme has had none of the years of public cryptanalysis that bcrypt/argon2/scrypt have survived. The engineering cost of using a well-audited, battle-tested library call (`bcrypt.hash`) is essentially zero compared to the risk of a subtly broken custom implementation.
