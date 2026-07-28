# Event Creation Wizard (React + Zod + useActionState)

This challenge is essentially a **3-step wizard** with:

```text
✅ Separate form per step
✅ Separate action per step
✅ Zod validation
✅ Persisted values
✅ Conditional navigation
✅ Online → Skip Location Step
✅ Offline → Require Location Step
✅ Success Page
✅ Back Navigation
```

---

mplement a multi-step form (3 steps) for event creation, with Zod validation, conditional navigation, and persistent form values between steps.

Requirements
Turn the provided static UI into a working multi-step wizard (3 steps).
Only the active step should be visible.
Persist user input when navigating Back/Next (do not clear values when going back).
Each step uses its own form and its own action (one action per step).
Use the provided Zod schemas for validation (Event, Location, DateAndSettings).
Use the provided ActionState<T> type and the helper createStepAction<T> to manage form state, errors, and data.
Actions return { ok, errors, values, data? }.
Show a success message (data-testid="success-message") when the last step is successfully submitted.
Navigation logic:
Step 1 → Step 2 if isOnline is false, otherwise Step 3.
Step 2 → Step 3.
Step 3 → Success.
Show validation errors under each input with appropriate aria attributes and data-testid.
Notes
Tests expect specific data-testid strings for error messages and buttons; keep them unchanged.
FormData.get() returns string | File | null; cast safely:
const name = formData.get("name")?.toString() ?? ""
For checkbox: const isOnline = formData.get("isOnline") === "on".
Tests
renders the app title
renders all required fields in step 1
shows validation errors in step 1
goes to step 2 after submitting step 1 when onlie event is false
shows validation errors in step 2
shows US postal code format error in step 2
goes directly to step 3 when event is online
goes to step 3 after completing step 2
shows success message after completing step 3
shows validation errors in step 3
returns to step 1 when going back from step 3 for online events
returns to step 2 when going back from step 3 for offline events

## Overall State

```tsx
const [step, setStep] = useState(1);

const [eventData, setEventData] = useState({});

const [locationData, setLocationData] = useState({});

const [settingsData, setSettingsData] = useState({});

const [success, setSuccess] = useState(false);
```

---

# Step 1 Action

```tsx
const eventAction = createStepAction(
  EventSchema,
  async (prevState, formData) => {
    const name = formData.get("name")?.toString() ?? "";

    const description = formData.get("description")?.toString() ?? "";

    const isOnline = formData.get("isOnline") === "on";

    const result = EventSchema.safeParse({
      name,
      description,
      isOnline,
    });

    if (!result.success) {
      return {
        ok: false,
        errors: result.error.flatten().fieldErrors,
        values: {
          name,
          description,
          isOnline,
        },
      };
    }

    return {
      ok: true,
      errors: {},
      values: result.data,
      data: result.data,
    };
  },
);
```

---

# Step 2 Action

```tsx
const locationAction = createStepAction(
  LocationSchema,
  async (prevState, formData) => {
    const address = formData.get("address")?.toString() ?? "";

    const city = formData.get("city")?.toString() ?? "";

    const postalCode = formData.get("postalCode")?.toString() ?? "";

    const result = LocationSchema.safeParse({
      address,
      city,
      postalCode,
    });

    if (!result.success) {
      return {
        ok: false,
        errors: result.error.flatten().fieldErrors,
        values: {
          address,
          city,
          postalCode,
        },
      };
    }

    return {
      ok: true,
      errors: {},
      values: result.data,
      data: result.data,
    };
  },
);
```

---

# Step 3 Action

```tsx
const settingsAction = createStepAction(
  DateAndSettingsSchema,
  async (prevState, formData) => {
    const date = formData.get("date")?.toString() ?? "";

    const capacity = Number(formData.get("capacity"));

    const result = DateAndSettingsSchema.safeParse({
      date,
      capacity,
    });

    if (!result.success) {
      return {
        ok: false,
        errors: result.error.flatten().fieldErrors,
        values: {
          date,
          capacity,
        },
      };
    }

    return {
      ok: true,
      errors: {},
      values: result.data,
      data: result.data,
    };
  },
);
```

---

# Step Navigation Logic

### Step 1 Submit

```tsx
if (eventState.ok) {
  setEventData(eventState.data);

  if (eventState.data.isOnline) {
    setStep(3);
  } else {
    setStep(2);
  }
}
```

Required:

```text
Online  → Step 3

Offline → Step 2
```

---

### Step 2 Submit

```tsx
if (locationState.ok) {
  setLocationData(locationState.data);

  setStep(3);
}
```

---

### Step 3 Submit

```tsx
if (settingsState.ok) {
  setSettingsData(settingsState.data);

  setSuccess(true);
}
```

---

# Back Button Logic

### From Step 3

```tsx
function handleBack() {
  if (eventData.isOnline) {
    setStep(1);
  } else {
    setStep(2);
  }
}
```

Required by:

```text
Online Event
Step3 → Step1

Offline Event
Step3 → Step2
```

---

### Step 2 Back

```tsx
setStep(1);
```

---

# Step Rendering

```tsx
{
  step === 1 && <EventForm />;
}

{
  step === 2 && <LocationForm />;
}

{
  step === 3 && <SettingsForm />;
}
```

Only one step visible.

---

# Persist Values

Values are stored separately:

```tsx
eventData;
locationData;
settingsData;
```

Used as:

```tsx
defaultValue={
  eventState.values.name
}
```

or

```tsx
defaultValue={
  eventData.name
}
```

This guarantees:

```text
Next
Back
Next

previous values remain
```

---

# Error Rendering

```tsx
<input aria-invalid={!!state.errors.name} />;

{
  state.errors.name && <p data-testid="name-error">{state.errors.name}</p>;
}
```

Required for all fields.

---

# Success Screen

```tsx
{
  success && (
    <div data-testid="success-message">Event created successfully</div>
  );
}
```

---

# Test Mapping

| Test                     | Logic                      |
| ------------------------ | -------------------------- |
| Step 1 fields            | EventForm                  |
| Step 1 errors            | EventSchema                |
| Offline → Step 2         | `isOnline === false`       |
| Online → Step 3          | `isOnline === true`        |
| Step 2 postal validation | LocationSchema             |
| Step 2 → Step 3          | successful location submit |
| Step 3 validation        | DateAndSettings            |
| Success message          | final submit               |
| Step3 → Step1            | online back                |
| Step3 → Step2            | offline back               |
| Persisted values         | stored state               |

---

# Senior Interview Answer

> I model the wizard as a finite state flow where each step owns its own form, action, validation schema, and action state. Successful actions persist validated data into parent state and drive navigation. Conditional branching is determined by the event type (`isOnline`). Values are preserved across navigation by storing validated data outside individual forms. This approach keeps validation isolated, makes each step independently testable, and scales well to larger multi-step workflows.
