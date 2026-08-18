# Snippet: template literal type for typed event names

```typescript
// Build a closed union of DOM-like event handler prop names from event names.

type UIEvent = "click" | "hover" | "submit";

type HandlerProp = `on${Capitalize<UIEvent>}`;
// "onClick" | "onHover" | "onSubmit"

function registerHandler(prop: HandlerProp, fn: () => void): void {
  console.log(`Registered ${prop}`);
}

registerHandler("onClick", () => console.log("clicked"));
```
