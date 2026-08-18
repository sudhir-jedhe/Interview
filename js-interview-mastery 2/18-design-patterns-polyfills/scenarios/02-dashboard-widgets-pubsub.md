# Scenario: Independent dashboard widgets reacting to a shared filter

**Multiple independent widgets on a dashboard page (a chart, a table, a filter panel) all need to react whenever the user changes a date-range filter, but you don't want the filter component to know anything about the widgets that exist.**

**Approach:**
Use an observer/pub-sub pattern: the filter panel emits a `dateRangeChanged` event with the new range; each widget subscribes independently on mount and unsubscribes on teardown. This decouples the filter from every widget that might care about it, and new widgets can be added later without touching the filter code.

```js
const bus = createEmitter(); // from ../snippets/03-minimal-pubsub-emitter.md

// Filter panel:
function onDateRangeSelected(range) {
  bus.emit("dateRangeChanged", range);
}

// Each widget, independently:
function mountChartWidget() {
  const handler = (range) => refetchChartData(range);
  bus.on("dateRangeChanged", handler);
  return () => bus.off("dateRangeChanged", handler); // cleanup on unmount
}
```
