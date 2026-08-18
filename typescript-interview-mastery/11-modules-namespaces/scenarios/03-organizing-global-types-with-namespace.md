# Scenario: Organizing Shared Global Types in a Legacy Codebase

You've inherited a large, pre-ES-module-era internal TypeScript codebase (originally written before ES modules were the default target) where dozens of files reference shared domain types — `Money`, `DateRange`, `PaginatedResult<T>` — as plain global identifiers, with no `import` statements anywhere. A full migration to ES modules across the entire codebase is a multi-quarter project that hasn't been greenlit yet, but you need to add a few new shared types without making the situation worse.

**Approach:** Rather than introducing ES module imports piecemeal (which would create an inconsistent half-migrated mess and likely break the existing global-scope assumptions other files rely on), use a `namespace` to group the new shared types under one recognizable name, matching the existing codebase's conventions until a real migration is scheduled.

```typescript
// shared-types/Domain.ts (no import/export — stays a global script, matching legacy style)
namespace Domain {
  export interface Money {
    amountCents: number;
    currency: "USD" | "EUR" | "GBP";
  }

  export interface DateRange {
    start: Date;
    end: Date;
  }

  export interface PaginatedResult<T> {
    items: T[];
    page: number;
    totalPages: number;
  }
}
```

```typescript
// legacy-order-service.ts (also no imports, same global-script style)
function formatMoney(m: Domain.Money): string {
  return `${(m.amountCents / 100).toFixed(2)} ${m.currency}`;
}

function isWithinRange(date: Date, range: Domain.DateRange): boolean {
  return date >= range.start && date <= range.end;
}
```

This keeps the new types consistent with the surrounding codebase's existing global-scope pattern, avoids introducing a jarring mix of "some files use imports, most don't" mid-migration, and gives the shared types an explicit, discoverable prefix (`Domain.Money` rather than a bare, collision-prone `Money`) — which a full flat global scope wouldn't provide on its own.

**Important caveat to state explicitly in an interview:** this is a pragmatic, temporary accommodation for legacy constraints, not a recommendation to use namespaces in new code or greenfield projects. The moment a real ES-module migration becomes feasible, `namespace Domain { ... }` should become `export interface Money { ... }` etc. in a real module file, with every reference updated to `import { Money } from "./domain"` — namespaces exist here to bridge a gap in an existing codebase's evolution, not because they're a better tool than modules going forward.
