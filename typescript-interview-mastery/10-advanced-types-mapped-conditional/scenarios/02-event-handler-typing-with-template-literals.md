# Scenario: Type-Safe Event Handler Props from a Component's Event Map

You're building a small UI component library. Each component defines the events it emits as a plain map of event name to payload type. You want the component's props type to automatically include a correctly-named, correctly-typed `on<EventName>` handler for every event — without hand-writing each handler prop and risking it drifting out of sync with the event map.

```typescript
interface ModalEvents {
  close: { reason: "backdrop" | "escape" | "button" };
  confirm: { value: string };
}
```

**Approach:** Combine key remapping with `as` and a template literal type to derive the handler prop name from each event name, and use `Capitalize` so `close` becomes `onClose` rather than `onclose`.

```typescript
type EventHandlerProps<TEvents> = {
  [K in keyof TEvents as `on${Capitalize<string & K>}`]?: (payload: TEvents[K]) => void;
};

interface ModalProps extends EventHandlerProps<ModalEvents> {
  isOpen: boolean;
  title: string;
}

function Modal(props: ModalProps) {
  props.onClose?.({ reason: "backdrop" });
  props.onConfirm?.({ value: "yes" });
  // props.onConfirm?.({ reason: "backdrop" }); // Error: wrong payload shape for onConfirm
}
```

Because `EventHandlerProps` is generic, dropping a new event into `ModalEvents` (say, `open: { triggeredBy: string }`) automatically produces a new `onOpen?: (payload: { triggeredBy: string }) => void` prop on `ModalProps` with zero additional code — the prop name, its optionality, and its payload type are all derived, not maintained by hand. This is the same shape of problem that libraries like React Aria and Radix solve internally to keep dozens of components' prop types in sync with their event maps.

A key detail: the handlers are optional (`?:`) because consumers shouldn't be forced to handle every event, and `Capitalize<string & K>` is needed (not just `Capitalize<K>`) because `K` here is typed as `string | number | symbol` from `keyof TEvents`, and `Capitalize` only accepts `string` — the `string &` intersection narrows it back down for keys that are actually strings.
