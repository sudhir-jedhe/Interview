# Scenario: Form State Modeling with Readonly and Partial

You're modeling a multi-step signup form. While the user is filling it out, any field may be unset (`Partial`). Once submitted successfully, you want to hand the completed data to the rest of the app as an immutable snapshot (`Readonly`) so no downstream code accidentally mutates it after the fact.

```typescript
interface SignupData {
  email: string;
  password: string;
  fullName: string;
  acceptedTerms: boolean;
}
```

**Approach:** Model the in-progress form state as `Partial<SignupData>` (every field optional while typing), validate it down to a full `SignupData`, and expose the validated result as `Readonly<SignupData>` so components that only display the confirmation screen can't accidentally alter it.

```typescript
type SignupFormState = Partial<SignupData>;

function isComplete(state: SignupFormState): state is SignupData {
  return (
    typeof state.email === "string" &&
    typeof state.password === "string" &&
    typeof state.fullName === "string" &&
    state.acceptedTerms === true
  );
}

function submitSignup(state: SignupFormState): Readonly<SignupData> {
  if (!isComplete(state)) {
    throw new Error("Form is incomplete");
  }
  // state is now narrowed to SignupData by the type guard
  return Object.freeze({ ...state });
}

let form: SignupFormState = {};
form.email = "jed@example.com";
form.password = "hunter2";
form.fullName = "Jed";
form.acceptedTerms = true;

const confirmed = submitSignup(form);
// confirmed.email = "other@example.com"; // Error: read-only property
```

The type guard `isComplete` does double duty: at runtime it validates every field is actually present, and at the type level it narrows `SignupFormState` (all-optional) to `SignupData` (all-required) via TypeScript's `state is SignupData` predicate — so `submitSignup` can call `Object.freeze` and return a `Readonly<SignupData>` without any `as` casts. Pairing `Object.freeze` with the `Readonly<T>` return type also closes the gap between compile-time and runtime immutability that a bare `Readonly<T>` annotation alone doesn't guarantee.
