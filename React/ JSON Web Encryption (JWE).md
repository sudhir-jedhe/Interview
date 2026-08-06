
💡 What is JSON Web Encryption (JWE)?
JWE is a security standard that encrypts data inside a JSON-based token.
Unlike normal tokens that can be easily decoded, JWE tokens keep the data fully encrypted. This means no one can read the information inside the token without the decryption key.

Even if someone accesses the token from the browser , they cannot see the actual data because it is encrypted.

💡 Why do websites use JWE?
Web applications use JWE to protect important and sensitive information such as:
👉 Authentication tokens
 👉 User session data
 👉 Sensitive API responses
 👉 Personally Identifiable Information (PII)

 Example :
"eyJraWQiOiJoUTVYTVN1YWJmUGFKeVNScDVta2FfQTktU0ppUFliX3A0MG03WDBlVFlVIiwidmVyIjoiMS4wIiwiemlwIjoiRGVmbGF0ZSJ9
.SCpU0RDkgOfrlirBaLR42X6ZHAm-5qSVbkvTX
.gk1f8s1eTtXH9s2F3
.Pd8JmRz3KkL2
.R9V0C1"

A JWE token has five parts:
 👉 Header – Information about the encryption algorithm.
 👉 Encrypted Key – The key used to encrypt the payload.
 👉 Initialization Vector (IV) – Adds randomness to encryption.
 👉 Ciphertext – The encrypted data (payload).
 👉Authentication Tag – Ensures the data was not modified.
