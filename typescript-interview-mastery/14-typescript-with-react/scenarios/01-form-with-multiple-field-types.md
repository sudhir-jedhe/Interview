# Scenario: A Multi-Field Form with Mixed Input Types

You're building a settings form with a text input, a select dropdown, and a checkbox, all updating a single state object. A previous attempt used one generic `handleChange` for all three fields and ran into a wall of type errors trying to make a single event handler work across `HTMLInputElement`, `HTMLSelectElement`, and different value types (`string` vs `boolean`).

**Approach:**

The core issue is trying to force three genuinely different event/value shapes through a single handler signature. The cleanest fix is to type the state precisely and write per-field-type handlers that each use the correct specific event type, rather than one overly generic handler with unsafe casts sprinkled through it.

```tsx
interface SettingsForm {
  displayName: string;
  timezone: string;
  emailNotifications: boolean;
}

function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>({
    displayName: "",
    timezone: "UTC",
    emailNotifications: true,
  });

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, timezone: e.target.value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, emailNotifications: e.target.checked }));
  };

  return (
    <form>
      <input
        name="displayName"
        value={form.displayName}
        onChange={handleTextChange}
      />
      <select value={form.timezone} onChange={handleSelectChange}>
        <option value="UTC">UTC</option>
        <option value="America/New_York">Eastern</option>
      </select>
      <input
        type="checkbox"
        checked={form.emailNotifications}
        onChange={handleCheckboxChange}
      />
    </form>
  );
}
```

Note two deliberate choices here. First, `handleTextChange` uses `[name]: value` with a computed property, relying on the fact that both `displayName` (the only plain-text field in this form) is a `string`, matching `e.target.value`'s type — if a field's value type didn't match `e.target.value`'s `string`, this generic-key approach would silently produce a type-inconsistent object, so it's only safe when every field routed through that handler shares the same value type. Second, `emailNotifications` (a `boolean`) is handled by a dedicated `handleCheckboxChange` that reads `e.target.checked` rather than `.value`, because checkboxes don't map their boolean state to `.value` at all — `.value` for a checkbox is always the string `"on"` regardless of checked state, a classic DOM gotcha that a generic value-based handler would get wrong even with correct typing.

**Lesson:** resist the urge to unify event handlers across incompatible input types just to reduce line count. TypeScript's per-element event types (`HTMLInputElement` vs `HTMLSelectElement`) and the different semantics of `.value` vs `.checked` are signals, not obstacles — a handler that tries to be generic across all three usually ends up needing unsafe casts that silently reintroduce exactly the bugs the specific types were preventing.
