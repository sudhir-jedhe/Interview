# Modeling type-safe form state without knowing the form shape in advance

You're writing a `useFormState` hook (or a plain state container, if not using React) that every form in the app will use — a login form with `{ email, password }`, a checkout form with a dozen fields, a settings form with nested objects. The hook needs to expose a type-safe `setField(name, value)` that only accepts real field names and the correctly-typed value for that field, for whatever shape the caller passes in.

**Approach:** Parameterize the state container over the form's shape `T`, and use `keyof T` for field names so `setField`'s second argument is tied to whichever field name was passed as the first.

```typescript
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
}

class FormController<T extends Record<string, unknown>> {
  private state: FormState<T>;
  private listeners: Array<(state: FormState<T>) => void> = [];

  constructor(initialValues: T) {
    this.state = { values: initialValues, errors: {} };
  }

  getState(): FormState<T> {
    return this.state;
  }

  setField<K extends keyof T>(name: K, value: T[K]): void {
    this.state = {
      ...this.state,
      values: { ...this.state.values, [name]: value },
    };
    this.notify();
  }

  setError<K extends keyof T>(name: K, message: string): void {
    this.state = {
      ...this.state,
      errors: { ...this.state.errors, [name]: message },
    };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.state));
  }
}

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const loginForm = new FormController<LoginForm>({
  email: "",
  password: "",
  rememberMe: false,
});

loginForm.setField("email", "user@example.com"); // ok
loginForm.setField("rememberMe", true);           // ok
// loginForm.setField("email", 123);              // Error: number not assignable to string
// loginForm.setField("username", "x");           // Error: "username" not a key of LoginForm
```

The generic `FormController<T>` is written exactly once, and every concrete form (`LoginForm`, `CheckoutForm`, `SettingsForm`) gets a fully type-checked `setField`/`setError` API for free, with zero per-form boilerplate beyond declaring the shape interface. The `K extends keyof T` + `value: T[K]` pairing is what makes this sound: it's not enough to just accept `name: string, value: unknown`, because that would let `setField("email", 123)` compile — tying the value's type to the specific key selected is what closes that hole.
