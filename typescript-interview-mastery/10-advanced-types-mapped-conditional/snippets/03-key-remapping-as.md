# Snippet: key remapping to derive validator function names

```typescript
// Derive a "validateX" method map from a model's field names.

interface SignupFields {
  email: string;
  password: string;
}

type Validators<T> = {
  [K in keyof T as `validate${Capitalize<string & K>}`]: (value: T[K]) => boolean;
};

const validators: Validators<SignupFields> = {
  validateEmail: (value) => value.includes("@"),
  validatePassword: (value) => value.length >= 8,
};
```
