# Does this compile?

```typescript
function createUser(name: string, role?: string, email: string): void {
  console.log(name, role, email);
}
```

**Answer:** No. TypeScript reports: `A required parameter cannot follow an optional parameter.`

**Why:** JavaScript (and TypeScript) function arguments are matched positionally at the call site. If `role?` were allowed to be optional while `email` after it remained required, the compiler (and any human reading a call like `createUser("Ada", "admin")`) couldn't determine whether `"admin"` was meant to fill `role` and leave `email` missing, or whether the call is simply invalid. To fix this, either reorder so all required parameters come first (`function createUser(name: string, email: string, role?: string)`), or make `email` optional too if that's semantically intended. This ordering rule — required, then optional/default, then at most one rest parameter — is enforced at declaration time and is one of the more mechanical but frequently-quizzed rules around parameter typing.
