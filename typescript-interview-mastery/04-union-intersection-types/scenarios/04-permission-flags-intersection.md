# Scenario: Composing route-guard permission requirements with intersections

You're building an internal admin dashboard where different routes require different combinations of capabilities — some routes need "can view billing," some need "can view billing AND can edit billing," and some need "can manage users." Rather than a single flat permission-string union that can't express "must have both X and Y," you want to compose fine-grained capability requirements per route.

**Approach:** Model each capability as a small object type carrying a boolean flag, and compose a route's required capabilities via intersection — a route guard function generic over the intersected capability shape can then check every required flag uniformly, without route-specific logic.

```typescript
type CanViewBilling = { canViewBilling: true };
type CanEditBilling = { canEditBilling: true };
type CanManageUsers = { canManageUsers: true };

interface UserCapabilities {
  canViewBilling: boolean;
  canEditBilling: boolean;
  canManageUsers: boolean;
}

function hasCapabilities<T extends Partial<UserCapabilities>>(
  user: UserCapabilities,
  required: T,
): user is UserCapabilities & T {
  return (Object.keys(required) as Array<keyof UserCapabilities>).every(
    (key) => user[key] === required[key],
  );
}

function renderBillingEditRoute(user: UserCapabilities): string {
  const required: CanViewBilling & CanEditBilling = { canViewBilling: true, canEditBilling: true };

  if (hasCapabilities(user, required)) {
    return "Rendering billing edit form"; // user narrowed to include both required flags as true
  }
  return "Access denied: requires view + edit billing permissions";
}

const editorUser: UserCapabilities = {
  canViewBilling: true,
  canEditBilling: true,
  canManageUsers: false,
};

const viewerUser: UserCapabilities = {
  canViewBilling: true,
  canEditBilling: false,
  canManageUsers: false,
};

console.log(renderBillingEditRoute(editorUser)); // "Rendering billing edit form"
console.log(renderBillingEditRoute(viewerUser)); // "Access denied: ..."
```

The intersection `CanViewBilling & CanEditBilling` precisely expresses "both of these capability flags must be `true`" as a type — a plain union of permission strings (`"viewBilling" | "editBilling"`) could only express "has at least one of these," which is the wrong logical operator for a route that genuinely requires both simultaneously. Composing capability requirements this way scales cleanly to routes needing three or more combined capabilities (`CanViewBilling & CanEditBilling & CanManageUsers`) without needing a new named type for every combination that shows up in the route table.
